import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import FilePreview from './components/FilePreview';
import { extractFileIdFromBranchLink } from './utils/branchHelper';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleDeepLink = async () => {
      try {
        // Check if we're on the root path and have a Branch.io URL
        if (location.pathname === '/' && window.location.href.includes('wzhu2.test-app.link')) {
          const fileId = await extractFileIdFromBranchLink(window.location.href);
          if (fileId) {
            navigate(`/preview/${fileId}`);
          }
        }
      } catch (error) {
        console.error('Error handling deep link:', error);
      }
    };

    handleDeepLink();
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/preview/:fileId" element={<FilePreview />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
