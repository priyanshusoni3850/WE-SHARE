import React, { useState } from 'react';
import axios from 'axios';
import QrCode from 'qrcode.react';
import './css/Fileshare.css';
export default function Fileshare() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState({});
    const [code, UploadCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        console.log(file);
        setSelectedFile(file);
    };

    const handleFileSubmit = async () => {
        try {
            // resetting error msg
            setErrorMsg('');
            // checking for code is present or not
            const response = await axios.get(`https://we-share-lj6g.onrender.com/api/check-code/${code}`);
            if (response.data.message === true) {
                setErrorMsg('This code is already taken');
                return;
            } else {
                const formData = new FormData();
                // console.log(formData);
                formData.append('file', selectedFile);
                formData.append('Code', code);

                const res = await axios.post('https://we-share-lj6g.onrender.com/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setUploadedFile(res.data);
            }


            // const res = await axios.post('http://localhost:5000/api/upload', formData, {
            //           headers: {
            //                     'Content-Type': 'multipart/form-data',
            //           },
            // });
            // setUploadedFile(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCode = (e) => {
        try {
            UploadCode(e.target.value);
            console.log({ code });
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <div className='main'>

            <div className='nav'>
                <h1>File and Text Sharing Website</h1>
            </div>
            <div className="file-share-container">
                <h2>Upload a File</h2>
                <div className='card'>
                    <label htmlFor="file-input">Choose a file:</label>
                    <input id="file-input" type="file" onChange={handleFileUpload} />
                    <label htmlFor="code-input">Enter a code:</label>
                    <input id="code-input" type="text" value={code} onChange={handleCode} />

                    <button onClick={handleFileSubmit}>Upload</button>


                    {errorMsg && (
                        <div className="error-message">{errorMsg}</div>
                    )}


                    {uploadedFile.filename && (
                        <div className="filedata">
                            <p>File uploaded successfully:</p>
                            <ul>
                                {/* <li>Filename: {uploadedFile.filename}</li> */}
                                <li>Code: {code}</li>
                                <li>Original name: {uploadedFile.originalname}</li>
                                <li>Type: {uploadedFile.mimetype}</li>
                                <li>Size: {(uploadedFile.size / 1024).toFixed(2)} KB</li>
                                <li>
                                    <button
                                        className='downloadLink'
                                        onClick={() => {
                                            const downloadLink = `https://we-share-lj6g.onrender.com/api/download/${code}`;
                                            navigator.clipboard.writeText(downloadLink);
                                            alert('Download link copied to clipboard!');
                                        }}
                                    >
                                        Copy Link
                                    </button>
                                    <button className='downloadLink'>
                                    <a className='downloadanchor' href={`https://we-share-lj6g.onrender.com/api/download/${code}`}>
                                        Download
                                    </a>
                                    </button>
                                </li>
                                <p>Scan to Download</p>
                                <li>
                                    <QrCode value={`https://we-share-lj6g.onrender.com/api/download/${code}`} />
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
