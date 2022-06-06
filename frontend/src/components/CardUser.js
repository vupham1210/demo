import React from 'react';
import { GeoAlt } from 'react-bootstrap-icons';

const CardUser = ({data}) => {
    if(data != undefined){
        return (
            <div className="location-item item">
                <div className="tab tab-col tab-with-popup">
                    <div className="excerpt-info">
                    <div className="preloader">
                        <a href="#">
                        <div className="user img">
                            <img src={data.avatar} alt="" className="fit" />
                        </div>
                        </a>
                    </div>
                    <div className="tab-pd">
                        <div className="content">
                            <div className="cap short">{data.firstname} {data.lastname}</div>
                            <div className="bar with-mh">
                                    <div className="address d-flex"> 
                                    <GeoAlt width={25} height={25} className='me-2'/>
                                        <a data-toggle="modal" data-target="#">
                                            {data.address}
                                        </a>
                                    </div>
                            </div>
                        </div>
                    <div className="btn-bar">
                        <div className="btn select custom">
                            <a href="#">Select</a>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
        </div>
        )    
    } else {
        return ''
    }
   
}

export default CardUser;
