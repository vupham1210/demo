import React, { useRef, useState } from 'react'
import {  Row, Col, Card } from 'react-bootstrap';
import { Image, Calendar, PeopleFill, ListCheck, PlusLg, Pencil, Eraser, ThreeDotsVertical } from 'react-bootstrap-icons';
import { DateRangePicker, DatePicker, Toggle, Checkbox, Nav, Tag, TagGroup, Button } from 'rsuite';
import { toaster, Message, Form, Input, InputNumber, Schema, Modal, CheckboxGroup, List, Panel  } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { setThumbnail,
         setGallery,
         dataBookingForm,
         addDateData,
         createBookingAsync,
         addTimerData,
         removeTimerData,
         updateTimerData,
         setContent,
         setTitle,
         setDescription,
         setDatePicker,
         setLocation,
         addField,
         removeField,
        } from '../../features/booking/BookingForm';

import { imagesSelected } from '../../features/library/LibrarySlice';
import Library from '../../components/Library';
import { XLg } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import {useNavigate} from 'react-router-dom';

const {
  beforeToday,
} = DateRangePicker;


// function previewFile(file, callback) {
//   const reader = new FileReader();
//   reader.onloadend = () => {
//     callback(reader.result);
//   };
//   reader.readAsDataURL(file);
// }

// const stylesDragger = {
//   width: '100%',
//   height: 120
// };

const GalleryImages = (props) => {
  return (
    props.images ?
      <Row className='m-0'>
        {
          props.images.map((val) => {
            return(
              <Col xs={6} key={val._id}>
                <img className='galleryThumbnail' src={val.path} />
              </Col>
            )
          })
        }
      </Row>
    : ''
  )
}


