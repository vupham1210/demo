import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Table, Button } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInforAsync, userInformation } from '../../features/user/userSlice';
import { dataSearchSchedule, searchScheduleAsync } from '../../features/schedule/SearchSchedules';
import swal from 'sweetalert2';
import { AxiosInstance } from '../../features/Instance';

const scheduleHandle = `${process.env.REACT_APP_SERVER_URL}/schedule`;

const SchedulesHistory = () => {
    const dispatch = useDispatch();
    const UserNow = useSelector(userInformation);
    const dataSearch = useSelector(dataSearchSchedule)

    useEffect(()=>{
        dispatch(getUserInforAsync())
        dispatch(searchScheduleAsync(UserNow?.email))
    },[dispatch])


    const ScheduleDelete = async (data) => {
        await AxiosInstance.delete(`${scheduleHandle}/delete/${data?._id}`)
        .then((res) => { 
          swal.fire({
            title: res.data.title,
            text: res.data.message,
            icon: "success",
          });
          dispatch(searchScheduleAsync(UserNow?.email))
        }).catch((res) => { 
          swal.fire({
            title: res.data.title,
            text: res.data.message,
            icon: "error",
          });
        })
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
    const DataBookingCell = ({ rowData, dataKey, ...props }) =>(
        <Table.Cell {...props}>
            { rowData[dataKey] } 
        </Table.Cell>
    );

    return (
        <>
            <Table
            height={420}
            data={dataSearch?.data}
            onRowClick={data => {
                console.log(data);
            }}
            >
            <Table.Column width={200} align="center" fixed>
                <Table.HeaderCell>Name Service</Table.HeaderCell>
                <DataBookingCell dataKey="titleService" />
            </Table.Column>

            <Table.Column width={150} align="center" fixed>
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
            <Table.Column width={150} align="center" fixed>
                <Table.HeaderCell>Thời gian xử lí</Table.HeaderCell>
                <CreatedAtCell dataKey="updatedAt" />
            </Table.Column>
            <Table.Column width={100} align="center" fixed>
                <Table.HeaderCell>Action</Table.HeaderCell>
                <Table.Cell>
                {rowData => {
                    
                    return (
                    <span>
                        <a className='text-danger fw-bold' onClick={() => {ScheduleDelete(rowData)}}>Xóa</a>
                    </span>
                    );
                }}
                    
                </Table.Cell>
            </Table.Column>
            </Table>
        </>
    );
}

export default SchedulesHistory;