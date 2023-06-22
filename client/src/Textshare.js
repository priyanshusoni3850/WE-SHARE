import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Textshare() {

          const [sharedText, setSharedText] = useState('');

          useEffect(() => {
                  fetchSharedText();
                  }, []);
                
                  const fetchSharedText = async () => {
                    try {
                      const res = await axios.get('http://localhost:5000/api/shared-text');
                      setSharedText(res.data.text);
                    } catch (err) {
                      console.error(err);
                    }
                  };

                  const handleShareText = async () => {
                    try {
                      await axios.post('http://localhost:5000/api/share', { text: sharedText });
                      setSharedText('');
                    } catch (err) {
                      console.error(err);
                    }
                  };
                
  return (
    <div>
            <h2>Share a Text</h2>
      <textarea value={sharedText} onChange={(e) => setSharedText(e.target.value)} />
      <br />
      <button onClick={handleShareText}>Share</button>
      <hr />
      <h2>Last Shared Text</h2>
      <button onClick={fetchSharedText}>Refresh</button>
      <p>{sharedText}</p>
    </div>
  )
}
