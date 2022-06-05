import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getVendorsInforAsync, VendorsData } from '../features/user/getVendor'
import CardUser from './CardUser'
import { Row, Col } from 'react-bootstrap'

const Vendor = () => {
  const dispatch = useDispatch();
  const user = useSelector(VendorsData);

  useEffect(()=>{
    dispatch(getVendorsInforAsync())
  },[dispatch])
  
  if(user != null){
    return (
        <Row className='Vendors'>
            {
                user.map((val) => {
                    return(
                        <Col xs={12} md={6} lg={4} key={val._id}>
                            <CardUser data={val}/>
                        </Col>
                    )
                })
            }
        </Row>
    )
  } else {
      return 'loading';
  }

}

export default Vendor