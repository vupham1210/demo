import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInforAsync, userInformation } from '../../features/user/userSlice';
import { dataSearchSchedule, searchScheduleAsync } from '../../features/schedule/SearchSchedules';

const SchedulesHistory = () => {
    const dispatch = useDispatch();
    const UserNow = useSelector(userInformation);
    const dataSearch = useSelector(dataSearchSchedule)

    useEffect(()=>{
        dispatch(getUserInforAsync())
        dispatch(searchScheduleAsync(UserNow?.email))
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
                <DataBookingCell dataKey="idService" />
            </Table.Column>

            <Table.Column width={200} align="center" fixed>
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
            </Table>
        </>
    );
}

export default SchedulesHistory;