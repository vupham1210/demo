import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadBookingAsync } from '../../features/booking/ManagerBooking'

const ManagerBooking = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadBookingAsync());
    }, [dispatch])
  return (
    <div>ManagerBooking</div>
  )
}

export default ManagerBooking