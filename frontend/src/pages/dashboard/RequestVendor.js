import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';
import { toaster, Message, Form, Input, Schema, InputGroup  } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInforAsync, userInformation } from '../../features/user/userSlice';
import { searchUserAsync, dataSearchUser } from '../../features/user/searchUser';
import { createContactAsync } from '../../features/contact/addContact';
import Swal from "sweetalert2";

const Textarea = React.forwardRef((props, ref) => <Input {...props} rows={5} as="textarea" ref={ref} />);


const RequestVendor = () => {

    const dispatch = useDispatch();
    const userNow = useSelector(userInformation);
    const userSearch = useSelector(dataSearchUser);

    useEffect (() => {
        dispatch(getUserInforAsync());
    },[dispatch]);

    const model = Schema.Model({
        title : Schema.Types.StringType().isRequired('Bạn cần đặt tiêu đề.'),
        content: Schema.Types.StringType().isRequired('Bạn cần nhập nội dung.'),
    });

    const formRef = useRef();
    const [formError, setFormError] = useState({});
    const [formValue, setFormValue] = useState({
        title: '',
        content: '',
        emailReveice: '',
        type: 'request',
      });

    const SubmitForm = (e) => {
        if (!formRef.current.check()) {
            toaster.push(<Message showIcon type="error">Một hoặc nhiều trường bị thiếu thông tin</Message>);
            return;
        }
        const data = new FormData(formRef.current.root);

        var object = {};
        data.forEach(function(value, key){
            object[key] = value;
        });
        object["idReceive"] = dataSearch?._id;
        if(object?.idReceive){
            var json = JSON.stringify(object);
            console.log(json);
            dispatch(createContactAsync(json));
            setFormValue({
                title: '',
                content: '',
                emailReveice: '',
                type: 'request',
            });
            dispatch(searchUserAsync());
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Lỗi xảy ra @_@',
                text: 'Cần phải nhập chính xác Email của người nhận!!!',
            });
        }
        
    }

    const [dataSearch, setDataSearch] = useState({});
    
    useEffect (() =>{
        setDataSearch(userSearch?.data);
    })
    const handleGetReceiver = (val) => {
        dispatch(searchUserAsync(val));
    }
    return (
        <>
        {
            userNow ? 
            <>
            <Form 
                fluid
                autoComplete="off"
                model={model} 
                ref={formRef}
                onChange={setFormValue}
                onCheck={setFormError}
                formValue = {formValue}
                onSubmit={(e) => { SubmitForm(e) }}
            >
                <Form.Group className="mb-3">
                    <Form.ControlLabel>Nhập Email người gửi</Form.ControlLabel>
                    <InputGroup inside>
                    <Form.Control
                        name={'emailReveice'}
                        onChange={(e) => { handleGetReceiver(e) }}
                        placeholder="Nhập email người nhận..."
                        value={EventTarget.value}
                        className="w-100"
                    />
                    {dataSearch?.email ? 
                        <InputGroup.Addon>
                            <CheckCircleFill className='text-success' />
                        </InputGroup.Addon> : ''
                    }
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.ControlLabel>Tiêu đề</Form.ControlLabel>
                    <Form.Control
                        name={'title'}
                        value={EventTarget.value}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.ControlLabel>Nội dung</Form.ControlLabel>
                    <Form.Control
                        name={'content'}
                        accepter={Textarea}
                        value={EventTarget.value}
                    />
                </Form.Group>
                {/* <Form.Control hidden  name = {"idReceive"} /> */}
                <Form.Control hidden  name = {'type'} />
                <Button variant='success' type='submit' className='me-2'>Gửi yêu cầu</Button>
            </Form>
            </>
            : ''
        }  
        </>
    )
}

export default RequestVendor;