// Function to extract fileId from Branch.io deep link
export const extractFileIdFromBranchLink = (url) => {
  try {
    // Parse the URL
    const urlObj = new URL(url);
    
    // Check if it's a Branch test or live domain
    if (urlObj.hostname === 'wzhu2.test-app.link' || urlObj.hostname === 'wzhu2.app.link') {
      // Extract file ID from URL parameters
      const params = new URLSearchParams(urlObj.search);
      
      // Common Branch.io parameter names that might contain the file ID
      const possibleParams = ['file_id', '$canonical_identifier', 'id'];
      
      for (const param of possibleParams) {
        const value = params.get(param);
        if (value) {
          return Promise.resolve(value);
        }
      }
      
      // If no parameters found, try using the last part of the path
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        return Promise.resolve(pathParts[pathParts.length - 1]);
      }
    }
    
    // For direct preview URLs
    const match = url.match(/\/preview\/([^/?]+)/);
    if (match && match[1]) {
      return Promise.resolve(match[1]);
    }
    
    throw new Error('Could not extract file ID from URL');
  } catch (error) {
    console.error('Error extracting file ID:', error);
    return Promise.reject(error);
  }
};

// Function to check if a URL is a Branch.io link
export const isBranchLink = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'wzhu2.test-app.link' || urlObj.hostname === 'wzhu2.app.link';
  } catch {
    return false;
  }
};
