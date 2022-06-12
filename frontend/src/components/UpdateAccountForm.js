import React, { useEffect, useState, useRef } from 'react'
import { Form, Card, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns'
import { Image } from 'react-bootstrap-icons';
import { Modal } from 'rsuite';
import { 
  updateUserAsync, 
  userUpdateStatus,
  setAvatarUser, 
  userAvatar 
} from '../features/user/updateUser';
import { userInformation,getUserInforAsync } from '../features/user/userSlice';
import { imagesSelected } from '../features/library/LibrarySlice';
import Library from './Library';

const UpdateAccountForm = () => {
  
  const dispatch = useDispatch();
  const updateStatus = useSelector(userUpdateStatus);
  const avatarRedux = useSelector(userAvatar);
  const User = useSelector(userInformation);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_day: '',
    personal_id: '',
    email: '',
    address: '',
    avatar: '',
  });

  useEffect(()=>{
    dispatch(getUserInforAsync());
  },[dispatch])
  
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

    if(inputFirstName.current.value === ''){
      inputFirstName.current.focus();
      setIsValidInputFirstName(false);
    } else {
      setIsValidInputFirstName(true);
    }
    // 
    if(inputLastName.current.value === ''){
      inputLastName.current.focus();
      setIsValidInputLastName(false);
    } else {
      setIsValidInputLastName(true);
    }
    //
    if(inputPersonalID.current.value === ''){
      inputPersonalID.current.focus();
      setIsValidInputPersonalID(false);
    } else {
      setIsValidInputPersonalID(true);
    }
    if(inputBirthDay.current.value === ''){
      inputBirthDay.current.focus();
      setIsValidInputBirthDay(false);
    } else {
      setIsValidInputBirthDay(true);
    }
    if(inputEmail.current.value === ''){
      inputEmail.current.focus();
      setIsValidInputEmail(false);
    } else {
      setIsValidInputEmail(true);
    }

    if(inputPhone.current.value === ''){
      inputPhone.current.focus();
      setIsValidInputPhone(false);
    } else {
      setIsValidInputPhone(true);
    } 
    
    if(inputAddress.current.value === ''){
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
      email: inputEmail.current.value,
      avatar: avatarRedux ? avatarRedux.path : '',
      username: User.user_name ? User.user_name : '',
      token: User.token ? User.token : ''
    }

    setFormData(Form);
    
    let isAllValidate = true;
    // for (const iterator in formData) {
    //   if (!formData.hasOwnProperty(iterator)) continue;
    //   if(formData[iterator] == '' && iterator != 'avatar'){
    //     isAllValidate = false
    //   }
    // }

    if(isAllValidate){
      dispatch(updateUserAsync(formData));
    }

  } 
  
  // Modal 
  let ImagesData = useSelector(imagesSelected);
  const [selectGallery, setSelectGallery] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleOpenSingle = () => {
    setSelectGallery(false);  
    setOpen(true);
    
  };
  const handleClose = () => {
    setOpen(false);
  }

  const handleImageSelect = () => {
    dispatch(setAvatarUser(...ImagesData));
    setOpen(false);
  }

  return (
    <>
    <Form onSubmit={ (e) => {
      e.preventDefault(); 
      updateFormData()
      }} 
      encType="multipart/form-data"
      >
      <Card className="mb-3">
        <Card.Body>
          <Row>
              <Col xs={12}>
                    <Form.Group className='mb-3'>
                      <div className='uploadThumbnail'>
                        <div onClick={() => { handleOpenSingle() }}>
                          { (User?.avatar || avatarRedux) ? 
                          <img width={200} height={200} src={User?.avatar}/>
                          : 
                          <div>
                          <Image height={60} width={60} />
                            <Form.Label>
                              Ảnh đại diện
                            </Form.Label>
                          </div>
                          } 
                          </div>
                        </div>
                    </Form.Group>
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
                    defaultValue={User ? User.firstname : ''}
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
                    defaultValue={User ? User.lastname : ''}
                    className={!isValidInputLastName && 'formHelp'} 
                    ref={inputLastName} 
                    placeholder='Nhập tên của bạn'/>
                    {!isValidInputLastName && <span className="inlineHelp"> Thông tin này không được để trống! </span>}
                  </Form.Group>
              </Col>
              <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số CMND</Form.Label>
                    <Form.Control 
                    defaultValue={User ? User.personal_id : ''}
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
                    defaultValue={User?.birth_day ? format(new Date(User?.birth_day), 'yyyy-MM-dd') : ''}
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
                    defaultValue={User ? User.email : ''}
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
                    defaultValue={User ? User.phone : ''}
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
                    defaultValue={User ? User.address : ''}
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
    <Modal size={'md'} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Library multipe={selectGallery} /> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' className='me-2' onClick={handleClose} appearance="subtle">
            Đóng
          </Button>
          <Button onClick={handleImageSelect} appearance="primary">
            Chọn hình ảnh
          </Button>
        </Modal.Footer>
    </Modal>
    </>
    
  )
}

export default UpdateAccountForm