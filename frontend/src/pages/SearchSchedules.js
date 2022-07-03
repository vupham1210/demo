import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Table,  Input, InputGroup } from 'rsuite';
import { Search } from 'react-bootstrap-icons';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { dataSearchSchedule, searchScheduleAsync } from '../features/schedule/SearchSchedules';

const SchedulesHistory = () => {
    const dispatch = useDispatch();
    const dataSearch = useSelector(dataSearchSchedule)

    useEffect(()=>{
        dispatch(searchScheduleAsync())
    },[dispatch])

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
    const DataBookingCell = ({ rowData, dataKey, ...props }) =>(
        <Table.Cell {...props}>
            { rowData[dataKey] } 
        </Table.Cell>
    );

    //Search
    const [dataS, setDataS] = useState();
    const SubmitForm = (data) => {
        dispatch(searchScheduleAsync(data))
        if(dataSearch.data.length !== 0){
            setDataS(dataSearch);
        }
    }

    const getData = () => {
        if(dataSearch.data.length === 0){
            return dataS?.data;
        }else{
            return dataSearch?.data;
        }
    }

    return (
        <>
            <div id="main-buttons">
                <div className="container-fluid column">
                <div className="wrapper">
                    <div className="inner">
                        <div className="company-name ">
                            Tra cứu lịch hẹn
                        </div>
                        <div className="bar">
                        <a className="btn book custom" href="/">Book Now</a>
                        </div>
                    </div>
                </div>
                </div>
            </div>

                
                <Row className="align-items-center justify-content-center py-4">
                    <Col lg={6} xs={12} className='mb-4'>
                        <InputGroup>
                            <Input 
                                size="lg"
                                onChange={(e) => { SubmitForm(e) }}
                                placeholder="Nhập tên | email | số điện thoại đã điền trong form cuộc hẹn ..."
                            />
                            <InputGroup.Addon>
                                <Search />
                            </InputGroup.Addon>
                        </InputGroup>
                    </Col>
                    <Col lg={9} xs={12}>
                        <Table
                        height={420}
                        data={getData()}
                        onRowClick={data => {
                            console.log(data);
                        }}
                        >
                        <Table.Column width={200} align="center" fixed>
                            <Table.HeaderCell>Name Service</Table.HeaderCell>
                            <Table.Cell dataKey="titleService" />
                        </Table.Column>

                        <Table.Column width={200} align="center" fixed>
                            <Table.HeaderCell>Thời gian diễn ra</Table.HeaderCell>
                            <TimepickCell dataKey="timePick" />
                        </Table.Column>
                        <Table.Column width={150} align="center" fixed>
                            <Table.HeaderCell>Thời gian đặt</Table.HeaderCell>
                            <CreatedAtCell dataKey="createdAt" />
                        </Table.Column>
                        <Table.Column width={150} align="center" fixed>
                            <Table.HeaderCell>Trạng thái</Table.HeaderCell>
                            <Table.Cell dataKey="status" />
                        </Table.Column>
                        <Table.Column width={150} align="center" fixed>
                            <Table.HeaderCell>Thời gian xử lí</Table.HeaderCell>
                            <CreatedAtCell dataKey="updatedAt" />
                        </Table.Column>
                        </Table>
                    </Col>
                </Row>
        </>
    );
}

export default SchedulesHistory;