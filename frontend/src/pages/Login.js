import React,  { useEffect , useState, useRef } from 'react'
import { Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { loginUserAsync } from '../features/user/loginUser';
import { useNavigate  } from 'react-router-dom';


const Login = () => {
  
  let navigate = useNavigate();

  const dispatch = useDispatch();

  const inputUserName = useRef(null);
  const inputPassword = useRef(null);

  const [isValidUserName, setIsValidUserName] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  const onButtonClick = () => {
    // `current` points to the mounted text input element
    if(inputUserName.current.value == ''){
      inputUserName.current.focus();
      setIsValidUserName(false);
    } else {
      setIsValidUserName(true);
    }
    if(inputPassword.current.value == ''){
      inputPassword.current.focus();
      setIsValidPassword(false);
    } else {
      setIsValidPassword(true);
    }
  
    let Form =  {
      username: inputUserName.current.value,
      password: inputPassword.current.value,
    }
    setLoginForm(Form);
  };



  useEffect(() =>{
    let isAllValidate = true;
    for (const iterator in loginForm) {
      if (!loginForm.hasOwnProperty(iterator)) continue;
      if(loginForm[iterator] == ''){
        isAllValidate = false
      }
    }

    if(isAllValidate){
      dispatch(loginUserAsync(loginForm));
      return navigate('/tai-khoan/')
    }
  }, [loginForm])

  return (
    <>
      <h3>Đăng nhập tài khoản</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Tên đăng nhập</Form.Label>
          <Form.Control defaultValue={'hoanpro698'} ref={inputUserName} className={!isValidUserName && 'formHelp'} placeholder="Tên tài khoản"/>
          {!isValidUserName && <span className="inlineHelp"> Tên tài khoản không được để trống! </span>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control defaultValue={'01272345hoan'} ref={inputPassword} className={!isValidPassword && 'formHelp'} placeholder="Mật khẩu"/>
          {!isValidPassword && <span className="inlineHelp"> Mật khẩu không được để trống! </span>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Button onClick={onButtonClick}>Đăng nhập</Button>
        </Form.Group>
      </Form>
    </>
    
  )
}

export default Login