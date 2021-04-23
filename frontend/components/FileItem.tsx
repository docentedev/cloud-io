import React, { useState } from "react";
import GuitarProIcon from '../img/guitar-pro.png'
import Mp3Icon from '../img/mp3.svg'
import MovIcon from '../img/mov.svg'
import { Modal, Button, ButtonGroup, Col, Panel, IconButton, Icon } from "rsuite";

const resolveUrl = (file: FileType): {
  url: string,
  extName: string,
  img: boolean,
  audio?: boolean,
  name?: string,
} => {
  const ext = file.name.split('.').reverse()[0]
  switch (ext) {
    case 'png':
      return { url: file.url, extName: 'Image PNG', img: true }
    case 'gp':
      return { url: GuitarProIcon, extName: 'Guitar Pro 7', img: true }
    case 'mov':
      return { url: MovIcon, extName: 'Video MOV', img: true }
    case 'mp3':
      return { url: Mp3Icon, extName: 'Audio MP3', img: true, audio: true }
    default:
      return { url: ext, extName: 'File', img: false }
  }
}

export const FileContainer = ({ file, onSuccess }: { file: FileType, onSuccess: () => void }): JSX.Element => {
  const [show, setShow] = useState(false)
  const u = resolveUrl(file)

  const handlerRemove = () => {
    fetch(`/api/files/${file.id}`, {
      "method": "DELETE",
    })
      .then(response => {
        console.log(response);
        onSuccess()
      })
      .catch(err => {
        console.error(err);
      });
  }
  return (
    <Col xs={24} sm={12} md={8} lg={4}>
      <Panel bordered header={file.name}>
        <div className="file-description">
          {u.audio ? (
            <audio controls className="position-absolute top-50 start-50 translate-middle">
              <source src={file.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>) : (u.img ? (
              <img onClick={() => setShow(true)} src={u.url} width="80" height="80" className="img-cover" />
            ) : (<p>{file.ext}</p>))}
        </div>
        <ButtonGroup>
          <Button onClick={() => setShow(true)}>{u.extName}</Button>
          <IconButton
            target={"_bank"}
            href={file.url} download={file.name}
            icon={<Icon icon="download" />} placement="left" />
          <IconButton
          onClick={handlerRemove}
            icon={<Icon icon="trash" />} placement="left" />
        </ButtonGroup>
      </Panel>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Body className="text-center">
          {u.audio ? (
            <audio controls className="position-absolute top-50 start-50 translate-middle">
              <source src={file.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>) : (u.img ? (
              <img src={u.url} className="img-fluid" />
            ) : (<p>{file.ext}</p>))}
        </Modal.Body>
      </Modal>
    </Col>
  )
}

export default FileContainer
