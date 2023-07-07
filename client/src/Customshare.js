import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/Customshare.css';

// import the prismjs styles and scripts
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import Prism from 'prismjs'; // import Prism here

// import the necessary languages for syntax highlighting
import 'prismjs/components/prism-jsx.min.js';
import 'prismjs/components/prism-json.min.js';

export default function Customshare() {
  const { codeParam } = useParams();
  const [sharedText, setSharedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);//added

  useEffect(() => {
    const fetchSharedText = async () => {
      try {
        const res = await axios.get(`https://we-share-lj6g.onrender.com/api/shared-text/${codeParam}`);
        setSharedText(res.data.text);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSharedText();
  }, [codeParam]);

  useEffect(() => {
    const handleShareText = async () => {
      setIsLoading(true); // Added this line
      try {
        await axios.post('https://we-share-lj6g.onrender.com/api/share', { text: sharedText,clientcode:codeParam });
        //   setSharedText('');
      } catch (err) {
        console.error(err);
      }

      setIsLoading(false); // Added this line
    };
    handleShareText();
  }, [sharedText,codeParam]);

  useEffect(() => {
    localStorage.setItem('sharedText', sharedText);

    
    // highlight the code block when the component mounts or updates
    Prism.highlightAll();
  }, [sharedText,codeParam]);


  return (
    <div className='container'>
      <h2>Share a Text</h2>
      <textarea value={sharedText} onChange={(e) => setSharedText(e.target.value)}   onBlur={handleShareText}
        disabled={isLoading} />


    </div>
  );
}