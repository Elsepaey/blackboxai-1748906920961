import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading preview...</p>
  </div>
);

const ErrorDisplay = ({ message, onRetry, onHome }) => (
  <div className="error-container">
    <div className="error-content">
      <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 className="error-title">Error Loading Preview</h2>
      <p className="error-message">{message}</p>
      <div className="error-actions">
        <button onClick={onRetry} className="btn btn-primary">
          Try Again
        </button>
        <button onClick={onHome} className="btn btn-outline">
          Go Home
        </button>
      </div>
    </div>
  </div>
);

// Demo file data for testing
const demoFiles = {
  'vHoDbDqPSTb': {
    id: 'vHoDbDqPSTb',
    name: 'Sample Document.pdf',
    fileType: 'application/pdf',
    previewUrl: 'https://example.com/sample.pdf',
    size: '2.5 MB',
    uploadDate: new Date().toISOString(),
    description: 'This is a sample document for demonstration purposes.'
  },
  'demo123': {
    id: 'demo123',
    name: 'Demo File.pdf',
    fileType: 'application/pdf',
    previewUrl: 'https://example.com/demo.pdf',
    size: '1.8 MB',
    uploadDate: new Date().toISOString(),
    description: 'A demo file for testing the preview functionality.'
  }
};

const DeepLinkPreview = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);

  const fetchFileData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if this is a demo file
      if (demoFiles[fileId]) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setFileData(demoFiles[fileId]);
      } else {
        throw new Error('File not found or access denied');
      }
    } catch (err) {
      console.error("Error fetching file data:", err);
      setError(err.message || 'Failed to load file preview. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fileId]);

  useEffect(() => {
    if (fileId) {
      fetchFileData();
    } else {
      setError('File ID is missing');
      setLoading(false);
    }
  }, [fileId, fetchFileData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        message={error}
        onRetry={fetchFileData}
        onHome={() => navigate('/')}
      />
    );
  }

  return (
    <div className="preview-container">
      <div className="preview-content">
        {/* Header */}
        <div className="preview-header">
          <h1>MegaBox</h1>
          <button onClick={() => navigate('/')} className="btn btn-link">
            Back to Home
          </button>
        </div>

        {/* Preview Container */}
        <div className="file-preview-card">
          <div className="file-info">
            <h2>{fileData.name}</h2>
            
            {fileData.fileType?.startsWith('image/') ? (
              <img 
                src={fileData.previewUrl} 
                alt={fileData.name} 
                className="preview-image"
              />
            ) : (
              <div className="file-icon-container">
                <svg className="file-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                </svg>
                <p className="file-name">{fileData.name}</p>
                <p className="file-meta">
                  {fileData.size} • Uploaded {new Date(fileData.uploadDate).toLocaleDateString()}
                </p>
                {fileData.description && (
                  <p className="file-description">{fileData.description}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="download-section">
            <a
              href={fileData.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Download File
            </a>
          </div>
        </div>

        {/* App Download Section */}
        <div className="app-download-section">
          <p>Get the full experience with our mobile app</p>
          <div className="app-buttons">
            <a
              href="https://apps.apple.com/sg/app/terabox-1tb-cloud-ai-space/id1509453185?mt=8"
              className="btn btn-store"
            >
              <svg className="store-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.07-.5-2.04-.48-3.16 0-1.39.68-2.12.53-3.01-.4C3.33 15.85 4.05 8.42 9.15 8.06c1.2-.07 2.08.4 2.85.5.77.1 1.8-.4 3.16-.3 2.03.2 3.56 1.1 4.3 2.7-3.87 2.24-3.23 7.87.6 9.32zm-4.2-16.4c-2.5.16-4.45 2.8-4.2 4.96 2.27.25 4.47-2.5 4.2-4.95z"/>
              </svg>
              <div>
                <div className="store-label">Download on the</div>
                <div className="store-name">App Store</div>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.dubox.drive"
              className="btn btn-store"
            >
              <svg className="store-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/>
              </svg>
              <div>
                <div className="store-label">GET IT ON</div>
                <div className="store-name">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepLinkPreview;
