import React, { useState, useEffect } from 'react';
import { Table ,Modal } from 'rsuite';
import { format } from 'date-fns';
import { getUserInforAsync, userInformation } from '../../features/user/userSlice';
import { getScheduleAsync, dataGetSchedule } from '../../features/schedule/ScheduleSlice';
import { getBookingByIdAsync, dataBookingById} from '../../features/booking/GetBookingById';
import { updateBookingQtyAsync, updateBookingQtyData} from '../../features/booking/UpdateBookingQty';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { AxiosInstance } from '../../features/Instance';
import Swal from "sweetalert2";

const urlScheduleHandle = `${process.env.REACT_APP_SERVER_URL}/schedule`;

const ScheduleManager = () =>  {
    const dispatch = useDispatch();
    const UserNow = useSelector(userInformation);
    const schedules = useSelector(dataGetSchedule);
    const booking = useSelector(dataBookingById);
    const bookingUpdateQty = useSelector(updateBookingQtyData);

    useEffect(()=>{
        dispatch(getUserInforAsync())
        dispatch(getScheduleAsync())
    },[dispatch])

    
    //Change Role User
    const changeStatusSchedule = async (id,status) =>{
        await AxiosInstance.patch(`${urlScheduleHandle}/change/${id}?status=${status}`)
        .then((res) => { 
            Swal.fire({
                text: `${res.data.message}`,
                icon: "success",
            });
        dispatch(getScheduleAsync())
        }).catch((res) => { 
            Swal.fire({
                text: res.message,
                icon: "error",
            });
        })
    }

    const changeQuantityService = async (data,status) =>{
        let newTimeData = {};
        let maxPosition = false;
        if(booking._id  === data.idService){
            let abc = booking ? Object.keys(booking).
            filter((key) => key.includes('time')).
            reduce((cur, key) => { return Object.assign(cur, { [key]: booking[key] })}, {}) : 'abc' ;
            let time = abc ? Object.keys(abc).
                filter((key) => key.includes('time')).
                reduce((cur, key) => { return Object.assign(cur, { [key]: abc[key] })}, {}) : 'abc' ;
            let newTimePick = [];
            if(time){
                time.time.map((val) => {
                    if(val.timeStart === data.timePick.timeStart && val.timeEnd === data.timePick.timeEnd){
                        if(status === 'success'){
                            let quatity = parseInt(val?.qtyNow ? val.qtyNow : val.qty);
                            if(quatity > 0){
                                newTimeData ={ ...val, qtyNow: quatity - 1}
                                newTimePick.push(newTimeData);
                            }else{
                                maxPosition = true;
                                newTimePick.push({...val, qtyNow: parseInt(val?.qtyNow)});
                                Swal.fire({
                                    text: "Đã hết chổ trống đặt hẹn",
                                    icon: "error",
                                });
                            }
                        }
                        if(status === 'fail'){
                            if(val?.qtyNow < parseInt(val.qty)){
                                newTimeData ={...val, qtyNow: parseInt(val?.qtyNow) + 1}
                                newTimePick.push(newTimeData);
                            }else{
                                newTimePick.push({...val, qtyNow: parseInt(val.qty)});
                            }
                        }
                    }else{
                        newTimePick.push(val);
                    }
                    return newTimePick;
                });
            }
            let dataTimePick = {timePick: newTimePick};
            const req = {
                id: data.idService,
                dataTimePick: dataTimePick
            }
            console.log(req)
            if(!maxPosition){
                dispatch(updateBookingQtyAsync(req));
                dispatch(getBookingByIdAsync(data.idService));
                changeStatusSchedule(data._id, status);
            }
        }else{
            Swal.fire({
                text: "Fail",
                icon: "error",
            });
        }
    }

    const TimepickCell = ({ rowData, dataKey, ...props }) => (
        <Table.Cell {...props}>
          {rowData[dataKey].timeStart} - {rowData[dataKey].timeEnd}
        </Table.Cell>
    );
    
    const CreatedAtCell = ({ rowData, dataKey, ...props }) => (
        <Table.Cell {...props}>
          { format(new Date(rowData[dataKey]), 'HH:mm, dd/MM/yyyy') }
        </Table.Cell>
    );
    
    //Modal
    const [ scheduleData, setScheduleData] = useState();
    const [open, setOpen] = useState(false);
    const openModalView = (data) => {
        setScheduleData(data);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }
    
    const setDataBooking = (id) => {
        if(booking._id !== id){
            dispatch(getBookingByIdAsync(id));
        }
        return;
    }

    const handleChangeStatus = (rowData, status) => {
        setDataBooking(rowData.idService);
        changeQuantityService(rowData,status);
    }

    const handleLink = (rowData) => {
        if(rowData.status === 'pending'){
            return (
                <>
                <a className='btn btn-warning me-2' onClick={() => {handleChangeStatus(rowData,'fail')}}> Không chấp nhận </a>
                <a className='btn btn-success' onClick={() => {handleChangeStatus(rowData,'success')}}> Chấp nhận </a>
                </>
            )
        }
        if(rowData.status === 'success'){
            return (
                <a className='btn btn-warning' onClick={() => {handleChangeStatus(rowData,'fail')}}> Không chấp nhận </a>
            )
        }else{
            return (
                <a className='btn btn-success' onClick={() => {handleChangeStatus(rowData,'success')}}> Chấp nhận </a>
            )
        }
    }

    const ScheduleView = ({data}) => {
        const schedulehandle = data;
        setDataBooking(schedulehandle.idService);
        
        return(
            <>
            <Modal.Header>
                <Modal.Title>
                    Thông tin chi tiết lịch đặt
                </Modal.Title>
            </Modal.Header> 
            <Modal.Body>
                {
                    <Container>
                        <Row>
                            <Col lg={12}>
                            <h3>Thông tin lich hen</h3>
                            { booking ? booking.title : ''}
                            
                            <h3>Thông tin người đặt</h3>
                            { schedulehandle.ortherInfo ? 
                                Object.values(schedulehandle.ortherInfo).map((val, index) => {
                                    return(  
                                        <p key={index}>{`${val.label}: ${val.value}`}</p> 
                                    )
                                })
                              : ''  
                            }
                            </Col>
                        </Row>
                    </Container>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' className='me-2' onClick={handleClose} appearance="subtle">
                  Đóng
                </Button>
                {handleLink(schedulehandle)}
              </Modal.Footer>
            </>
        )
    }

    return (
        <>
            <Table
            autoHeight={true}
            data={schedules}
            rowKey="_id"    
            // onRowClick={data => {
            //     openModalView(data);
            // }}
            >
            <Table.Column width={200} align="center" fixed>
                <Table.HeaderCell>Name Service</Table.HeaderCell>
                <Table.Cell dataKey="titleService" />
            </Table.Column>

            <Table.Column width={130} align="center" fixed>
                <Table.HeaderCell>Thời gian diễn ra</Table.HeaderCell>
                <TimepickCell dataKey="timePick" />
            </Table.Column>
            <Table.Column width={150} align="center" fixed>
                <Table.HeaderCell>Thời gian đặt</Table.HeaderCell>
                <CreatedAtCell dataKey="createdAt" />
            </Table.Column>
            <Table.Column width={100} align="center" fixed>
                <Table.HeaderCell>Trạng thái</Table.HeaderCell>
                <Table.Cell dataKey="status" />
            </Table.Column>

            <Table.Column width={150} align="center" fixed="right">
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
              <ScheduleView data={(scheduleData)}/>
              
          </Modal>
        </>
    );
}

export default ScheduleManager;