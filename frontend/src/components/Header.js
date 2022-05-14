import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserInforAsync, userInformation, removeUserInfor } from '../features/user/userSlice';
import { isLoggedInUser, loggoutUser } from '../features/user/loginUser';

const Header = () => {
  // Redux
  const dispatch = useDispatch();
  const userInformationSelect = useSelector(userInformation);
  const isLoggedInUserSelect = useSelector(isLoggedInUser);
  const localStorageToken = localStorage.getItem('token');
  let [isLoaded, setisLoaded] = useState(0);

  useEffect(() => {
    if(localStorageToken && isLoaded == 0){
      setisLoaded(++isLoaded);
      dispatch(getUserInforAsync());
    }
  }, [dispatch])

  useEffect(() => {
    if(isLoggedInUserSelect){
      dispatch(getUserInforAsync());
    }
  }, [isLoggedInUserSelect])

  const loggout = () => {
    dispatch(loggoutUser());
    dispatch(removeUserInfor());
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home"><span className='fw-bolder'>VUPHAM. BOOKING</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" to={'/'}>Trang chủ</Link>
            <Link className="nav-link" to={'/dang-ky'}>Đăng ký</Link>
            <Link className="nav-link" to={'/dang-nhap'}>Đăng nhập</Link>
            </Nav>
        </Navbar.Collapse>
        {
          userInformationSelect ?  
            <>
             <Link to={'/tai-khoan'}><Button className='me-2'>Xin chào { userInformationSelect.username }</Button></Link>
             <Button onClick={() => { loggout(); }}>Đăng xuất</Button>
            </> :
            <Link to={'/dang-nhap'}><Button>Đăng nhập</Button></Link>
        }
      </Container>
    </Navbar>
  )
}

export default Header