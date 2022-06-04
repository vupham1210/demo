import React, { useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import { Clock } from 'react-bootstrap-icons';

import { loadSingBookingAsync,
         dataSingleBookingServices,
         statusSingleBookingServices }
         from '../../features/booking/ManagerSingleBooking'

import { Button } from 'rsuite';


const SingleBooking = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const Slug = params.slug;
    console.log(Slug);
    const SingleData = useSelector(dataSingleBookingServices);

    useEffect(() => {
        dispatch(loadSingBookingAsync(Slug));
    }, [dispatch])

    if(SingleData){
        return (
            <Row>
                <Col xs={6}>
                    <Card>
                        <Card.Header>
                            {
                                SingleData.thumbnail ? <img className='w-100' src={SingleData.thumbnail.path} /> : ''
                            }
                            
                            <h3>{SingleData.title}</h3>
                            <p>
                                <Clock width={20} height={20}  fill={'black'}/>
                                {SingleData.startDate}
                            </p>
                            <p>
                                <Clock width={20} height={20}  fill={'black'}/>
                                {SingleData.endDate}
                            </p>
                        </Card.Header>
                        <Card.Body>
                            <p>{SingleData.content}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={4}>
                    {
                        SingleData.time ? 
                            <>
                                <h3>Giờ tham dự</h3>
                                <ListGroup>
                                    {
                                        SingleData.time.map((val, index) => {
                                            return(
                                                <ListGroup.Item key={index}>{val.timeStart} - {val.timeEnd}</ListGroup.Item>
                                            )
                                        })
                                    }
                                </ListGroup>
                                <Button color="blue" appearance="primary">Đăng ký</Button>
                            </>
                        : ''
                    }
                     
                </Col>
               
            </Row>
        )
    } else {
        return
    }
   
}

export default SingleBooking