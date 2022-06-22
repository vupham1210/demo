import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col} from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import DasboardPanel from './dashboard/DasboardPanel';
import DasboardNav from './dashboard/DasboardNav';

const Dashboard = () => {

  const { slug } = useParams();
  
  return (
    <Container className="py-4">
      <Row>
        <Col xs={12} md={3}>
            <DasboardNav />
        </Col>
        <Col xs={12} md={9}>
            <DasboardPanel page={slug} />
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard