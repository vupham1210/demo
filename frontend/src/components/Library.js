import React, { useState, useEffect } from 'react'
import { Uploader, Message, toaster  } from 'rsuite';
import { loadLibraryAsync, library, uploadLibraryStatus, setImageSelected, imagesSelected, setSingleSelected } from '../features/library/LibrarySlice';
import { refreshNewToken } from '../features/Instance';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Col, Row } from 'react-bootstrap';
import { AxiosInstance } from '../features/Instance';
import axios from 'axios';
import { XLg } from 'react-bootstrap-icons';

const UpLoadServerURI = process.env.REACT_APP_SERVER_URL + '/upload/';
const DeleteUploadServerURI = process.env.REACT_APP_SERVER_URL + '/upload/delete';

const previewFile = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
}

const IndexLibrary = (props) => {

     const dispatch = useDispatch();
     const ImageSected = useSelector(imagesSelected);

     const toggle = async (image) => {
        if(props.multipe){
           await dispatch(setImageSelected(image));
        } else {
           await dispatch(setSingleSelected(image));
        }
     }

     const removeFileImage = async (File_id, File_path) => {
        const data = { file_id: File_id, file_path: File_path};
        try {
        const remove = await AxiosInstance.post(DeleteUploadServerURI, data).then((res) =>
          {
            return res.data;
          }
        );
    
        if(remove){
              dispatch(loadLibraryAsync());
              console.log(`đã xóa file ${File_id}`);
            }
        } catch (error) {
            console.log(error);
        }
    } 

  
     return props ?
     <div class="indexLibrary">
        
        <div class="row m-0">
            {
                props.images ? 
                props.images.map((val) => {

                return <Col md={3} xs={4} key={val._id}>
                            <div className={ImageSected.includes(val) ? 'LibraryThumbnail actived mb-3' : 'LibraryThumbnail mb-3'} onClick={() => {toggle(val)}}>
                                <Button variant='danger' onClick={() => {removeFileImage( val._id , val.image )}}>
                                  <XLg width={16} height={16}/>
                                </Button>
                                <img src={val.path} />
                            </div>
                        </Col>
                }) 
                : ''
            }
        </div> 
     </div>
    : ''; 
}
const UploadLibrary = (props) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const libraryData = useSelector(library)
  const [loading, setLoading] = useState(false);

  let token = localStorage.getItem('token');
  let refreshToken = localStorage.getItem('refreshToken');
  let expiredAt = localStorage.getItem('expiredAt');

  const styles = {
    lineHeight: '100px'
  };

  const [tokenValidate, setTokenValidate] = useState(token);

  useEffect(() => {
    dispatch(loadLibraryAsync());
    dispatch(setSingleSelected(''));
  }, [dispatch]);

  async function ValidateToken () {
    if( token != undefined){    
      console.log('refresh', expiredAt) 
      console.log('now', Date.now()) 
      if(expiredAt < Date.now()){
      const newToken = await refreshNewToken(refreshToken);
      if(newToken){
        token = newToken.token;
        refreshToken = newToken.token;
      }
    }
  }
  setTokenValidate(token);   
  }

  return (
    <div className='w-100'>
        <IndexLibrary images={libraryData} multipe={props.multipe}/>
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
                ValidateToken();
            }}

            onSuccess = { response => {
                dispatch(loadLibraryAsync());
            }}
            onError = {
                (reason, file) => {
                    toaster.push(<Message type="error">{reason.response.message}</Message>);
                }
            }
            >
            <div style={styles}>Nhấn vào hoặc kéo thả hình ảnh vào đây</div>
            </Uploader>
    </div>
  )
}

const Library = (props) => {
  const [librarySelect, setlibrarySelect] = useState('demo');   
  return (
    <div>
        <UploadLibrary multipe={props.multipe}/>
    </div>
  )
}

export default Library