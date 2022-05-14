import React from 'react'
import CreateBooking from './CreateBooking';
import FileUpload from './FileUpload';

const DasboardPanel = (props) => {
  switch (props.page){
    case('tao-lich-hen'): 
      return <CreateBooking />;
    break;
    case('thu-vien'): 
    return <FileUpload />;
  break;
    default: return 'demo';
  }
}

export default DasboardPanel