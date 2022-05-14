import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { House, Calendar2Plus, CalendarWeek, PencilSquare, ArrowReturnRight, Images } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const DasboardNav = () => {
  return (
    <ListGroup>
    <ListGroup.Item>
        <Link className='nav-link' to='/tai-khoan/trang-ca-nhan'>
          <House height={16} width={16} fill="black" className='me-2'/>
          Trang cá nhân
        </Link>
    </ListGroup.Item> 
    <ListGroup.Item>
        <Link className='nav-link text-dark' to='/tai-khoan/tao-lich-hen'>
          <Calendar2Plus height={16} width={16} fill="black" className='me-2'/>
          Tạo lịch hẹn
        </Link>
    </ListGroup.Item>
    <ListGroup.Item>
      <Link className='nav-link text-dark' to='/tai-khoan/quan-ly-lich-hen'>
        <CalendarWeek height={16} width={16} fill="black" className='me-2'/>
        Quản lý lịch hẹn
        </Link>
    </ListGroup.Item>
    <ListGroup.Item>
      <Link className='nav-link text-dark' to='/tai-khoan/thu-vien'>
        <Images height={16} width={16} fill="black" className='me-2'/>
        Quản lý thư viện
      </Link>
      </ListGroup.Item>
    <ListGroup.Item>
      <Link className='nav-link text-dark' to='/tai-khoan/chinh-sua-thong-tin'>
        <PencilSquare height={16} width={16} fill="black" className='me-2'/>
        Chỉnh sửa thông tin
      </Link>
      </ListGroup.Item>
    <ListGroup.Item>
      <Link className='nav-link text-dark' to='/tai-khoan/dang-xuat'>
        <ArrowReturnRight height={16} width={16} fill="black" className='me-2'/>
        Đăng xuất
      </Link>
    </ListGroup.Item>
  </ListGroup>
  )
}

export default DasboardNav