import React, { useEffect, useState, useRef } from 'react'
import { Card, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns'
import { Image } from 'react-bootstrap-icons';
import { Modal, toaster, Message, Form, Input, Schema, InputGroup, DatePicker  } from 'rsuite';
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

  useEffect(()=>{
    dispatch(getUserInforAsync());
  },[dispatch])
  
  const model = Schema.Model({
    fullname : Schema.Types.StringType().isRequired('Bạn cần đặt tiêu đề.'),
    email: Schema.Types.StringType().isRequired('Bạn cần nhập nội dung.'),
  });

  const formRef = new useRef();
  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState({
    fullname: '',
    birth_day: '',
    personal_id: '',
    email: '',
    address: '',
    avatar: '',
  });

  const SubmitForm = (e) => {
    if (!formRef.current.check()) {
      toaster.push(<Message showIcon type="error">Một hoặc nhiều trường bị thiếu thông tin</Message>);
      return;
    }
    const data = new FormData(formRef.current.root);
    var object = {};
        data.forEach(function(value, key){
          if(key === 'birth_day'){
            const [day, month , year] = value.split('/');
            object[key] = new Date(+year, +month - 1, +day, +0, +0, +0);
          }else{
            object[key] = value;
          }   
    });
    object['avatar'] = '';
    if(User?.avatar){
      object['avatar'] = User?.avatar;
    }
    if(avatarRedux){
      object['avatar'] = avatarRedux.path;
    }
    var json = JSON.stringify(object);
    console.log(json);
    dispatch(updateUserAsync(json));
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

  const ImgShow = () => {
    if(avatarRedux){
      return (<img width={200} height={200} src={avatarRedux?.path}/>)
    }
    if(User?.avatar){
      return (<img width={200} height={200} src={User?.avatar}/>)
    }
    return (
      <>
        <Image height={60} width={60} />
        <Form>
          Ảnh đại diện
        </Form>
      </>
    )
  }
  

  return (
    <>
    {
            User ? 
            <>
            <Card className="mb-3">
              <Card.Body>
                <Row>
                    <Col xs={12}>
                          <Form.Group className='mb-3'>
                            <div className='uploadThumbnail'>
                              <div onClick={() => { handleOpenSingle() }}>
                                <ImgShow/>
                                </div>
                              </div>
                          </Form.Group>
                    </Col>
                </Row>
              </Card.Body>
            </Card>
            <Form 
                fluid
                autoComplete="off"
                ref={formRef}
                onChange={setFormData}
                onSubmit={(e) => { SubmitForm(e) }}
            >
              <Row>
                <Col md={6} sm={12}>
                  <Form.Group className="mb-3">
                      <Form.ControlLabel>Nhập Họ và tên</Form.ControlLabel>
                      <Form.Control
                        name={'fullname'}
                        defaultValue={User?.fullname}
                        value={EventTarget.value}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group className="mb-3">
                      <Form.ControlLabel>Số điện thoại</Form.ControlLabel>
                      <Form.Control
                        name={'phone'}
                        defaultValue={User?.phone}
                        value={EventTarget.value}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group className="mb-3">
                      <Form.ControlLabel>Nhập số CCCD</Form.ControlLabel>
                      <Form.Control
                        name={'personal_id'}
                        defaultValue={User?.personal_id}
                        value={EventTarget.value}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group className="mb-3">
                      <Form.ControlLabel>Nhập Ngày/Tháng/Năm sinh</Form.ControlLabel>
                      <Form.Control
                        name={'birth_day'}
                        defaultValue={User?.birth_day ? format(new Date(User?.birth_day), 'dd/MM/yyyy') : ''}
                        value={EventTarget.value}
                        placeholder={'dd/MM/yyyy'}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group className="mb-3">
                      <Form.ControlLabel>Nhập Email</Form.ControlLabel>
                      <Form.Control
                        name={'email'}
                        defaultValue={User?.email}
                        value={EventTarget.value}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group className="mb-3">
                      <Form.ControlLabel>Nhập Địa chỉ</Form.ControlLabel>
                      <Form.Control
                        name={'address'}
                        defaultValue={User?.address}
                        value={EventTarget.value}
                    />
                  </Form.Group>
                </Col>
              </Row>
                <Button variant='success' type='submit' className='me-2'>Cập nhật thông tin</Button>
            </Form>
            </>
            : ''
        }  
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