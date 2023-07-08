import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QrCode from 'qrcode.react';
import './css/Fileshare.css';
import { useDropzone } from 'react-dropzone';

const TYPING_DELAY = 100; // Adjust the typing delay as needed

export default function FileShare() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState({});
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [typingText, setTypingText] = useState('');

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
        formData.append('file', selectedFile);
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

        // Upload completed
        setTimeout(() => {
          setUploadedFile(res.data);
          setFileUploading(false);
          setUploadProgress(0); // Reset the upload progress
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
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    let typingTimer;
    if (typingText.length < 18) {
      typingTimer = setInterval(() => {
        setTypingText((prevText) => prevText + 'Share File Here...'[prevText.length]);
      }, TYPING_DELAY);
    }
    return () => clearInterval(typingTimer);
  }, [typingText]);

  return (
    <div className="main">
      <nav className="navbar">
        <div className="left-section">
          <h1>{typingText}</h1>
        </div>
        <div className="right-section">
          <button onClick={redirectToCustomCode}>share text</button>
        </div>
      </nav>

      <div className="file-share-container">
        <div className="card" uploadedFile={uploadedFile}>
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <>
                <p>Drop the file here...</p>
                {selectedFile && <p>Selected File: {selectedFile.name}</p>}
              </>
            ) : (
              <p>
                {selectedFile ? (
                  <span>Selected File: {selectedFile.name}</span>
                ) : (
                  'Drag and drop a file here or click to select a file'
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

          {uploadedFile.filename && (
            <div className="filedata">
              <p>File uploaded successfully:</p>
              <ul>
                <li>Code: {code}</li>
                <li>Original name: {uploadedFile.originalname}</li>
                <li>Size: {(uploadedFile.size / 1024).toFixed(2)} KB</li>
                <li>
                  <button
                    className="copy-button"
                    onClick={() => {
                      const downloadLink = `https://we-share-lj6g.onrender.com/api/download/${code}`;
                      navigator.clipboard.writeText(downloadLink);
                      alert('Download link copied to clipboard!');
                    }}
                  >
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
                </li>
                <p>Scan to Download</p>
                <li>
                  <QrCode
                    value={`https://we-share-lj6g.onrender.com/api/download/${code}`}
                  />
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
