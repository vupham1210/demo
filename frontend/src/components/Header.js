import React from 'react'
import { Navbar, Nav, NavDropdown, Dropdown, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home"><span className='fw-bolder'>VUPHAM. BÔKING</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" to={'/'}>Trang chủ</Link>
            <Link className="nav-link" to={'/dang-ky'}>Đăng ký</Link>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header