import React, { useEffect, useRef, useState } from 'react'
import { Button , Row, Col, Card } from 'react-bootstrap';
import { Editor} from '@tinymce/tinymce-react';
import { Image, Plus, ThreeDotsVertical } from 'react-bootstrap-icons';
import { DateRangePicker, DatePicker, Toggle } from 'rsuite';
import { Loader, Uploader, Avatar, toaster, Message, Form, Input, Schema  } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { dataBookingForm, statusBookingForm, createBookingAsync, addFormData, addTimerData,removeTimerData, addQtyData, addStartTimeData, addEndTimeData, dataHourState } from '../../features/booking/BookingForm';

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
  width: 300,
  height: 200
};

const stylesDragger = {
  width: '100%',
  height: 120
};


const CreateBooking = () => {
  const dispatch = useDispatch();
  const FormData = useSelector(dataBookingForm);
  const FormStatus = useSelector(statusBookingForm);

  let hourState = useSelector(dataHourState);

  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

  const dateFns = new Date();

  console.log(hourState);
  const addHour = () => {
    dispatch(addTimerData({
      timeStart : '',
      timeEnd: '',
      qty: '',
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

  const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);
  
  const AddTimer = () => {

    const [datePicker, setDatePicker] = useState(true);

    return hourState ? 
        <Card className="bg-white mb-3">
          <Card.Body>
            <Form.Group>
              <Row className='align-items-end'>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.ControlLabel>Chọn nhiều </Form.ControlLabel>
                    <Toggle onChange={() => { setDatePicker(!datePicker) }} size="sm"/>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                      <Form.ControlLabel>Chọn ngày: </Form.ControlLabel>
                      {
                        datePicker ? 
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
                {
                  hourState.map((val, index) => {
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
                              <Input type="time"  onChange={(e) => { updateStartTime(index, e)}} name="starttimer[]"/>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.ControlLabel>Giờ kết thúc: </Form.ControlLabel>
                                <Input 
                                type="time"  
                                onChange={(e) => { updateStartTime(index, e)}} 
                                min="16:00" 
                                max="22:00"
                                name="endtimer[]"/>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.ControlLabel>Sô lượng: </Form.ControlLabel>
                                <Input 
                                type="number"  
                                onChange={(e) => { addQtyData(index, e)}} 
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
                }
              </Row>
            </Form.Group>
          </Card.Body>
        </Card>
    : ''
  }

  const model = Schema.Model({
    title: Schema.Types.StringType().isRequired('This field is required.'),
    email: Schema.Types.StringType().isEmail('Please enter a valid email address.')
  });

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
                      <Form.Control name="title" placeholder='Nhập tiêu đề'/>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                  <Form.Group className='mb-3'>
                      <Form.ControlLabel>
                        Nội dung
                      </Form.ControlLabel>
                      <Form.Control rows={5} name="textarea" accepter={Textarea} />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <AddTimer />
                    <Button type='button' onClick={addHour}>Thêm giờ</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
              <Row>
                <Col xs={12}>
                  <Form.Group className='mb-3'>
                      <Uploader
                        className='mt-0'
                        fileListVisible={false}
                        listType="picture"
                        action="//jsonplaceholder.typicode.com/posts/"
                        onUpload={file => {
                          setUploading(true);
                          previewFile(file.blobFile, value => {
                            setFileInfo(value);
                          });
                        }}
                        onSuccess={(response, file) => {
                          setUploading(false);
                          toaster.push(<Message type="success">Uploaded successfully</Message>);
                          console.log(response);
                        }}
                        onError={() => {
                          setFileInfo(null);
                          setUploading(false);
                          toaster.push(<Message type="error">Upload failed</Message>);
                        }}
                      >
                        <div className='d-block' style={styles}>
                          <Form.ControlLabel>
                            Ảnh đại diện
                          </Form.ControlLabel>
                          {uploading && <Loader backdrop center />}
                          {fileInfo ? (
                            <Image height={60} width={60} />
                          ) : (
                            <Image height={60} width={60} />
                          )}
                        </div>
                      </Uploader>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                  <Form.Group className='mb-3'>
                      <Form.ControlLabel>
                        Gallery
                      </Form.ControlLabel>
                      <div className='py-3'>
                      <Uploader
                        draggable
                        listType="picture-text"
                        defaultFileList={fileList}
                        action="//jsonplaceholder.typicode.com/posts/"
                      >
                        <div style={stylesDragger}>Nhấp hoặc kéo hình ảnh vào đây</div>
                      </Uploader>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Button>Đăng thông tin</Button>
                  </Col>
              </Row>
          </Col>
        </Row>
    </Form>
  )
}

export default CreateBooking;