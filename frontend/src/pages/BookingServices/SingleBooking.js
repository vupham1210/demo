import React, { useEffect, useState, useRef} from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { Clock } from 'react-bootstrap-icons';
import { Modal, toaster, Message, Form , Input, Schema } from 'rsuite';

import { loadSingBookingAsync,
         dataSingleBookingServices,
         statusSingleBookingServices }
         from '../../features/booking/ManagerSingleBooking';

import { createScheduleAsync, dataScheduleForm, setFormData } from '../../features/schedule/ScheduleForm';



const SingleBooking = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const formRef = useRef();

    const Slug = params.slug;
    const SingleData = useSelector(dataSingleBookingServices);

    console.log(SingleData);

    const model = Schema.Model({
        //'email[key]': Schema.Types.StringType().isRequired('Trường này là bắt buộc.'),
    });

    useEffect(() => {
        dispatch(loadSingBookingAsync(Slug));
    }, [dispatch])

    const [open, setOpen] = useState(false);
    const [dataBooking, setDataBooking] = useState();

    const handleOpenFrom = (data) => {
        setDataBooking(data);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }
    
    const HandleChangeForm = (e) => {
        dispatch(setFormData(e))
    }
    
    const SubmitForm = (e) => {

        const data = new FormData(formRef.current.root);

        const update = (data, keys, value) => {
            if (keys.length === 0) {
              return value;
            }
            let key = keys.shift();
            if (!key) {
              data = data || [];
              if (Array.isArray(data)) {
                key = data.length;
              }
            }
            let index = +key;
            if (!isNaN(index)) {
              data = data || [];
              key = index;
            }
            data = data || {};
            let val = update(data[key], keys, value);
            data[key] = val;
            return data;
          }
          const serializeForm = (form) => {
            return Array.from((form).entries())
              .reduce((data, [field, value]) => {
                let [_, prefix, keys] = field.match(/^([^\[]+)((?:\[[^\]]*\])*)/);
          
                if (keys) {
                  keys = Array.from(keys.matchAll(/\[([^\]]*)\]/g), m => m[1]);
                  value = update(data[prefix], keys, value);
                }
                data[prefix] = value;
                return data;
              }, {});
          }
          
          if (!formRef.current.check()) {
            toaster.push(<Message showIcon type="error">Một hoặc nhiều trường bị thiếu thông tin</Message>);
            return;
          }
      
          toaster.push(<Message showIcon type="success">Đang gửi dữ liệu</Message>);
    
          let json = serializeForm(data);
          const arrOfObj1 = Object.values(json.ortherInfo);
          json.ortherInfo = arrOfObj1;
          dispatch(createScheduleAsync(json));
          handleClose();
    }

    const FormSigninSchedule = ({data}) => {
        const inforBooking = data;
        return(
          <>
            <Modal.Header>
                    <Modal.Title>
                        Điền thông tin để đăng kí
                    </Modal.Title>
                </Modal.Header> 
                <Modal.Body>
                <Container>
                    <Row>
                        <Col xs={12}> 
                        <p>Khung giờ bạn chọn là {inforBooking.timePick.timeStart} - {inforBooking.timePick.timeEnd} vào ngày {inforBooking?.inforBooking.createdAt ? format(new Date(inforBooking.inforBooking.createdAt), 'dd/MM/yyyy') : ''}</p>
                        <p> Điền vào thông tin bên dưới để được hẹn lịch với chúng tôi</p>
                        </Col>
                        <Col xs={12}>
                            <Form 
                                model={model} 
                                ref={formRef}
                                onSubmit={(e) => { SubmitForm(e) }}
                            >
                            <Row>   
                                {
                                    inforBooking.inforBooking.custom_field ? inforBooking.inforBooking.custom_field.map((val, index) => {
                                        return(
                                            <Col lg={6} xs={12} key={index}>
                                                <Form.Group className="mb-3">
                                                    <Form.ControlLabel>{val.name}</Form.ControlLabel>
                                                    <Form.Control
                                                        type='hidden'
                                                        name={`ortherInfo[${val.key}][key]`}
                                                        value={val.key}
                                                    />
                                                    <Form.Control
                                                        type='hidden'
                                                        name={`ortherInfo[${val.key}][label]`}
                                                        value={val.name}
                                                    />
                                                    <Form.Control
                                                        name={`ortherInfo[${val.key}][value]`}
                                                        value={EventTarget.value}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )
                                    })
                                    : ''
                                }
                                <Form.Control hidden 
                                defaultValue={inforBooking.inforBooking._id}
                                name = 'idService' />
                                <Form.Control hidden 
                                defaultValue={inforBooking.inforBooking.title}
                                name = 'titleService' />
                                <Form.Control hidden 
                                defaultValue={inforBooking.inforBooking.author}
                                name = 'idAuthor' />
                                <Form.Control hidden 
                                defaultValue={inforBooking.timePick.timeStart}
                                name = 'timeStart' />
                                <Form.Control hidden 
                                defaultValue={inforBooking.timePick.timeEnd}
                                name = 'timeEnd' />
                                <Col xs={12} className='text-end'>
                                    <Button variant='danger' className='me-2' onClick={handleClose} appearance="subtle">
                                        Đóng
                                    </Button>
                                    <Button variant='success' type='submit' className='me-2'>Gửi yêu cầu</Button>
                                </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            
          </>
        )
      }
    if(SingleData){
        return (
            <>
            <Row>
                <Col xs={6}>
                    <Card>
                        <Card.Header>
                            {
                                SingleData.thumbnail ? <img className='w-100' src={SingleData.thumbnail.path} /> : ''
                            }
                            
                            <h3>{SingleData.title}</h3>
                            <p>
                                <Clock width={20} height={20}  fill={'black'}/>
                                { format(new Date(SingleData.startDate), 'dd/MM/yyyy') }
                            </p>
                            {SingleData.endDate ? <p>
                                <Clock width={20} height={20}  fill={'black'}/>
                                {SingleData.endDate}
                            </p> : ''}
                            
                        </Card.Header>
                        <Card.Body>
                            <p>{SingleData.content}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6}>
                    {
                        SingleData.time ? 
                            <>
                                <h3>Lựa chọn khung giờ để đặt hẹn</h3>
                                <ListGroup className="border-0">
                                    {
                                        SingleData.time.map((val, index) => {
                                            const dataHandle = {
                                                inforBooking : SingleData,
                                                timePick: {
                                                    timeStart: val.timeStart,
                                                    timeEnd: val.timeEnd,
                                                }
                                            }
                                            if(val?.qtyNow === 0){
                                                return '';
                                            }else{
                                                return(
                                                    <ListGroup.Item className="border-0 p-0 py-4" key={index}>                                                  
                                                        <Button variant='primary' 
                                                        className='me-2' 
                                                        onClick={() =>{handleOpenFrom(dataHandle)}} 
                                                        appearance="subtle">
                                                        Đăng kí khung giờ {val.timeStart} - {val.timeEnd} Còn trống: {val?.qtyNow ? val.qtyNow : val.qty}
                                                        </Button>
                                                    </ListGroup.Item>
                                                )
                                            }
                                        })
                                    }
                                </ListGroup>
                            </>
                        : ''
                    }
                     
                </Col>
               
            </Row>
            <Modal size={'md'} open={open} onClose={handleClose}>
                <FormSigninSchedule data={dataBooking}/>
            </Modal>
            </>
        )
    } else {
        return
    }
   
}

export default SingleBooking