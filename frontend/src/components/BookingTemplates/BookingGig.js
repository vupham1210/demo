import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Panel } from 'rsuite'
const BookingGig = ({booking}) => {
  return (
    booking ? 
    <Panel 
        className='mb-3'
        bordered>
        {
          booking.thumbnail ? <img className='w-100' src={booking.thumbnail.path} alt={booking.title}/> : ''
        }
        <Panel 
        header={
          <Link to={`/booking/${booking.slug}`}> 
              <h3>{booking.title}</h3>
          </Link>}>
          <p>
              <small>
                A suite of React components, sensible UI design, and a friendly development experience.
              </small>
          </p>
        </Panel>
    </Panel>
    : ''
  )
}

export default BookingGig
