import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DeepLinkPreview from './components/DeepLinkPreview';
import BranchDeepLinkHandler from './components/BranchDeepLinkHandler';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleInitialNavigation = () => {
      try {
        // Check if we're on a preview path
        const pathParts = location.pathname.split('/');
        if (pathParts[1] === 'preview' && pathParts[2]) {
          // We're already on a preview page, no need to redirect
          console.log('Viewing preview for:', pathParts[2]);
        } else if (location.search) {
          // Check for file ID in query parameters
          const params = new URLSearchParams(location.search);
          const fileId = params.get('file');
          if (fileId) {
            navigate(`/preview/${fileId}`);
          }
        }
      } catch (error) {
        console.error('Error handling navigation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleInitialNavigation();
  }, [navigate, location]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#003e4b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1rem',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            borderTopColor: 'white',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: '1.125rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BranchDeepLinkHandler />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/preview/:fileId" element={<DeepLinkPreview key={window.location.pathname} />} />
      </Routes>
    </>
  );
}

export default App;
