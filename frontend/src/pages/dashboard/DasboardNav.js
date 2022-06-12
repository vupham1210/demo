import React, { useEffect,useState } from 'react'
import { House, People, Calendar2Plus, CalendarWeek, ArrowReturnRight, Images } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Sidenav, Nav, Dropdown, Toggle } from 'rsuite';
import { getUserInforAsync, userInformation } from '../../features/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';


const DasboardNav = () => {
  const dispatch = useDispatch();
  const User = useSelector(userInformation);
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState('1');

  useEffect(() => {
      dispatch(getUserInforAsync());
  }, [dispatch])

  return (
    <>
      <Sidenav
        expanded={expanded}
            defaultOpenKeys={['3', '4']}
            activeKey={activeKey}
            onSelect={setActiveKey}>
          <Sidenav.Body>
            
            <Nav>
              <Nav.Item as='li' className="ps-3" eventKey="1" icon={<House height={16} width={16} fill="black" className='me-2'/>}>
                  <Link to='/tai-khoan/trang-ca-nhan'>
                    Trang cá nhân
                  </Link>
              </Nav.Item> 
              { (User?.role == 'admin') 
              ? <>
              <Nav.Item as='li' className="ps-3" eventKey="2" icon={<People height={16} width={16} fill="black" className='me-2'/>}>
                    <Link to='/tai-khoan/quan-ly-tai-khoan'>
                      Quản lí tài khoản
                    </Link>
                </Nav.Item> </> 
              : ''}
              { (User?.role == 'vendor' || User?.role == 'admin') 
              ? <>
              <Nav.Item as='li' className="ps-3" eventKey="3" icon={<Calendar2Plus height={16} width={16} fill="black" className='me-2'/>}>
                    <Link className='text-dark' to='/tai-khoan/tao-lich-hen'>
                      Tạo lịch hẹn
                    </Link>
                </Nav.Item>
                <Nav.Item as='li' className="ps-3" eventKey="4" icon={<CalendarWeek height={16} width={16} fill="black" className='me-2'/>}>
                  <Link className='text-dark' to='/tai-khoan/quan-ly-lich-hen'>
                    Quản lý lịch hẹn
                    </Link>
                </Nav.Item>
                </>
              : '' }
              
              <Nav.Item as='li' className="ps-3" eventKey="5" icon={<Images height={16} width={16} fill="black" className='me-2'/>}>
                <Link className='text-dark' to='/tai-khoan/thu-vien'>
                  Quản lý thư viện
                </Link>
                </Nav.Item>
              <Nav.Item  as='li' className="ps-3" eventKey="6" icon={<ArrowReturnRight height={16} width={16} fill="black" className='me-2'/>}>
                <Link className='text-dark' to='/tai-khoan/dang-xuat'>
                  Đăng xuất
                </Link>
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
      </Sidenav>
      <Toggle
        onChange={setExpanded}
        checked={expanded}
        checkedChildren="Expand"
        unCheckedChildren="Collapse"
      />
    </>
  )
}

export default DasboardNav