import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BookingGig from '../../components/BookingTemplates/BookingGig'
import { loadBookingAsync, dataBookingServices } from '../../features/booking/ManagerBooking'
import { Row, Col } from 'react-bootstrap'

const ManagerBooking = () => {
    const dispatch = useDispatch();
    const Databooking = useSelector(dataBookingServices);
    
    useEffect(() => {
        dispatch(loadBookingAsync());
    }, [dispatch])

  if(Databooking){
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
              })
              : ''
          }
      </Row>
    )
  } else return;
}
export default ManagerBooking