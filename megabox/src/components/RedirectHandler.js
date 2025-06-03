import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initBranch, handleBranchDeepLink } from '../utils/branchHelper';

const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Initialize Branch SDK
        const data = await initBranch();
        console.log('Branch initialization data:', data);

        if (data['+clicked_branch_link']) {
          const deepLinkData = handleBranchDeepLink(data);
          console.log('Deep link data:', deepLinkData);

          if (deepLinkData?.fileId) {
            navigate(`/preview/${deepLinkData.fileId}`);
          } else {
            navigate('/');
          }
        } else {
          // If no deep link data, check URL parameters
          const params = new URLSearchParams(location.search);
          const redirectUrl = params.get('url');
          
          if (redirectUrl) {
            window.location.replace(decodeURIComponent(redirectUrl));
          } else {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
        navigate('/');
      }
    };

    handleRedirect();
  }, [location, navigate]);

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
        <p style={{ fontSize: '1.125rem' }}>Redirecting...</p>
      </div>
    </div>
  );
};

export default RedirectHandler;
