import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Fileshare from './Fileshare';
import Textshare from './Textshare';
import Customshare from './Customshare';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Fileshare />} />
        <Route path="/textshare" element={<Textshare />} />
        <Route path="/customcode/:codeParam" element={<Customshare />} />

      </Routes>
    </Router> 
  );
}

export default App;
