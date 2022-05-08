import React, { useEffect } from 'react'
import { Navbar, Nav, NavDropdown, Dropdown, Container, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { userData, updateUser, userLoggout } from '../features/user/userSlice';

const Header = () => {

  const dispatch =  useDispatch();
  const UserDataContent = useSelector(userData);
  const userDataSessions = JSON.parse(sessionStorage.getItem('userData'));

  useEffect(() => {
    if(userDataSessions){
      dispatch(updateUser(userDataSessions))
    }
  },[dispatch])

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home"><span className='fw-bolder'>VUPHAM. BÔKING</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" to={'/'}>Trang chủ</Link>
            <Link className="nav-link" to={'/dang-ky'}>Đăng ký</Link>
            <Link className="nav-link" to={'/dang-nhap'}>Đăng nhập</Link>
            </Nav>
        </Navbar.Collapse>
        {
          UserDataContent && UserDataContent.user_name != '' ?  
            <>
             <Link to={'/tai-khoan'}><Button className='me-2'>Xin chào {UserDataContent.user_name}</Button></Link>
             <Button onClick={() => { dispatch(userLoggout()) }}>Đăng xuất</Button>
            </> :
            <Link to={'/dang-nhap'}><Button>Đăng nhập</Button></Link>
        }
      </Container>
    </Navbar>
  )
}

export default Header