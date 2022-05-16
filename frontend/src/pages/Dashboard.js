import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, Card, ListGroup, Form } from 'react-bootstrap'
import { House, Calendar2Plus, CalendarWeek, PencilSquare, ArrowReturnRight, Images } from 'react-bootstrap-icons';
import { Link, useLocation, useParams } from 'react-router-dom';
import DasboardPanel from './dashboard/DasboardPanel';
import DasboardNav from './dashboard/DasboardNav';

const Dashboard = () => {

  const { slug } = useParams();
  
  return (
    <Container className="py-4">
      <Row>
        <Col className='col-auto'>
            <DasboardNav />
        </Col>
        <Col>
            <DasboardPanel page={slug} />
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard