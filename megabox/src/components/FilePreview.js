import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#003e4b] text-white">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4"></div>
    <p className="text-lg">Loading preview...</p>
  </div>
);

const FilePreview = () => {
  const { fileId } = useParams();
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        if (!fileId) {
          throw new Error('File ID is missing');
        }

        // Mock response for testing since we don't have access to the actual backend
        // In production, this would be replaced with the actual API call
        const mockResponse = {
          ok: true,
          status: 200,
          json: async () => ({
            name: "Sample Document.pdf",
            fileType: "application/pdf",
            size: "2.5 MB",
            uploadDate: new Date().toISOString(),
            // We'll show a generic preview for non-image files
            previewUrl: null
          })
        };

        const response = mockResponse;

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('File not found or has expired');
          }
          throw new Error('Failed to load file preview');
        }

        const data = await response.json();
        setFileData(data);
      } catch (err) {
        console.error("Error fetching file data:", err);
        setError(err.message || 'Failed to load file preview. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [fileId]);

  const renderPreview = () => {
    if (!fileData) return null;

    const { fileType, previewUrl, name } = fileData;

    if (fileType?.startsWith('image/')) {
      return (
        <div className="relative w-full">
          <img 
            src={previewUrl} 
            alt={name} 
            className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
            onError={(e) => {
              e.target.onerror = null;
              setError('Failed to load image preview');
            }}
          />
        </div>
      );
    }

    if (fileType?.startsWith('video/')) {
      return (
        <div className="relative w-full">
          <video 
            controls 
            className="max-w-full rounded-lg shadow-lg mx-auto"
            onError={(e) => {
              e.target.onerror = null;
              setError('Failed to load video preview');
            }}
          >
            <source src={previewUrl} type={fileType} />
            Your browser does not support video playback.
          </video>
        </div>
      );
    }

    // For other file types (documents, archives, etc.)
    return (
      <div className="text-center p-8 bg-[#01677e] rounded-lg shadow-lg">
        <svg className="w-20 h-20 mx-auto mb-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
        </svg>
        <p className="text-xl font-semibold text-white mb-2">{name || 'File Preview'}</p>
        <div className="text-gray-200 space-y-2">
          <p>Type: {fileType?.split('/')[1]?.toUpperCase() || 'Unknown'}</p>
          {fileData.size && <p>Size: {fileData.size}</p>}
          {fileData.uploadDate && (
            <p>Uploaded: {new Date(fileData.uploadDate).toLocaleDateString()}</p>
          )}
          <p className="mt-4 text-sm">Preview not available for this file type</p>
        </div>
      </div>
    );
  };

  const getStoreLink = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      return "https://apps.apple.com/sg/app/terabox-1tb-cloud-ai-space/id1509453185?mt=8";
    }
    return "https://play.google.com/store/apps/details?id=com.dubox.drive";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#003e4b] text-white p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error Loading Preview</h2>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#01677e] text-white px-6 py-2 rounded-lg hover:bg-[#01677e]/80 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003e4b] text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img 
              src="https://www.terabox.com/share-image.png" 
              alt="TeraBox" 
              className="h-8 w-8 mr-2"
            />
            <h1 className="text-2xl font-bold">TeraBox</h1>
          </div>
          <span className="text-sm">1024GB Storage</span>
        </div>

        {/* Preview Container */}
        <div className="bg-[#01677e] rounded-lg shadow-xl p-6 mb-8">
          {renderPreview()}
        </div>

        {/* Open in App Button */}
        <div className="text-center">
          <a
            href={getStoreLink()}
            className="inline-block bg-[#01677e] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#01677e]/80 transition duration-300"
          >
            Open in App
          </a>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