const AddTimer = () => {
  const dispatch = useDispatch();
  let formData = useSelector(dataBookingForm);
  let hourState = formData.time;
  const[openHour, setOpenHour] = useState(false);
  const[editHour, setEditHour] = useState(false);
  const[checkedHour, setCheckedHour] = useState([]);

  const[hourStateMent, setHourStateMent] = useState({
    title: '',
    content: '',
    timeStart: '',
    timeEnd: '',
    qty:'',
  })

  const handeChangeChecked = (e) => {
    if(checkedHour.includes(e)) {
      var index = checkedHour.indexOf(e);
      if (index !== -1) {
        checkedHour.splice(index, 1);
      }
    } else {
      checkedHour.push(e)
    }
    const filtered = checkedHour.filter((el) => {
      return el !== null && typeof el !== 'undefined';
    });
    setCheckedHour(filtered)
  }

  const handleCloseHour = () => {
    setOpenHour(false);
    setEditHour(false);
  }

  const handleOpenHour = () => {
    setOpenHour(true);
  }

  const handleEditHour = (index) => {
    setHourStateMent(hourState[index]);
    setEditHour(index);
    setOpenHour(true);
  }

  const handleClearHour = () => {
    if(checkedHour.length == 0){
     toaster.push(<Message showIcon type="info">Không có nội dung để xóa</Message>);
    } else {
      dispatch(removeTimerData(checkedHour));
      setCheckedHour([]);
    }
  }

  const addHour = () => {
    dispatch(addTimerData(hourStateMent));
    handleCloseHour();
  }

  const editHourController = (index) => {
    dispatch(updateTimerData({index: index, value: hourStateMent}));
    handleCloseHour();
  } 

  return hourState ? 
  <>
    <CheckboxGroup className='mb-3' name="checkboxList">
      <List>
    {
      hourState.map((val, index) => {
      const preIndex = index - 1;
      const MinStart = preIndex > 0 ? hourState[index].timeStart : '00:00';
      const MinEnd = hourState[index].timeEnd ? hourState[index].timeEnd : '00:00';

      var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

      let DefaultStart = hourState[index].timeStart ? hourState[index].timeStart : MinStart; 
      let DefaultEnd = hourState[index].timeEnd ? hourState[index].timeEnd : MinEnd;

      if(parseInt(DefaultEnd.replace(regExp, "$1$2$3")) < parseInt(DefaultStart.replace(regExp, "$1$2$3"))){
        DefaultEnd = DefaultStart;
      } 

      return(
        <List.Item key={index} index={index}>
          <Row>
            <Col>
              <Checkbox checked={false} value={index} className='w-100' onChange={(e) => { handeChangeChecked(e) }}>
                  {
                    hourState[index].title ? 
                    <div className='px-2 mb-2'>
                        <p>{hourState[index].title}</p>
                    </div>
                    : ''
                  }
                  <TagGroup>
                    <Tag color="blue">
                      <Calendar /> { DefaultStart} - {DefaultEnd }
                    </Tag>
                    { 
                      hourState[index].qty ? 
                          <Tag color="cyan">
                            <PeopleFill />  {
                              hourState[index].qty 
                            }
                          </Tag>
                        : '' 
                    }
                  </TagGroup>
              </Checkbox>
            </Col>
            <Col className="col-auto py-3">
              <Button onClick={() => { handleEditHour(index) }}>
                <Pencil className='me-2'/>Sửa
              </Button>
            </Col>
          </Row>
        </List.Item>
      );
    })
    }
    </List>
    </CheckboxGroup>

    <Nav className='mb-3'>
      <Nav.Item className={'me-2'}><ThreeDotsVertical className='me-2'/>Chọn tất cả</Nav.Item>
      <Nav.Item className={'me-2'} onClick={handleOpenHour}><PlusLg className='me-2'/> Thêm giờ</Nav.Item>
      <Nav.Item className={'me-2'} onClick={handleClearHour}><Eraser className='me-2'/>Xóa</Nav.Item>
    </Nav>

    <Modal size={'md'} open={openHour} onClose={handleCloseHour}>
        <Modal.Header>
          <Modal.Title><h5>Thêm thời gian</h5></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row className="m-0">
            {/* <Col xs={12}>
                <Form.Group className='mb-3'>
                  <Form.ControlLabel>
                    Tiêu đề
                  </Form.ControlLabel>
                  <Input 
                  onChange={(e) => { setHourStateMent({...hourStateMent, title: e}) }} 
                  defaultValue={hourStateMent.title} 
                  name="title" 
                  placeholder='Nhập tiêu đề'/>
                </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className='mb-3'>
                  <Form.ControlLabel>
                    Nội dung
                  </Form.ControlLabel>
                  <Input 
                  onChange={(e) => { setHourStateMent({...hourStateMent, content: e}) }} 
                  value={hourStateMent.content} 
                  rows={5} 
                  name="content" 
                  as="textarea" />
                </Form.Group>
            </Col> */}
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.ControlLabel>Giờ bắt đầu: </Form.ControlLabel>
                <Input 
                  type="time" 
                  value={hourStateMent.timeStart} 
                  onChange={(e) => { setHourStateMent({...hourStateMent, timeStart: e}) }}
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.ControlLabel>Giờ kết thúc: </Form.ControlLabel>
                <Input 
                  type="time"  
                  min={hourStateMent.timeStart}
                  value={hourStateMent.timeEnd} 
                  onChange={(e) => { setHourStateMent({...hourStateMent, timeEnd: e}) }}
                  />
              </Form.Group>
            </Col>
            {/* <Col  xs={12}>
              <Form.Group className="mb-3">
                <Form.ControlLabel>Sô lượng: </Form.ControlLabel>
                  <InputNumber 
                  min={0}
                  max={99999}
                  className='w-100'
                  value={hourStateMent.qty} 
                  onChange={(e) => { setHourStateMent({...hourStateMent, qty: e}) }}
                  />
              </Form.Group>
            </Col> */}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' className='me-2' onClick={handleCloseHour} appearance="subtle">
            Đóng
          </Button>
          {
            editHour !== false ? 
            <Button onClick={() => { editHourController(editHour) }} appearance="primary">
              Cập nhật
            </Button>
            :
            <Button onClick={addHour} appearance="primary">
              Thêm thời gian
            </Button>
          }
        
        </Modal.Footer>
      </Modal>
    </>
  : ''
}



