import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DeepLinkPreview from './components/DeepLinkPreview';
import BranchDeepLinkHandler from './components/BranchDeepLinkHandler';
import RedirectHandler from './components/RedirectHandler';
import { initBranch, handleBranchDeepLink } from './utils/branchHelper';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeBranch = async () => {
      try {
        // Check if we're on a Branch.io domain
        const isBranchDomain = window.location.hostname.includes('wzhu2.test-app.link') || 
                             window.location.hostname.includes('wzhu2.app.link');

        if (isBranchDomain) {
          setIsLoading(false);
          return; // Let RedirectHandler handle Branch domains
        }

        // Initialize Branch SDK
        const data = await initBranch();
        console.log('Branch SDK initialized:', data);

        // Handle deep link data if present
        if (data['+clicked_branch_link']) {
          const deepLinkData = handleBranchDeepLink(data);
          console.log('Deep link data:', deepLinkData);

          if (deepLinkData?.fileId) {
            navigate(`/preview/${deepLinkData.fileId}`);
          }
        }
      } catch (error) {
        console.error('Error initializing Branch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBranch();
  }, [navigate]);

  // Check if we're on a Branch.io domain
  const isBranchDomain = window.location.hostname.includes('wzhu2.test-app.link') || 
                        window.location.hostname.includes('wzhu2.app.link');

  if (isBranchDomain) {
    return <RedirectHandler />;
  }

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
        <Route path="/preview/:fileId" element={<DeepLinkPreview />} />
        <Route path="/redirect" element={<RedirectHandler />} />
      </Routes>
    </>
  );
}

export default App;
