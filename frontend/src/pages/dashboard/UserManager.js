import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { format } from 'date-fns'
import { Modal } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getVendorsInforAsync, VendorsData } from '../../features/user/getVendor';
import { getSubscribersInforAsync, SubcribersData } from '../../features/user/getSubcriber';
import { getUserInforAsync, userInformation } from '../../features/user/userSlice';
import { AxiosInstance } from '../../features/Instance';
import swal from 'sweetalert2';

const urlUserHandle = `${process.env.REACT_APP_SERVER_URL}/users`;


const UserManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vendor = useSelector(VendorsData);
  const subcriber = useSelector(SubcribersData);
  const UserNow = useSelector(userInformation);

  useEffect(()=>{
    dispatch(getUserInforAsync())
    dispatch(getVendorsInforAsync())
    dispatch(getSubscribersInforAsync())
  },[dispatch])

  //delete User
  const deleteUser = async(id) => {
    await AxiosInstance.delete(`${urlUserHandle}/delete/${id}`)
    .then((res) => { 
      swal.fire({
        text: res.message,
        icon: "success",
        type: "success"
      });
      dispatch(getVendorsInforAsync())
      dispatch(getSubscribersInforAsync())
    }).catch((res) => { 
      swal.fire({
        text: res.message,
        icon: "error",
        type: "error"
      });
    })
  }

  //Change Role User
  const changeRoleUser = async (id,role) =>{
    await AxiosInstance.patch(`${urlUserHandle}/userhandle/${id}?role=${role}`)
    .then((res) => { 
      swal.fire({
        text: res.username+ "Đã được cập nhật",
        icon: "success",
        type: "success"
      });
      dispatch(getVendorsInforAsync())
      dispatch(getSubscribersInforAsync())
    }).catch((res) => { 
      swal.fire({
        text: res.message,
        icon: "error",
        type: "error"
      });
    })
  }
  
  // Modal 
  const [ userData, setUserData] = useState();
  const [open, setOpen] = useState(false);
  
  const handleOpenSingle = (data) => {
    setUserData(data);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  }

  const handleOpenChange = (data,role) => {
    changeRoleUser(data,role);
  };

  const handleOpenDelete = (data) => {
    deleteUser(data);
  };

  const UserView = ({data}) => {
    const userhandle = data;
    return(
      <>
        <Modal.Header>
          <Modal.Title>
            {(userhandle.firstname) ? 
              userhandle.firstname +' '+ userhandle.lastname
              : userhandle.username
            }
          </Modal.Title>
        </Modal.Header> 
        <Modal.Body>
          <Row className='m-0'>
            <Col lg={6}>
              <div className='img-user text-center'>
                {userhandle.avatar ? 
                <img width={200} height={200} src={userhandle.avatar}/>
                : 'Chưa có ảnh đại diện'
                }
              </div>
            </Col>
            <Col lg={6}>
              <div className='infor-user'>
                <p><strong>Address: </strong>{userhandle.address ? userhandle.address : 'Chưa cập nhật thông tin'}</p>
                <p><strong>Email: </strong>{userhandle.email}</p>
                <p><strong>Phone: </strong>{userhandle.phone}</p>
                <p><strong>Số CCCD: </strong>{userhandle.personal_id ? userhandle.personal_id : 'Chưa cập nhật thông tin'}</p>
                <p><strong>Ngày sinh: </strong>{userhandle.birth_day ? format(new Date(userhandle.birth_day), 'dd/MM/yyyy') : 'Chưa cập nhật thông tin'}</p>
                <p><strong>Role: </strong>{userhandle.role}</p>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </>
    )
  }
  if(vendor && subcriber && (UserNow.role == 'admin')){
  return (
  <div>
    <h2 className='title-table pb-3'>Tài khoản khách thuê dịch vụ</h2>
      <Table striped bordered hover>
          <thead>
            <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {
              vendor.map((val,index) => {
                  return(
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{val.username}</td>
                      <td>{val.email}</td>
                      <td>
                        <Button variant='primary' 
                        className='me-2' 
                        onClick={() =>{handleOpenSingle(val)}} 
                        appearance="subtle">
                          Xem thông tin
                        </Button>
                        <Button variant='warning' 
                        className='me-2' 
                        onClick={() =>{handleOpenChange(val._id,'subscriber')}} 
                        appearance="subtle">
                        Hủy Vendor
                        </Button>
                        <Button variant='danger' 
                        className='me-2' 
                        onClick={() =>{handleOpenDelete(val._id)}} 
                        appearance="subtle">
                        Xóa tài khoản
                        </Button>
                      </td>
                    </tr>
                  )
              })
          }  
          </tbody>
          </Table>
          <h2 className='title-table border-top py-3'>Tài khoản khách hàng</h2>
          <Table striped bordered hover>
          <thead>
            <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {
              subcriber.map((val,index1) => {
                  return(
                    <tr key={val._id}>
                      <td>{index1 + 1}</td>
                      <td>{val.username}</td>
                      <td>{val.email}</td>
                      <td>
                        <Button variant='primary' className='me-2' onClick={() =>{handleOpenSingle(val)}} appearance="subtle">
                          Xem thông tin
                        </Button>
                        <Button variant='success' className='me-2' onClick={() =>{handleOpenChange(val._id,'vendor')}} appearance="subtle">
                          Chuyển Vendor
                        </Button>
                        <Button variant='danger' 
                        className='me-2' 
                        onClick={() =>{handleOpenDelete(val._id)}} 
                        appearance="subtle">
                        Xóa tài khoản
                        </Button>
                      </td>
                    </tr>
                  )
              })
          }  
          </tbody>
          </Table>
          <Modal size={'md'} open={open} onClose={handleClose} aria-labelledby="contained-modal-title-vcenter" centered="true">
              <UserView data={userData}/>
              <Modal.Footer>
                <Button variant='danger' className='me-2' onClick={handleClose} appearance="subtle">
                  Đóng
                </Button>
              </Modal.Footer>
          </Modal>
  </div>
  )
}else{
  return navigate("/tai-khoan/trang-ca-nhan");
}
}

export default UserManager