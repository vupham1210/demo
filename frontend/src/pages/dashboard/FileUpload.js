import React, { useState } from 'react'
import { Loader, Uploader, Avatar, toaster, Message } from 'rsuite';
import { refreshNewToken } from '../../features/Instance';

const styles = {
  lineHeight: '200px'
};

const UpLoadServerURI = process.env.REACT_APP_SERVER_URL + '/upload/';

const FileUpload = () => {

  let token = localStorage.getItem('token');
  let refreshToken = localStorage.getItem('refreshToken');
  let expiredAt = localStorage.getItem('expiredAt');

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
  const [loading, setLoading] = useState(false);
  const [tokenValidate, setTokenValidate] = useState(token);

  return (
    <Uploader 
    accept="image/*" 
    action={UpLoadServerURI} 
    multiple={true} 
    name="uploaded_file"
    draggable
    headers= {{
      token: `bear ${tokenValidate}` 
    }}

    shouldQueueUpdate={fileList => {
      setLoading(true);
      ValidateToken();
    }}

    shouldUpload={file => {
      return new Promise(resolve => {
        setTimeout(() => {
          alert('File check passed, run upload');
          resolve(true);
          setLoading(false);
        }, 2000);
      });
    }}

    onSuccess = { response => {
      console.log(response);
    }}
    >
      <div style={styles}>Nhấn vào hoặc kéo thả hình ảnh vào đây</div>
    </Uploader>
  )
}

export default FileUpload