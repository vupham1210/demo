import React, { useEffect, useState, useRef } from 'react'
import { Form, Card, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { 
  getUserInforAsync, 
  userInformation 
} from '../features/user/userSlice';

const UpdateAccountForm = () => {
  
  const dispatch = useDispatch();

  const userDataSelect = useSelector(userInformation);

  const [avatar, setAvatar] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_day: '',
    personal_id: '',
    address: '',
    avatar: '',
  });

  const inputfile = useRef(null);
  const inputFirstName = useRef(null);
  const inputLastName = useRef(null);
  const inputPersonalID = useRef(null);
  const inputBirthDay = useRef(null);
  const inputEmail = useRef(null);
  const inputPhone = useRef(null);
  const inputAddress = useRef(null);

  // Validate 
  const [isValidInputFirstName, setIsValidInputFirstName] = useState(true);
  const [isValidInputLastName, setIsValidInputLastName] = useState(true);
  const [isValidInputPersonalID, setIsValidInputPersonalID] = useState(true);
  const [isValidInputBirthDay, setIsValidInputBirthDay] = useState(true);
  const [isValidInputEmail, setIsValidInputEmail] = useState(true);
  const [isValidInputPhone, setIsValidInputPhone] = useState(true);
  const [isValidInputAddress, setIsValidInputAddress] = useState(true);

  const updateFormData = () => {

    if(inputFirstName.current.value == ''){
      inputFirstName.current.focus();
      setIsValidInputFirstName(false);
    } else {
      setIsValidInputFirstName(true);
    }
    // 
    if(inputLastName.current.value == ''){
      inputLastName.current.focus();
      setIsValidInputLastName(false);
    } else {
      setIsValidInputLastName(true);
    }
    //
    if(inputPersonalID.current.value == ''){
      inputPersonalID.current.focus();
      setIsValidInputPersonalID(false);
    } else {
      setIsValidInputPersonalID(true);
    }
    if(inputBirthDay.current.value == ''){
      inputBirthDay.current.focus();
      setIsValidInputBirthDay(false);
    } else {
      setIsValidInputBirthDay(true);
    }
    if(inputEmail.current.value == ''){
      inputEmail.current.focus();
      setIsValidInputEmail(false);
    } else {
      setIsValidInputEmail(true);
    }

    if(inputPhone.current.value == ''){
      inputPhone.current.focus();
      setIsValidInputPhone(false);
    } else {
      setIsValidInputPhone(true);
    } 
    
    if(inputAddress.current.value == ''){
      inputAddress.current.focus();
      setIsValidInputAddress(false);
    } else {
      setIsValidInputAddress(true);
    }


    let Form =  {
      first_name: inputFirstName.current.value,
      last_name: inputLastName.current.value,
      birth_day: inputBirthDay.current.value,
      personal_id: inputPersonalID.current.value,
      address: inputAddress.current.value,
      avatar: inputfile.current.value,
      username: userDataSelect.user_name ? userDataSelect.user_name : '',
      token: userDataSelect.token ? userDataSelect.token : ''
    }

    setFormData(Form);

    let isAllValidate = true;
    for (const iterator in formData) {
      if (!formData.hasOwnProperty(iterator)) continue;
      if(formData[iterator] == ''){
        console.log(iterator);
        isAllValidate = false
      }
    }

    if(isAllValidate){
      dispatch(getUserInforAsync(formData));
    }

  } 
  
  const fileCallback = () => {
   
    let ImageAvatar = inputfile.current.files[0];
    let reader = new FileReader();
    let url = reader.readAsDataURL(ImageAvatar);

    reader.onloadend = () => {
      setAvatar(reader.result);
    }
  }
  
  return (
    <Form onSubmit={ (e) => {
      e.preventDefault(); 
      updateFormData()
      }} 
      encType="multipart/form-data"
      >
      <Card className="mb-3">
        <Card.Body>
          <Row>
              {
                avatar ?  
                  <Col xs={12} className='mb-3'>
                    <div className='previewAvatar'>
                      <img classname="w-100" src={avatar} alt="Ảnh đại diện"/>
                    </div>
                  </Col>: ''
              }
              
              <Col xs={4}>
                <Form.Label>Ảnh đại diện</Form.Label>
                <Form.Control ref={inputfile} onChange={fileCallback} type="file" accept="image/*"/>
              </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>Thông tin tài khoản</Card.Header>
        <Card.Body>
            <Row>
              <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ</Form.Label>
                    <Form.Control 
                    defaultValue={userDataSelect ? userDataSelect.first_name : ''}
                    className={!isValidInputFirstName && 'formHelp'} 
                    ref={inputFirstName} 
                    placeholder='Nhập họ của bạn'/>
                    {!isValidInputFirstName && <span className="inlineHelp"> Thông tin này không được để trống! </span>}
                  </Form.Group>
              </Col>
              <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên</Form.Label>
                    <Form.Control 
                    defaultValue={userDataSelect ? userDataSelect.last_name : ''}
                    className={!isValidInputLastName && 'formHelp'} 
                    ref={inputLastName} 
                    placeholder='Nhập tên của vạn'/>
                    {!isValidInputLastName && <span className="inlineHelp"> Thông tin này không được để trống! </span>}
                  </Form.Group>
              </Col>
              <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số CMND</Form.Label>
                    <Form.Control 
                    defaultValue={userDataSelect ? userDataSelect.personal_id : ''}
                    className={!isValidInputPersonalID && 'formHelp'} 
                    ref={inputPersonalID} 
                    placeholder='Nhập chứng minh nhân dân'/>
                    {!isValidInputPersonalID && <span className="inlineHelp"> Thông tin này không được để trống! </span>}
                  </Form.Group>
              </Col>
              <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày sinh</Form.Label>
                    <Form.Control 
                    defaultValue={userDataSelect ? userDataSelect.birth_day : ''}
                    className={!isValidInputBirthDay && 'formHelp'} 
                    ref={inputBirthDay} 
                    type="date" 
                    placeholder='Nhập ngày sinh'/>
                    {!isValidInputBirthDay && <span className="inlineHelp"> Thông tin này không được để trống! </span>}
                  </Form.Group>
              </Col>
              <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ Email</Form.Label>
                    <Form.Control 
                    defaultValue={userDataSelect ? userDataSelect.user_email : ''}
                    className={!isValidInputEmail && 'formHelp'} 
                    ref={inputEmail} 
                    type="email" 
                    placeholder='Nhập địa chỉ Email'/>
                    {!isValidInputEmail && <span className="inlineHelp"> Thông tin này không được để trống! </span>}
                  </Form.Group>
              </Col>
              <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control 
                    defaultValue={userDataSelect ? userDataSelect.phone : ''}
                    className={!isValidInputPhone && 'formHelp'} 
                    ref={inputPhone} 
                    placeholder='Nhập số điện thoại'/>
                    {!isValidInputPhone && <span className="inlineHelp"> Thông tin này không được để trống! </span>}
                  </Form.Group>
              </Col>
              <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ chi tiết</Form.Label>
                    <Form.Control 
                    defaultValue={userDataSelect ? userDataSelect.address : ''}
                    className={!isValidInputAddress && 'formHelp'} 
                    ref={inputAddress} 
                    placeholder='Nhập địa chỉ của bạn'/>
                    {!isValidInputAddress && <span className="inlineHelp"> Thông tin này không được để trống! </span>}
                  </Form.Group>
              </Col>
              <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Button type="submit">Cập nhật thông tin</Button>
                  </Form.Group>
              </Col>
            </Row>
        </Card.Body>
      </Card>
    </Form>
  )
}

export default UpdateAccountForm