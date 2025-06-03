import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedFile } from '../utils/apiService';
import './DeepLinkPreview.css';

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  }}>
    <div className="loading-spinner" style={{
      width: '40px',
      height: '40px',
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #3b82f6',
      borderRadius: '50%',
      marginBottom: '1rem'
    }}></div>
    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading preview...</p>
  </div>
);

const ErrorDisplay = ({ message, onRetry, onHome }) => (
  <div className="preview-container" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '1rem'
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      textAlign: 'center',
      maxWidth: '400px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)'
    }}>
      <svg style={{
        width: '48px',
        height: '48px',
        color: '#ef4444',
        margin: '0 auto 1rem'
      }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 style={{ 
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '0.75rem'
      }}>Error Loading Preview</h2>
      <p style={{ 
        color: '#64748b',
        marginBottom: '1.5rem',
        fontSize: '0.875rem'
      }}>{message}</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button 
          onClick={onRetry} 
          className="retry-button"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
        <button 
          onClick={onHome}
          className="home-button"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
);

const FilePreview = ({ fileData }) => {
  const isPDF = fileData.type === 'application/pdf';
  const formattedSize = fileData.size < 1024 
    ? `${fileData.size} B`
    : fileData.size < 1024 * 1024
    ? `${(fileData.size / 1024).toFixed(1)} KB`
    : `${(fileData.size / (1024 * 1024)).toFixed(1)} MB`;

  const uploadDate = new Date(fileData.uploadDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="file-card" style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <svg className="file-icon" style={{
          width: '64px',
          height: '64px',
          color: '#3b82f6',
          margin: '0 auto 1rem'
        }} fill="currentColor" viewBox="0 0 24 24">
          {isPDF ? (
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
          ) : (
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
          )}
        </svg>
        
        <h2 style={{ 
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '0.5rem',
          wordBreak: 'break-word'
        }}>{fileData.name}</h2>
        
        <div style={{ 
          color: '#64748b',
          fontSize: '0.875rem',
          marginBottom: '0.5rem'
        }}>
          {formattedSize} • Uploaded {uploadDate}
        </div>
        
        {fileData.sharedBy && (
          <div style={{ 
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            Shared by: {fileData.sharedBy.username}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <a
          href={fileData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="download-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
          download={fileData.name}
        >
          <svg style={{
            width: '20px',
            height: '20px',
            marginRight: '0.5rem'
          }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download File
        </a>
      </div>
    </div>
  );
};

const DeepLinkPreview = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);

  const fetchFileData = useCallback(async () => {
    console.log('fetchFileData called with fileId:', fileId);
    if (!fileId) {
      console.log('No fileId provided, setting error');
      setError('File ID is missing');
      setLoading(false);
      return;
    }

    console.log('Setting loading state to true');
    setLoading(true);
    setError(null);
    
    console.log('Calling getSharedFile API');
    const result = await getSharedFile(fileId);
    console.log('API call result:', result);

    if (!result.success) {
      console.log('API call failed with error:', result.error);
      setError(result.error);
    } else {
      console.log('API call succeeded, setting fileData');
      setFileData(result.data);
    }
    
    console.log('Setting loading state to false');
    setLoading(false);
  }, [fileId]);

  useEffect(() => {
    fetchFileData();
  }, [fetchFileData]);

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

  if (!fileData) {
    return (
      <ErrorDisplay 
        message="No file data available"
        onRetry={fetchFileData}
        onHome={() => navigate('/')}
      />
    );
  }

  return (
    <div className="preview-container" style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>MegaBox</h1>
          <button 
            onClick={() => navigate('/')}
            className="back-button"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
        </div>

        {/* File Preview */}
        <FilePreview fileData={fileData} />
      </div>
    </div>
  );
};

export default DeepLinkPreview;