const CreateBooking = () => {
  
  const navigate =useNavigate();
  const dispatch = useDispatch();
  let formData = useSelector(dataBookingForm);
  let ImagesData = useSelector(imagesSelected);

  let hourState = formData.time;
  let fieldState = formData.field;

  const [selectGallery, setSelectGallery] = useState(false);


  const model = Schema.Model({
    title: Schema.Types.StringType().isRequired('Tiêu đề là bắt buộc.'),
    // content: Schema.Types.StringType().isRequired('Nội dung mô tả là bắt buộc.'),
    location: Schema.Types.StringType().isRequired('Địa điểm là trường bắt buộc.'),
});

  // Modal 
  const [open, setOpen] = useState(false);
  const formRef = useRef();

  const handleOpenSingle = () => {
    setSelectGallery(false);  
    setOpen(true);
  };

  const handleOpenMultipe = () => {
    setSelectGallery(true);  
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }

  const handleImageSelect = () => {
    if(!selectGallery){ 
        dispatch(setThumbnail(...ImagesData));
      } else {
        dispatch(setGallery(ImagesData));
    }
    setOpen(false);
  }

  const addDate = (data, multipe) => {
    if(!multipe){
      dispatch(addDateData({
        startDate : data,
        endDate: data,
      }));
    } else {
      dispatch(addDateData({
        startDate : data[0],
        endDate: data[1],
      }));
    }
  }

  const NewField = () => {
    dispatch(addField({
      fieldName: '',
      fieldContent: '',
    }))
  }

  const removeFieldData = (index) => {
    dispatch(removeField(index))
  }

  const AddField = () => {
    
    const [fieldData, setFieldData ] = useState({
      fieldTitle: '',
      fieldContent: '',
    });

    return fieldState ? 
      fieldState.map((val, index) => {
        return(
            <Col xs={12} key={index}>
              <Row className="align-items-end bg-light m-0 mb-3 py-2 rounded mt-3">
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.ControlLabel>Tiêu đề: </Form.ControlLabel>
                    <Input 
                      value={fieldData.fieldTitle}
                      onChange={(e) => { setFieldData({...fieldData, fieldTitle:e} )} } 
                      name="fieldTitle[]"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.ControlLabel>Nội dung: </Form.ControlLabel>
                    <Input 
                      value={fieldData.fieldContent}
                      rows={3} 
                      as="textarea"
                      name="fieldContent[]"
                      onChange={(e) => { setFieldData({...fieldData, fieldContent:e} )} } 
                      />
                  </Form.Group>
                </Col>
                <Col className='col-auto'>
                  <Form.Group className="mb-3">
                    <Button variant='danger' size='sm' type='button' className="border-none" onClick={() => { removeFieldData(index) }}>
                        <XLg width={16} height={16}/>
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          )
      }) : '';
  }

  const SubmitForm = (e) => {
    
    const form = {
      title: formData.title,
      content: formData.content,
      description: formData.description,
      thumbnail: formData.thumbnail ? formData.thumbnail : '',
      gallery: formData.gallery ? formData.gallery : [],
      postIn: new Date(),
      status: 'pending',
      // Booking Post
      time: formData.time ? formData.time : [],
      location: formData.time.location ,//? formData.time.location : '',
      startDate: formData.startDate ? formData.startDate : '',
      startEnd: formData.endDate ? formData.endDate : '',
    }

    

    const data = new FormData(e.target);

    console.log(data);

    if (!formRef.current.check()) {
      toaster.push(<Message showIcon type="error">Một hoặc nhiều trường bị thiếu thông tin</Message>);
      return;
    }
    else{
      navigate("/tai-khoan/quan-ly-lich-hen");
    }

    toaster.push(<Message showIcon type="success">Đang gửi dữ liệu</Message>);

    dispatch(createBookingAsync(form));
    
  }

  return (
    <Panel header={'Nhập thông tin'} shaded bordered bodyFill>
      <Form 
          as='form' 
          fluid 
          model={model} 
          ref={formRef}
          className={'px-3'}
          onSubmit={(e) => { SubmitForm(e) }}>
            <Row> 
              <Col xs={12} sm={12} md={8}>
                      <Row>
                        <Col xs={12}>
                          <Form.Group className='mb-3'>
                            <Form.ControlLabel>
                              Tiêu đề
                            </Form.ControlLabel>
                            <Form.Control onChange={(e) => { dispatch(setTitle(e)); }} value={formData.title} name="title" placeholder='Nhập tiêu đề'/>
                          </Form.Group>
                        </Col>
                        <Col xs={12}>
                          <Form.Group className='mb-3'>
                            <Form.ControlLabel>
                              Mô tả
                            </Form.ControlLabel>
                            <Form.Control onChange={(e) => { dispatch(setDescription(e)); }} value={formData.description} name="description" placeholder='Nhập mô tả'/>
                          </Form.Group>
                        </Col>
                        <Col xs={12}>
                        <Form.Group className='mb-3'>
                            <Form.ControlLabel>
                              Nội dung
                            </Form.ControlLabel>
                            <Input onChange={(e) => { dispatch(setContent(e)) }} value={formData.content} rows={5} name="content" as="textarea" />
                          </Form.Group>
                        </Col>
                        <Col xs={12}>
                          <Form.Group className='mb-3'>
                            <Form.ControlLabel>
                              Địa điểm
                            </Form.ControlLabel>
                            <Form.Control onChange={(e) => { dispatch(setLocation(e)); }} value={formData.location} name="location" placeholder='Nhập địa điểm'/>
                          </Form.Group>
                        </Col>
                        <Col xs={12}>
                          <Form.Group className='mb-3'>
                            <Row>
                              <Col className='col-auto'>
                                <Form.Group className="mb-3">
                                  <Form.ControlLabel>Chọn khoảng thời gian </Form.ControlLabel>
                                  <Toggle onChange={() => { dispatch(setDatePicker()) }} size="sm" name="dateRanger"/>
                                </Form.Group>
                              </Col>
                              <Col>
                              <Form.ControlLabel>Chọn ngày: </Form.ControlLabel>
                                  {
                                    !formData.rangerDatePicker ? 
                                    <DatePicker
                                      format="dd/MM/yyyy" 
                                      className='w-100' 
                                      disabledDate={beforeToday()}
                                      errorMessage={'Ngày nhập vào không chính xác'}
                                      onChange={(e) => { addDate(e, false) }}
                                      defaultValue={ formData.startDate ? formData.startDate : new Date()}
                                    /> 
                                    : 
                                    <DateRangePicker 
                                      format="dd/MM/yyyy" 
                                      className='w-100'
                                      disabledDate={beforeToday()}
                                      errorMessage={'Ngày nhập vào không chính xác'}
                                      onChange={(e) => { addDate(e, true) }}
                                      defaultValue={ formData.startDate ? [formData.startDate, formData.endDate] : [new Date(), new Date()]}
                                    />
                                  }
                                </Col>
                            </Row>
                          </Form.Group>
                        </Col>
                        <Col xs={12}>
                          <AddTimer />
                        </Col>
                        <Col className='mb-3' xs={12}>
                        <Button type='submit' appearance="primary">Đăng thông tin</Button>
                        </Col>
                  </Row>
                </Col>
                <Col xs={12} sm={12} md={4}>
                    <Row>
                      <Col xs={12}>
                          <Form.Group className='mb-3' onClick={handleOpenSingle}>
                            <div className='uploadThumbnail'>
                              {
                                formData.thumbnail.path ? 
                                <div className='uploadThumbnailImage'>
                                  <img className="imageThumbnail" src={formData.thumbnail.path} />
                                </div>
                                : 
                                <div>
                                  <Image height={60} width={60} />
                                  <Form.ControlLabel>
                                    Ảnh đại diện
                                  </Form.ControlLabel>
                                </div>
                              }
                              </div>
                          </Form.Group>
                        </Col>
                        {/* <Col xs={12}>
                        <Form.Group className='mb-3' onClick={handleOpenMultipe}>
                            <Form.ControlLabel>
                              Gallery
                            </Form.ControlLabel>
                            <div className='py-3'>
                              <div style={stylesDragger} className='uploadGallery py-3'>
                                {
                                  formData.gallery.length > 0 ? 
                                  <GalleryImages images={formData.gallery} />
                                  : <p>Chọn để thêm gallery</p>
                                }
                              </div>
                            </div>
                            
                          </Form.Group>
                        </Col> */}
                        {/* <Col xs={12}>
                          <Button type='submit' appearance="primary">Đăng thông tin</Button>
                        </Col> */}
                    </Row>
                </Col>
              </Row>
              {/* <Modal size={'md'} open={open} onClose={handleClose}>
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
              </Modal> */}
          </Form>
    </Panel>
  )
}

export default CreateBooking;