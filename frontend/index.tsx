import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import FileContainer from "./components/FileItem";
import 'rsuite/dist/styles/rsuite-default.css';
import './helpers.css';
import './style.css';
import { Container, Grid, Row } from 'rsuite';
import FileUpload from "./components/FileUpload";

const App = () => {
  const [files, setFiles] = useState([])
  const [refresh, setRefresh] = useState(new Date().getTime())
  
  useEffect(() => {
    fetch('/api/files').then((e) => {
      e.json().then(data => {
        setFiles(data);
      })
    })
  }, [refresh])
  return (
    <Container className="m-10">
      <Grid>
        <Row className="show-grid">
          {files.map((file: FileType) => (
            <FileContainer key={file.id} file={file} onSuccess={() => setRefresh(new Date().getTime())} />
          ))}
        </Row>
        <Row className="show-grid">
          <FileUpload onSuccess={() => setRefresh(new Date().getTime())} />
        </Row>
      </Grid>
    </Container>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);