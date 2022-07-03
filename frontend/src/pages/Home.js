import React from 'react';
import Vendor from '../components/Vendor';

const Home = () => {
  return (
    <>
      <div id="main-buttons">
        <div className="container-fluid column">
          <div className="wrapper">
            <div className="inner">
                <div className="company-name ">
                  Vu Pham Booking
                </div>
                <div className="bar">
                  <a className="btn book custom" href="#book">Book Now</a>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section section-vendor pb-5 mb-5">
        <div className="container">
          <div className="row">
            <div className="title-main text-center border-bottom mt-3 mb-5 py-3">
              <h1>Services Booking</h1>
            </div>
            <Vendor />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home