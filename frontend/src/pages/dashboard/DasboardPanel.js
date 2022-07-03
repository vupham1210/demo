import React from 'react'
import CreateBooking from './CreateBooking';
import FileUpload from './FileUpload';
import ManagerBooking from './ManagerBooking';
import ManagerUsers from './UserManager';
import Account from './Account';
import ManagetSchedule from './ScheduleManager';
import SearchSchedule from './SchedulesHistory';

const DasboardPanel = (props) => {
  switch (props.page){
    case('trang-ca-nhan'): 
      return <Account />;
    break;
    case('quan-ly-tai-khoan'): 
      return <ManagerUsers />;
    break;
    case('tao-lich-hen'): 
      return <CreateBooking />;
    break;
    case('quan-ly-lich-hen'): 
      return <ManagerBooking />;
    break;
    case('quan-ly-cuoc-hen'): 
      return <ManagetSchedule />;
    break;
    case('trang-thai-cuoc-hen'): 
      return <SearchSchedule />;
    break;
    case('thu-vien'): 
      return <FileUpload />;
    break;
    default: return 'demo';
  }
}

export default DasboardPanel