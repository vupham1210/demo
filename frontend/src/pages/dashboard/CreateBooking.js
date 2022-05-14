import React, { useRef, useState } from 'react'
import { Button , Row, Col } from 'react-bootstrap';
import { Editor} from '@tinymce/tinymce-react';
import { Image, Plus } from 'react-bootstrap-icons';
import { Calendar } from 'react-date-range';
import { Loader, Uploader, Avatar, toaster, Message } from 'rsuite';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { Form } from 'rsuite';

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
  height: 200
};

const stylesDragger = {
  width: '100%',
  height: 120
};

const CreateBooking = () => {

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
        console.log(editorRef.current.getContent());
    }
  }
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const[gallery, setGallery] = useState([1,2,3]); 

  return (
    <Form>
        <Row>
          <Col xs={5}>
           <Form.Group className='mb-3'>
              <Form.ControlLabel>
                Ảnh đại diện
              </Form.ControlLabel>
              <Uploader
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
          <Col xs={7}>
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
            <Form.Group className='mb-3'>
              <Form.ControlLabel>
                Tiêu đề
              </Form.ControlLabel>
              <Form.Control placeholder='Nhập tiêu đề'/>
            </Form.Group>
          </Col>
          <Col xs={12}>
          <Form.Group className='mb-3'>
              <Form.ControlLabel>
                Nội dung
              </Form.ControlLabel>
              <Editor
                apiKey='g5edrfn3vpjve2o25ec8l5r87960ol0al13hx5e4rnfaj0pu'
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                height: 300,
                menubar: false,
                plugins: [
                  'lists','link','charmap','preview','anchor','searchreplace','visualblocks','insertdatetime','table','help','wordcount'
                ],
                toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist checklist outdent indent | removeformat'
                }}
            />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group className='mb-3'>
              <Form.ControlLabel>
                Từ ngày
              </Form.ControlLabel>
              <Calendar
                  date={new Date()}
                  onChange={(e) => console.log(e.target.value)}
                />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group className='mb-3'>
              <Form.ControlLabel>
                Đến ngày
              </Form.ControlLabel>
              <Form.Control placeholder='Nhập tiêu đề'/>
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Button onClick={log}>Đăng thông tin</Button>
          </Col>
        </Row>
    </Form>
  )
}

export default CreateBooking;