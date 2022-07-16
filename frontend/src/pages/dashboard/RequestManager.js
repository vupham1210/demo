import React, { useState, useEffect } from 'react';
import { Table ,Modal } from 'rsuite';
import { format } from 'date-fns';
import { getUserInforAsync, userInformation } from '../../features/user/userSlice';
import { getContactAsync, dataGetContact } from '../../features/contact/ContactSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { AxiosInstance } from '../../features/Instance';
import Swal from "sweetalert2";

const urlContactHandle = `${process.env.REACT_APP_SERVER_URL}/contact`;

const RequestManager = () =>  {
    const dispatch = useDispatch();
    const UserNow = useSelector(userInformation);
    const requests = useSelector(dataGetContact);

    useEffect(()=>{
        dispatch(getUserInforAsync())
        dispatch(getContactAsync('idReceive'))
    },[dispatch])

    
    //Change Role User
    const changeStatusContact = async (id,status) =>{
        await AxiosInstance.patch(`${urlContactHandle}/change/${id}?status=${status}`)
        .then((res) => { 
            Swal.fire({
                text: `${res.data.message}`,
                icon: "success",
            });
        dispatch(getContactAsync('idReceive'))
        }).catch((res) => { 
            Swal.fire({
                text: res.message,
                icon: "error",
            });
        })
    }
    
    const CreatedAtCell = ({ rowData, dataKey, ...props }) => (
        <Table.Cell {...props}>
          { format(new Date(rowData[dataKey]), 'HH:mm, dd/MM/yyyy') }
        </Table.Cell>
    );
    
    //Modal
    const [ contactData, setContactData] = useState();
    const [open, setOpen] = useState(false);
    const openModalView = (data) => {
        setContactData(data);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }

    const handleChangeStatus = (rowData, status) => {
        setContactData(rowData);
        changeStatusContact(rowData._id, status);
    }

    const ContactView = ({data}) => {
        const contactHandle = data;
        const handleLink = (rowData) => {
            if(rowData.status === 'pending'){
                return (
                    <>
                    <a className='btn btn-warning me-2' onClick={() => {handleChangeStatus(rowData,'reject')}}> Từ chối </a>
                    <a className='btn btn-success' onClick={() => {handleChangeStatus(rowData,'accept')}}> Chấp nhận </a>
                    </>
                )
            }
            if(rowData.status === 'accept'){
                return (
                    <a className='btn btn-warning' onClick={() => {handleChangeStatus(rowData,'reject')}}> Từ chối </a>
                )
            }else{
                return (
                    <a className='btn btn-success' onClick={() => {handleChangeStatus(rowData,'accept')}}> Chấp nhận </a>
                )
            }
        }
        return(
            <>
            <Modal.Header>
                <Modal.Title>
                    {contactHandle.title}
                </Modal.Title>
            </Modal.Header> 
            <Modal.Body>
                {
                    <Container>
                        <Row>
                            <Col lg={12}>
                                {contactHandle.content}
                            </Col>
                        </Row>
                    </Container>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' className='me-2' onClick={handleClose} appearance="subtle">
                  Đóng
                </Button>
                {handleLink(contactHandle)}
              </Modal.Footer>
            </>
        )
    }

    return (
        <>
            <Table
            autoHeight={true}
            data={requests}
            rowKey="_id"    
            // onRowClick={data => {
            //     openModalView(data);
            // }}
            >
            <Table.Column width={200} fixed>
                <Table.HeaderCell>Nội dung</Table.HeaderCell>
                <Table.Cell dataKey="title" />
            </Table.Column>
            <Table.Column width={200} align="center" fixed>
                <Table.HeaderCell>ID Send</Table.HeaderCell>
                <Table.Cell dataKey="idSend" />
            </Table.Column>
            <Table.Column width={150} align="center" fixed>
                <Table.HeaderCell>Thời gian đặt</Table.HeaderCell>
                <CreatedAtCell dataKey="createdAt" />
            </Table.Column>
            <Table.Column width={100} align="center" fixed>
                <Table.HeaderCell>Trạng thái</Table.HeaderCell>
                <Table.Cell dataKey="status" className='fw-bold'/>
            </Table.Column>

            <Table.Column width={300} align="center" fixed="right">
                <Table.HeaderCell>Action</Table.HeaderCell>

                <Table.Cell>
                {rowData => {
                    
                    const handleModalRow = (rowData) => {
                        openModalView(rowData);
                    }
                    
                    return (
                    <span>
                        <a className='text-primary' onClick={() => {handleModalRow(rowData)}}>Xem chi tiết</a>
                        
                    </span>
                    );
                }}
                </Table.Cell>
            </Table.Column>
            </Table>
            <Modal size={'md'} open={open} onClose={handleClose} aria-labelledby="contained-modal-title-vcenter" centered="true">
              <ContactView data={(contactData)}/>
          </Modal>
        </>
    );
}

export default RequestManager;