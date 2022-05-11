import React, { useEffect, useState } from 'react'
import { Navbar, Nav, NavDropdown, Dropdown, Container, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLoggout } from '../features/user/loginUser';
import { refreshTokenStatus, refreshTokenData, refreshTokenAsync } from '../features/user/refreshTokenSlice';
import { userInformation, userInformationStatus, getUserInforAsync } from '../features/user/userSlice';
import { useLocation } from 'react-router-dom';

const Header = () => {

  const location = useLocation();
  const dispatch = useDispatch();
  
  // Refresh Token
  const refreshTokenDataSelect = useSelector(refreshTokenData);
  const refreshTokenStatusSelect = useSelector(refreshTokenStatus);

  // User Information 
  const userInformationSelect = useSelector(userInformation);
  const userInformationStatusSelect = useSelector(userInformationStatus);

  const [userDataSessions,  setuserDataSessions] = useState('');

  let loaded = false;

  useEffect(() => {
    if(!loaded){
      const JSONSession = JSON.parse(sessionStorage.getItem('userAccount'));
      if(JSONSession != undefined){
        setuserDataSessions(JSONSession);
      }
      if(userDataSessions.expiredAt < Date.now()){
        dispatch(refreshTokenAsync(userDataSessions.refreshToken));
      } else {
        if( !userInformationSelect ){
          dispatch(getUserInforAsync(JSONSession.token));
        }
      }
    }     
    loaded = true;
  },[dispatch, refreshTokenDataSelect, userInformationSelect, location.pathname])
  
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
          userInformationSelect && userInformationSelect.username != '' ?  
            <>
             <Link to={'/tai-khoan'}><Button className='me-2'>Xin chào { userInformationSelect.username }</Button></Link>
             <Button onClick={() => { dispatch(userLoggout()) }}>Đăng xuất</Button>
            </> :
            <Link to={'/dang-nhap'}><Button>Đăng nhập</Button></Link>
        }
      </Container>
    </Navbar>
  )
}

export default Header