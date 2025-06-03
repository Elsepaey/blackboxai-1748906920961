import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BranchDeepLinkHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleDeepLink = () => {
      const currentUrl = window.location.href;
      const urlObj = new URL(currentUrl);
      
      // Check if we're on a Branch.io domain
      const isBranchDomain = currentUrl.includes("wzhu2.test-app.link") || 
                            currentUrl.includes("wzhu2.app.link");
      
      if (isBranchDomain) {
        // Initialize Branch SDK with deep link data handler
        window.branch.init('key_test_asCmg1x2BDyHh3GHNcEzofihqvepEG95', 
          (err, data) => {
            if (err) {
              console.error('Branch SDK initialization error:', err);
              return;
            }

            console.log('Branch data:', data);

            // Handle deep link data
            if (data.$deeplink_path) {
              const pathParts = data.$deeplink_path.split('/');
              const fileId = pathParts[pathParts.length - 1];
              
              if (fileId) {
                console.log("Redirecting to preview:", fileId);
                navigate(`/preview/${fileId}`, { replace: true });
              }
            } else if (data.file_id) {
              // Handle direct file_id from Branch link data
              console.log("Redirecting to file:", data.file_id);
              navigate(`/preview/${data.file_id}`, { replace: true });
            }
          }
        );
      } else {
        // Check URL parameters for Branch link
        const branchUrl = urlObj.searchParams.get("branch");
        if (branchUrl) {
          try {
            const branchUrlObj = new URL(branchUrl);
            const pathParts = branchUrlObj.pathname.split("/");
            const fileId = pathParts[pathParts.length - 1].split("?")[0];
            
            if (fileId && location.pathname === "/") {
              console.log("Redirecting to preview:", fileId);
              navigate(`/preview/${fileId}`, { replace: true });
            }
          } catch (error) {
            console.error("Error processing Branch.io link:", error);
          }
        }
      }
    };

    // Add listener for Branch data
    const branchListener = (event) => {
      if (event.detail && event.detail.$deeplink_path) {
        const pathParts = event.detail.$deeplink_path.split('/');
        const fileId = pathParts[pathParts.length - 1];
        
        if (fileId) {
          console.log("Received Branch data, redirecting to:", fileId);
          navigate(`/preview/${fileId}`, { replace: true });
        }
      }
    };

    document.addEventListener('branch-data', branchListener);
    handleDeepLink();

    return () => {
      document.removeEventListener('branch-data', branchListener);
    };
  }, [navigate, location]);

  return null;
};

export default BranchDeepLinkHandler;
