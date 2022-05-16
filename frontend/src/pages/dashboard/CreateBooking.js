import React, { useEffect, useRef, useState } from 'react'
import { Button , Row, Col, Card } from 'react-bootstrap';
import { Editor} from '@tinymce/tinymce-react';
import { Image, Plus, ThreeDotsVertical } from 'react-bootstrap-icons';
import { DateRangePicker, DatePicker, Toggle } from 'rsuite';
import { Loader, Uploader, Avatar, toaster, Message, Form, Input, Schema, Modal   } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { setThumbnail,
         setGallery,
         dataBookingForm,
         statusBookingForm,
         createBookingAsync,
         addFormData,
         addTimerData,
         removeTimerData,
         addQtyData,
         addStartTimeData,
         addEndTimeData,
         setContent,
         setTitle,
         setDatePicker,
         dataHourState 
        } from '../../features/booking/BookingForm';
import { imagesSelected } from '../../features/library/LibrarySlice';

import Library from '../../components/Library';

const {
  allowedMaxDays,
  allowedDays,
  allowedRange,
  beforeToday,
  afterToday,
  combine
} = DateRangePicker;


function previewFile(file, callback) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

const fileList = [
  {
    name: 'a.png',
    fileKey: 1,
    url:
      'https://user-images.githubusercontent.com/1203827/47638792-92414e00-db9a-11e8-89c2-f8f430a23cd3.png'
  },
  {
    name: 'b.png',
    fileKey: 2,
    url:
      'https://user-images.githubusercontent.com/1203827/47638807-9d947980-db9a-11e8-9ee5-e0cc9cd7e8ad.png'
  }
];

const styles = {
  width: '100%',
  height: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const stylesDragger = {
  width: '100%',
  height: 120
};

const GalleryImages = (props) => {
  return (
    props.images ?
      <Row>
        {
          props.images.map((val) => {
            return(
              <Col xs={3} key={val._id}>
                <img className='galleryThumbnail' src={val.image} />
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

  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  
  const [selectGallery, setSelectGallery] = useState(false);


  const model = Schema.Model({
    title: Schema.Types.StringType().isRequired('This field is required.'),
    email: Schema.Types.StringType().isEmail('Please enter a valid email address.')
  });

  console.log(ImagesData);

  // Modal 
  const [open, setOpen] = useState(false);

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

  console.log(formData);

  function handleChange(e) {
    dispatch(setContent(e))
  }

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
              <Col className="col-auto">
                <Form.Group className="mb-4">
                  <ThreeDotsVertical/>
                </Form.Group>
              </Col>
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
                    <Input 
                    defaultValue={hourState[index].qty ? hourState[index].qty : 0}
                    type="number"
                    onChange={(e) => { updateQtyTime(index, e)}} 
                    min="0" 
                    max="99999"
                    name="qty[]"/>
                </Form.Group>
              </Col>
              <Col className='col-auto'>
                <Form.Group className="mb-3">
                  <Button type='button' className="border-none" onClick={() => { removeHour(index) }}>Xóa</Button>
                </Form.Group>
              </Col>
              </Row>
          </Col>
        );
      })
    : ''
  }

  return (
    <Form fluid model={model}>
      <Row>
        <Col xs={12} md={8}>
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
                      <Input onChange={(e) => { dispatch(setContent(e)) }} defaultValue="" rows={5} name="textarea" as="textarea" />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                  <Form.Group className="mb-3">
                      <Card className="bg-white mb-3">
                          <Card.Body>
                            <Form.Group>
                              <Row className='align-items-end'>
                                <Col xs={12}>
                                  <Form.Group className="mb-3">
                                    <Form.ControlLabel>Chọn khoảng thời gian </Form.ControlLabel>
                                    <Toggle onChange={() => { dispatch(setDatePicker()) }} size="sm" name="dateRanger"/>
                                  </Form.Group>
                                </Col>
                                <Col xs={12}>
                                  <Form.Group className="mb-3">
                                  <Form.ControlLabel>Chọn ngày: </Form.ControlLabel>
                                    {
                                      !formData.rangerDatePicker ? 
                                      <DatePicker name="starttimer[]" 
                                      format="dd/MM/yyyy" 
                                      className='w-100' 
                                      disabledDate={beforeToday()}
                                      /> 
                                      : 
                                      <DateRangePicker 
                                      name="starttimer[]" 
                                      format="dd/MM/yyyy" 
                                      className='w-100'
                                      disabledDate={beforeToday()}
                                      />
                                    }
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
          <Col xs={12} md={4}>
              <Row>
                <Col xs={12}>
                    <Form.Group className='mb-3' onClick={handleOpenSingle}>
                      {
                        formData.thumbnail.image ? 
                        <img className="imageThumbnail" src={formData.thumbnail.image} />
                        : <Image height={60} width={60} />
                      }
                      
                      <Form.ControlLabel>
                        Ảnh đại diện
                      </Form.ControlLabel>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                  <Form.Group className='mb-3'>
                      <Form.ControlLabel>
                        Gallery
                      </Form.ControlLabel>
                      <div className='py-3'>
                        <div style={stylesDragger} onClick={handleOpenMultipe}>
                          {
                            formData.gallery ? 
                            <GalleryImages images={formData.gallery} />
                            : <p>Chọn để thêm gallery</p>
                          }
                        </div>
                      </div>
                      
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Button>Đăng thông tin</Button>
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
            <Button variant='danger' onClick={handleClose} appearance="subtle">
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