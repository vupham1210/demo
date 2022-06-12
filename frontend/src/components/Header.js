import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInforAsync, userInformation, removeUserInfor } from '../features/user/userSlice';
import { isLoggedInUser, loggoutUser } from '../features/user/loginUser';
import Brand from '../images/logo.svg';
import { CalendarEvent, CaretDownFill, Person, BoxArrowInRight } from 'react-bootstrap-icons';

const Header = () => {
  // Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    return navigate("/dang-nhap/");
  }

  return (
    <Navbar className='mainHeader' bg="white" expand="lg">
      <Container>
        <Navbar.Brand href="#home"><img className='brand' src={Brand} alt="Vu Pham Booking" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" to={'/'}>Trang chủ</Link>
            <Link className="nav-link" to={'/booking/'}>Booking</Link>
            { !userInformationSelect ? 
            <>
            <Link className="nav-link" to={'/dang-ky'}>Đăng ký</Link>
            <Link className="nav-link" to={'/dang-nhap'}>Đăng nhập</Link>
            </>
            : ''
            }
            </Nav>
        </Navbar.Collapse>
        {
          userInformationSelect ?  
            <>
              <div className="greeting me-3">
                <span>Xin chào { userInformationSelect.username } <CaretDownFill /> </span>
                <div className='greetingMenu'>
                  <Link className='btn btn-success mb-2' to={'/tai-khoan/trang-ca-nhan'}>
                    <Person />
                    Vào tài khoản</Link>
                  <Button onClick={() => { loggout(); }}>
                    <BoxArrowInRight className='me-2'/>
                    Đăng xuất
                  </Button>
                </div>
              </div>
             <button className='createBooking btn'>
                <CalendarEvent className='me-2' />
                Tạo event
             </button>
            </> :
            <Link to={'/dang-nhap'}><Button>Đăng nhập</Button></Link>
        }
      </Container>
    </Navbar>
  )
}

export default Header