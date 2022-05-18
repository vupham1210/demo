import React from 'react'
import CreateBooking from './CreateBooking';
import FileUpload from './FileUpload';
import ManagerBooking from './ManagerBooking';

const DasboardPanel = (props) => {
  switch (props.page){
    case('tao-lich-hen'): 
      return <CreateBooking />;
    break;
    case('thu-vien'): 
      return <FileUpload />;
    break;
    case('quan-ly-lich-hen'): 
      return <ManagerBooking />;
    break;
    default: return 'demo';
  }
}

export default DasboardPanel