import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BookingGig from '../../components/BookingTemplates/BookingGig'
import { loadBookingAsync, dataBookingServices } from '../../features/booking/ManagerBooking'
import { Row, Col, Tab, Card, Button } from 'react-bootstrap'
import { Table, Modal } from 'rsuite'
import { format } from 'date-fns';
import { AxiosInstance } from '../../features/Instance';
import swal from 'sweetalert2';

const bookingHandle = `${process.env.REACT_APP_SERVER_URL}/booking`;

const ManagerBooking = () => {
    const dispatch = useDispatch();
    const Databooking = useSelector(dataBookingServices);
    
    useEffect(() => {
        dispatch(loadBookingAsync());
    }, [dispatch])
  

    const TimepickCell = ({ rowData, dataKey, ...props }) => (
      <Table.Cell {...props}>
        { format(new Date(rowData.startDate), 'dd/MM/yyyy') } { rowData.startEnd ? `- ${format(new Date(rowData.startEnd), 'dd/MM/yyyy')}` : '' }
      </Table.Cell>
  );
  
  const CreatedAtCell = ({ rowData, dataKey, ...props }) => (
      <Table.Cell {...props}>
        { format(new Date(rowData[dataKey]), 'HH:mm, dd/MM/yyyy') }
      </Table.Cell>
  );

  const DeleteBooking = async (data) => {
      await AxiosInstance.delete(`${bookingHandle}/delete/${data?._id}`)
      .then((res) => { 
        swal.fire({
          title: res.data.title,
          text: res.data.message,
          icon: "success",
        });
        setOpen(false);
        dispatch(loadBookingAsync());
      }).catch((res) => { 
        swal.fire({
          title: res.data.title,
          text: res.data.message,
          icon: "success",
        });
      })
  }

  const [dataService, setDataService] = useState();
  const [open, setOpen] = useState(false);
  const openModalView = (data) => {
    setDataService(data);
      setOpen(true);
  };
  const handleClose = () => {
      setOpen(false);
  }

  const ScheduleView = ({data}) => {
      return(
          <>
          <Modal.Header>
              <Modal.Title>
                  Thông tin chi tiết lịch hẹn
              </Modal.Title>
          </Modal.Header> 
          <Modal.Body>
              <div className='text-center'>
                <img src={data?.thumbnail.path} width='200' className='mb-3'/>
              </div>
              <h5 className='mb-2'>Tiêu đề: {data?.title}</h5>
              <p>{data?.content}</p>
              <p>{data?.location}</p>
              <h6>Các khoảng thời gian đặt lịch</h6>
              <Row className='my-3 m-0'>
              { data?.time.map((val,index) => {
                  return (
                    <Col key={index} md={6} className="mb-3 px-3">
                      <Card>
                        <Card.Header>
                          {val?.title}
                        </Card.Header>
                        <Card.Body>
                          <p><strong>Nội dung: </strong> {val?.content}</p>
                          <p><strong>Thời gian diễn ra: </strong> { val.timeStart } - { val.timeEnd }</p>
                          <p><strong>Số lượng đưa ra: </strong> {val?.qty}</p>
                          <p><strong>Số lượng còn lại: </strong> {val?.qtyNow ? val.qtyNow : val.qty}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
              })}
              </Row>
              <h6>Các trường yêu cầu nhập</h6>
              <Row className='my-3 m-0'>
              { data?.custom_field.map((val,index) => {
                  return (
                    <Col key={index} md={4} className="mb-3 px-3">
                      <Card>
                        <Card.Header>
                          {val?.name}
                        </Card.Header>
                      </Card>
                    </Col>
                  )
              })}
              </Row>
          </Modal.Body>
          <Modal.Footer>
              <Button variant='danger' className='me-2' onClick={handleClose} appearance="subtle">
                Đóng
              </Button>
              <Button variant='warning' className='me-2' onClick={() => DeleteBooking(data)} appearance="subtle">
                Xóa lịch hẹn
              </Button>
            </Modal.Footer>
          </>
      )
  }

  if(Databooking){
    return(
      <>
      <Table
            autoHeight={true}
            data={Databooking}
            rowKey="_id"    
            onRowClick={data => {
                openModalView(data);
            }}
            >
            <Table.Column width={300} align="center" fixed>
                <Table.HeaderCell>Name Service</Table.HeaderCell>
                <Table.Cell dataKey="title" />
            </Table.Column>
            <Table.Column width={300} align="center" fixed>
                <Table.HeaderCell>Thời gian diễn ra</Table.HeaderCell>
                <TimepickCell dataKey="" />
            </Table.Column>
            <Table.Column width={150} align="center" fixed>
                <Table.HeaderCell>Thời gian tạo lịch</Table.HeaderCell>
                <CreatedAtCell dataKey="createdAt" />
            </Table.Column>
            <Table.Column width={200} align="center" fixed="right">
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
              <ScheduleView data={(dataService)}/>
            </Modal>
      </>
    )
  } else return;
}
export default ManagerBooking