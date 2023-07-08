import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QrCode from 'qrcode.react';
import './css/Fileshare.css';
import { useDropzone } from 'react-dropzone';
import logo from './css/img/logo.png';

const TYPING_DELAY = 100; // Adjust the typing delay as needed

export default function FileShare() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isFileSelected, setIsFileSelected] = useState(false);

  const redirectToCustomCode = () => {
    const randomCode = Math.floor(Math.random() * 1000000);
    window.location.href = `/customcode/${randomCode}`;
  };

  const handleFileSubmit = async () => {
    try {
      // Resetting error msg
      setErrorMsg('');

      // Checking if code is present or not
      const response = await axios.get(
        `https://we-share-lj6g.onrender.com/api/check-code/${code}`
      );
      if (response.data.message === true) {
        setErrorMsg('This code is already taken');
        return;
      } else {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('Code', code);

        const res = await axios.post(
          'https://we-share-lj6g.onrender.com/api/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            },
          }
        );
        setFileUploading(true);
        setUploadProgress(0); // Reset the upload progress

        // Upload completed
        setTimeout(() => {
          setUploadedFiles(res.data);
          setFileUploading(false);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCode = (e) => {
    try {
      setCode(e.target.value);
    } catch (err) {
      console.error(err);
    }
  };

  const onDrop = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
    setIsFileSelected(acceptedFiles.length > 0);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  useEffect(() => {
    let typingTimer;
    if (typingText.length < 18) {
      typingTimer = setInterval(() => {
        setTypingText((prevText) => prevText + 'Share File Here...'[prevText.length]);
      }, TYPING_DELAY);
    }
    return () => clearInterval(typingTimer);
  }, [typingText]);

  const handleCopyLink = () => {
    try {
      const downloadLink = `https://we-share-lj6g.onrender.com/api/download/${code}`;
      navigator.clipboard.writeText(downloadLink);
      alert('Download link copied to clipboard!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main">
      <nav className="navbar">
        <div className="left-section">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <h1>{typingText}</h1>
        </div>
        <div className="right-section">
          <button onClick={redirectToCustomCode}>share text</button>
        </div>
      </nav>

      <div className="file-share-container">
        <div className={`card ${uploadedFiles.length > 0 ? 'uploaded' : ''}`}>
          <div {...getRootProps({ className: `dropzone ${isDragActive ? 'active' : ''} ${isFileSelected ? 'file-selected' : ''}` })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <>
                <p>Drop the files here...</p>
                {selectedFiles.length > 0 && (
                  <p>Selected Files: {selectedFiles.map((file) => file.name).join(', ')}</p>
                )}
              </>
            ) : (
              <p>
                {selectedFiles.length > 0 ? (
                  <span>Selected Files: {selectedFiles.map((file) => file.name).join(', ')}</span>
                ) : (
                  ''
                )}
              </p>
            )}
          </div>

          <label htmlFor="code-input">Enter a code:</label>
          <input id="code-input" type="text" value={code} onChange={handleCode} />

          <button className="upload-button" onClick={handleFileSubmit}>
            {fileUploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
          </button>

          {errorMsg && <div className="error-message">{errorMsg}</div>}

          {uploadedFiles.length > 0 && (
            <div className="filedata">
              <p>Files uploaded successfully:</p>
              <ul>
                {uploadedFiles.map((file) => (
                  <li key={file.filename}>
                    <p>Code: {code}</p>
                    <p>Original name: {file.originalname}</p>
                    <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                    <button className="copy-button" onClick={handleCopyLink}>
                      Copy Link
                    </button>
                    <button className="download-button">
                      <a
                        className="downloadanchor"
                        href={`https://we-share-lj6g.onrender.com/api/download/${code}`}
                      >
                        Download
                      </a>
                    </button>
                    <p>Scan to Download</p>
                    <QrCode value={`https://we-share-lj6g.onrender.com/api/download/${code}`} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
