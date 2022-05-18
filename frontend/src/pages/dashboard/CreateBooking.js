import React, { useRef, useState } from 'react'
import { Button , Row, Col, Card } from 'react-bootstrap';
import { Image } from 'react-bootstrap-icons';
import { DateRangePicker, DatePicker, Toggle } from 'rsuite';
import { toaster, Message, Form, Input, InputNumber, Schema, Modal  } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { setThumbnail,
         setGallery,
         dataBookingForm,
         addDateData,
         createBookingAsync,
         addTimerData,
         removeTimerData,
         addQtyData,
         addStartTimeData,
         addEndTimeData,
         setContent,
         setTitle,
         setDatePicker,
         setLocation,
        } from '../../features/booking/BookingForm';

import { imagesSelected } from '../../features/library/LibrarySlice';
import Library from '../../components/Library';
import { XLg } from 'react-bootstrap-icons';

const {
  beforeToday,
} = DateRangePicker;


function previewFile(file, callback) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

const stylesDragger = {
  width: '100%',
  height: 120
};

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


const CreateBooking = () => {

  const dispatch = useDispatch();
  let formData = useSelector(dataBookingForm);
  let ImagesData = useSelector(imagesSelected);

  let hourState = formData.time;

  const [selectGallery, setSelectGallery] = useState(false);


  const model = Schema.Model({
    title: Schema.Types.StringType().isRequired('Tiêu đề là bắt buộc.'),
    content: Schema.Types.StringType().isRequired('Nội dung mô tả là bắt buộc.'),
    location: Schema.Types.StringType().isRequired('Địa điểm là trường bắt buộc.'),
    qty: Schema.Types.StringType().addRule((value, data) => {
      if(value < 1){
        return false;
      }
      return true;
    })
});

  console.log(ImagesData);

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
      console.log(new Date(data))
    } else {
      dispatch(addDateData({
        startDate : data[0],
        endDate: data[1],
      }));
    }
  }
  console.log(formData);
  const addHour = () => {
    dispatch(addTimerData({
      timeStart : '00:00',
      timeEnd: '00:00',
      qty: 0,
    }));
  }

  const removeHour = (index) => {
    dispatch(removeTimerData(index))
  }

  const updateStartTime = (index, value) => {
    dispatch(addStartTimeData({index: index, value: value}))
  }

  const updateEndTime = (index, value) => {
    dispatch(addEndTimeData({index: index, value: value}))
  }

  const updateQtyTime = (index, value) => {
    dispatch(addQtyData({index: index, value: value}))
  }

  const AddTimer = () => {
    return hourState ? 
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
          <Col xs={12} key={index}>
            <Row className="align-items-end bg-light m-0 mb-3 py-2 rounded">
              <Col>
                <Form.Group className="mb-3">
                  <Form.ControlLabel>Giờ bắt đầu: </Form.ControlLabel>
                  <Input 
                    defaultValue={DefaultStart} 
                    type="time" 
                    onChange={(e) => { updateStartTime(index, e)}} 
                    name="starttimer[]"
                    min={MinStart}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.ControlLabel>Giờ kết thúc: </Form.ControlLabel>
                  <Input 
                    defaultValue={DefaultEnd}
                    type="time"  
                    onChange={(e) => { updateEndTime(index, e)}} 
                    min={MinEnd} 
                    name="endtimer[]"/>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.ControlLabel>Sô lượng: </Form.ControlLabel>
                    <InputNumber 
                    defaultValue={hourState[index].qty ? hourState[index].qty : 0}
                    onChange={(e) => { updateQtyTime(index, e)}} 
                    min="0" 
                    max="99999"
                    className='w-100'
                    name="qty[]"/>
                </Form.Group>
              </Col>
              <Col className='col-auto'>
                <Form.Group className="mb-3">
                  <Button variant='danger' size='sm' type='button' className="border-none" onClick={() => { removeHour(index) }}>
                      <XLg width={16} height={16}/>
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Col>
        );
      })
    : ''
  }

  const SubmitForm = (e) => {
    
    const form = {
      title: formData.title,
      content: formData.content,
      description: '',
      thumbnail: formData.thumbnail ? formData.thumbnail._id : '',
      gallery: formData.gallery ? formData.gallery : [],
      postIn: new Date(),
      status: 'pending',
      // Booking Post
      time: formData.time ? formData.time : [],
      location: '',
      startDate: '',
      startEnd: new Date(),
    }

    if (!formRef.current.check()) {
      toaster.push(<Message type="error">Một hoặc nhiều trường bị thiếu thông tin</Message>);
      return;
    }

    toaster.push(<Message type="success">Đang gửi dữ liệu</Message>);

    dispatch(createBookingAsync(form));
    
  }

  return (
    <Form 
    as='form' 
    fluid 
    model={model} 
    ref={formRef}
    onSubmit={(e) => { SubmitForm(e) }}>
      <Row> 
        <Col xs={12} sm={12} md={8}>
          <Card className="bg-light">
            <Card.Body>
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
                        Nội dung
                      </Form.ControlLabel>
                      <Input onChange={(e) => { dispatch(setContent(e)) }} defaultValue="" rows={5} name="content" as="textarea" />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                  <Form.Group className="mb-3">
                      <Card className="bg-white mb-3">
                          <Card.Body>
                            <Form.Group>
                              <Row className='align-items-end'>
                                <Col xs={12}>
                                  <Form.Group className='mb-3'>
                                    <Form.ControlLabel>
                                      Địa điểm
                                    </Form.ControlLabel>
                                    <Form.Control onChange={(e) => { dispatch(setLocation(e)); }} value={formData.location} name="location" placeholder='Nhập địa điểm'/>
                                  </Form.Group>
                                </Col>
                                <Col xs={12}>
                                  <Form.Group className="mb-3">
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
                                <AddTimer />
                              </Row>
                          </Form.Group>
                        </Card.Body>
                      </Card> 
                      <Button type='button' onClick={addHour}>Thêm giờ</Button>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
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
                  <Col xs={12}>
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
                  </Col>
                  <Col xs={12}>
                    <Button type='submit'>Đăng thông tin</Button>
                  </Col>
              </Row>
          </Col>
        </Row>
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
    </Form>
  )
}

export default CreateBooking;