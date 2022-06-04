import React, { useState } from 'react'
import { Card } from 'react-bootstrap';
import { Loader, Uploader, Avatar, toaster, Message } from 'rsuite';
import Library from '../../components/Library';
import { refreshNewToken } from '../../features/Instance';


const styles = {
  lineHeight: '200px'
};

const UpLoadServerURI = process.env.REACT_APP_SERVER_URL + '/upload/';

const FileUpload = () => {

  let token = localStorage.getItem('token');
  let refreshToken = localStorage.getItem('refreshToken');
  let expiredAt = localStorage.getItem('expiredAt');

  const [loading, setLoading] = useState(false);
  const [tokenValidate, setTokenValidate] = useState(token);
  async function ValidateToken () {
    if( token != undefined){     
      if(expiredAt < Date.now()){
      const newToken = await refreshNewToken(refreshToken);
      token = newToken.token;
      refreshToken = newToken.token;
    }
  }
  setTokenValidate(token);   
  }

  return (
    <Card className="bg-whitesmoke">
      <Card.Header>
        <h5>Quản lý thư viện</h5>
      </Card.Header>
      <Card.Body>
        <Library multipe={false} />
      </Card.Body>
    </Card>
  )
}

export default FileUpload