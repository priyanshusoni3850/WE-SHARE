import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Customshare.css';

const TYPING_DELAY = 100; // Adjust the typing delay as needed

export default function Customshare() {
  const { codeParam } = useParams();
  const [sharedText, setSharedText] = useState('');
  const [typingText, setTypingText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedText = async () => {
      try {
        const res = await axios.get(
          `https://we-share-lj6g.onrender.com/api/shared-text/${codeParam}`
        );
        setSharedText(res.data.text);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSharedText();
  }, [codeParam]);

  const handleShareText = useCallback(async (text) => {
    try {
      await axios.post('https://we-share-lj6g.onrender.com/api/share', {
        text,
        clientcode: codeParam,
      });
    } catch (err) {
      console.error(err);
    }
  }, [codeParam]);

  useEffect(() => {
    const savedText = localStorage.getItem('sharedText');
    if (savedText) {
      setSharedText(savedText);
      handleShareText(savedText); // Save the text to the database immediately
    }
  }, [handleShareText]);

  useEffect(() => {
    localStorage.setItem('sharedText', sharedText);
  }, [sharedText]);

  const handleShareFile = () => {
    navigate('/');
  };

  useEffect(() => {
    let typingTimer;
    if (typingText.length < 12) {
      typingTimer = setInterval(() => {
        setTypingText((prevText) => prevText + 'Share a Text'[prevText.length]);
      }, TYPING_DELAY);
    }
    return () => clearInterval(typingTimer);
  }, [typingText]);

  return (
    <div className="container">
      <nav className="textnavbar">
        <div className="navbar-content">
          <h2>{typingText}</h2>
          <div>
            <button onClick={handleShareFile} className="sharefilebutton">
              Share a File
            </button>
          </div>
        </div>
      </nav>
      <textarea
        value={sharedText}
        onChange={(e) => {
          setSharedText(e.target.value);
          handleShareText(e.target.value); // Save the text to the database immediately
        }}
      />
    </div>
  );
}
