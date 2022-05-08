import React, { useEffect, useState, useRef } from 'react'
import { Button, Form } from 'react-bootstrap';

import { useSelector, useDispatch } from 'react-redux';
import { userData, userStatus, createUserAsync } from '../features/user/userSlice';

import Swal from 'sweetalert2';

const Register = () => {

  const inputUserName = useRef(null);
  const inputEmail = useRef(null);
  const inputPhone = useRef(null);
  const inputPassword = useRef(null);
  const inputRePassword = useRef(null);

  // Validate 
  const [isValidUserName, setIsValidUserName] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidRePassword, setIsValidRePassword] = useState(true);
  const [isSameRePassword, setSameRePassword] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    repassword: '',
  });

  // Redux 
  const dispatch = useDispatch();
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    if(inputUserName.current.value == ''){
      inputUserName.current.focus();
      setIsValidUserName(false);
    } else {
      setIsValidUserName(true);
    }
    if(inputEmail.current.value == ''){
      inputEmail.current.focus();
      setIsValidEmail(false);
    } else {
      setIsValidEmail(true);
    }
    if(inputPhone.current.value == ''){
      inputPhone.current.focus();
      setIsValidPhone(false);
    } else {
      setIsValidPhone(true);
    }
    if(inputPassword.current.value == ''){
      inputPassword.current.focus();
      setIsValidPassword(false);
    } else {
      setIsValidPassword(true);
    }
    if(inputRePassword.current.value == ''){
      inputRePassword.current.focus();
      setIsValidRePassword(false);
    } else {
      setIsValidRePassword(true);
    }
    if(inputRePassword.current.value != inputPassword.current.value){
      setSameRePassword(false);
    } else {
      setSameRePassword(true);
    }

    let Form =  {
      username: inputUserName.current.value,
      email: inputEmail.current.value,
      phone: inputPhone.current.value,
      password: inputPassword.current.value,
      repassword: inputRePassword.current.value,
    }

    setFormData(Form);
    
  };

  useEffect(() => {
    let isAllValidate = true;
    for (const iterator in formData) {
      if (!formData.hasOwnProperty(iterator)) continue;
      if(formData[iterator] == ''){
        isAllValidate = false
      }
    }

    if(isAllValidate){
      dispatch(createUserAsync(formData));
    }
  }, [formData]);

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Nhập tài khoản</Form.Label>
        <Form.Control className={!isValidUserName && 'formHelp'} ref={inputUserName} placeholder="Nhập Tên tài khoản"/>
        {!isValidUserName && <span className="inlineHelp"> Tên tài khoản không được để trống! </span>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nhập địa chỉ Email</Form.Label>
        <Form.Control className={!isValidEmail && 'formHelp'} ref={inputEmail} placeholder="Nhập địa chỉ Email"/>
        {!isValidEmail && <span className="inlineHelp">Địa chỉ Email không được để trống! </span>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nhập số điện thoại</Form.Label>
        <Form.Control className={!isValidPhone && 'formHelp'} ref={inputPhone} placeholder="Nhập số điện thoại"/>
        {!isValidPhone && <span className="inlineHelp"> Số điện thoại không được để trống! </span>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nhập mật khẩu</Form.Label>
        <Form.Control className={!isValidPassword && 'formHelp'} ref={inputPassword} type="email" placeholder="Nhập mật khẩu"/>
        {!isValidPassword && <span className="inlineHelp"> Mật khẩu không được để trống! </span>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nhập lại mật khẩu</Form.Label>
        <Form.Control className={!isValidRePassword || !isSameRePassword && isValidRePassword && 'formHelp'} ref={inputRePassword} placeholder="Nhập lại mật khẩu"/>
        {!isValidRePassword && <span className="inlineHelp"> Mật khẩu không được để trống! </span>}
        {!isSameRePassword && isValidRePassword && <span className="inlineHelp"> Nhập lại mật khẩu không đúng! </span>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Button variant='primary' onClick={onButtonClick}>Đăng ký</Button>
      </Form.Group>
    </Form>
  )
}

export default Register