import React, { useState } from 'react';
import { createBranchLink, trackBranchEvent } from '../utils/branchHelper';

const LandingPage = () => {
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      // Demo file ID and name
      const demoFileId = 'demo123';
      const demoFileName = 'Sample File.pdf';
      
      const link = await createBranchLink(demoFileId, demoFileName);
      setShareUrl(link);
      
      // Track share event
      trackBranchEvent('share_link_created', {
        fileId: demoFileId,
        fileName: demoFileName
      });
    } catch (error) {
      console.error('Error creating share link:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="nav">
        <div className="container nav-content">
          <span className="nav-brand">MegaBox</span>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container">
        <div className="text-center" style={{ padding: '6rem 0' }}>
          <h1>Transform Your Storage</h1>
          <h2 style={{ color: '#60a5fa' }}>with MegaBox</h2>
          <p className="mx-auto" style={{ maxWidth: '600px' }}>
            The most secure and efficient way to store and manage your belongings.
          </p>
          
          {/* Share Demo Section */}
          <div className="mx-auto max-w-md mt-4">
            <div className="card">
              <h3 className="mb-4">Try Our Sharing Feature</h3>
              <button
                onClick={handleShare}
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Generating Link...' : 'Generate Share Link'}
              </button>
              
              {shareUrl && (
                <div className="mt-4">
                  <p className="mb-4">Share this link:</p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="w-full"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        trackBranchEvent('share_link_copied');
                      }}
                      className="btn btn-outline w-full"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* App Store Buttons */}
          <div className="mt-4" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <a
              href="https://apps.apple.com/sg/app/terabox-1tb-cloud-ai-space/id1509453185?mt=8"
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', backgroundColor: 'black' }}
            >
              <svg className="mr-2" style={{ width: '2rem', height: '2rem' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.07-.5-2.04-.48-3.16 0-1.39.68-2.12.53-3.01-.4C3.33 15.85 4.05 8.42 9.15 8.06c1.2-.07 2.08.4 2.85.5.77.1 1.8-.4 3.16-.3 2.03.2 3.56 1.1 4.3 2.7-3.87 2.24-3.23 7.87.6 9.32zm-4.2-16.4c-2.5.16-4.45 2.8-4.2 4.96 2.27.25 4.47-2.5 4.2-4.95z"/>
              </svg>
              <div>
                <div style={{ fontSize: '0.75rem' }}>Download on the</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>App Store</div>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.dubox.drive"
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', backgroundColor: 'black' }}
            >
              <svg className="mr-2" style={{ width: '1.5rem', height: '1.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/>
              </svg>
              <div>
                <div style={{ fontSize: '0.625rem' }}>GET IT ON</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', marginTop: '0.25rem' }}>Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
