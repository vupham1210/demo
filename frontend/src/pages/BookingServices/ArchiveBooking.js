import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BookingGig from '../../components/BookingTemplates/BookingGig'
import { loadBookingAsync, dataBookingServices } from '../../features/booking/ManagerBooking'
import { Row, Col } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

const ArchiveBooking = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const pathname = location.pathname;
    const Databooking = useSelector(dataBookingServices);
    
    useEffect(() => {
        dispatch(loadBookingAsync());
    }, [dispatch, pathname])
  console.log(Databooking);
  if(Databooking != []){
    return(
      <Row>
          {
            Databooking.length > 0 ?
              Databooking.map((val) => {
                return (
                   <Col xs={12} md={4} key={val._id}>
                      <BookingGig booking={val}/>
                    </Col>
                  )
              }) : ''
          }
      </Row>
    )
  } else return;
}
export default ArchiveBooking