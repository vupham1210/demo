import React, { useEffect, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import BookingGig from '../../components/BookingTemplates/BookingGig'
import { getBookingByIdAsync, dataBookingById } from '../../features/booking/GetBookingByIdUser'
import { Row, Col } from 'react-bootstrap'
import { useLocation, useParams } from 'react-router-dom'

const BookingOfUser = (userID) => {
    const { iduser } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const pathname = location.pathname;
    const dataBooking = useSelector(dataBookingById);

    useEffect(() => {
        dispatch(getBookingByIdAsync(iduser))
    },[dispatch, pathname])

    if(dataBooking != []){
        return(
            <>
            <Row className='mt-5'>
                {
                dataBooking.length > 0 ?
                dataBooking.map((val) => {
                    return (
                        <Col xs={12} md={4} key={val._id}>
                            <BookingGig booking={val}/>
                        </Col>
                        )
                    }) : ''
                }
            </Row>
            </>
        )
      } else return;
}

export default BookingOfUser