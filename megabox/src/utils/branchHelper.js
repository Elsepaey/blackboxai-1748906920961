// Function to create a Branch deep link for file sharing
export const createBranchLink = async (fileId, fileName) => {
  return new Promise((resolve, reject) => {
    if (typeof window.branch === 'undefined') {
      console.error('Branch SDK not found. Retrying initialization...');
      initBranch().then(() => {
        createBranchLink(fileId, fileName).then(resolve).catch(reject);
      }).catch(reject);
      return;
    }

    const linkData = {
      '$desktop_url': `${window.location.origin}/preview/${fileId}`,
      '$ios_url': 'https://apps.apple.com/sg/app/terabox-1tb-cloud-ai-space/id1509453185?mt=8',
      '$android_url': 'https://play.google.com/store/apps/details?id=com.dubox.drive',
      '$og_title': 'MegaBox Shared File',
      '$og_description': `Check out this shared file: ${fileName}`,
      '$og_image_url': 'https://example.com/megabox-logo.png',
      'file_id': fileId,
      'file_name': fileName,
      'shared_by': 'web_app',
      'channel': 'web_share'
    };

    const linkProperties = {
      channel: 'web_share',
      feature: 'file_sharing',
      campaign: 'user_sharing',
      stage: 'new_share',
      tags: ['file_share']
    };

    try {
      window.branch.link({
        data: linkData,
        properties: linkProperties
      }, (err, link) => {
        if (err) {
          console.error('Error creating Branch link:', err);
          reject(err);
          return;
        }

        console.log('Branch link created:', link);
        resolve(link);
      });
    } catch (error) {
      console.error('Error calling Branch link API:', error);
      reject(error);
    }
  });
};

// Function to handle opening a Branch deep link
export const handleBranchDeepLink = (data) => {
  if (!data) return null;

  console.log('Processing deep link data:', data);

  // Check if this is a Branch link click
  if (data['+clicked_branch_link']) {
    const fileId = data['file_id'];
    const fileName = data['file_name'];
    const sharedBy = data['shared_by'];

    console.log('Deep link detected:', { fileId, fileName, sharedBy });

    return {
      fileId,
      fileName,
      sharedBy,
      channel: data['~channel'],
      campaign: data['~campaign']
    };
  }

  return null;
};

// Function to track Branch events
export const trackBranchEvent = (eventName, metadata = {}) => {
  if (typeof window.branch === 'undefined') {
    console.error('Branch SDK not initialized for event tracking');
    return;
  }

  try {
    window.branch.logEvent(
      eventName,
      metadata,
      (err) => {
        if (err) {
          console.error('Error tracking Branch event:', err);
        } else {
          console.log('Branch event tracked:', eventName, metadata);
        }
      }
    );
  } catch (error) {
    console.error('Error calling Branch logEvent:', error);
  }
};

// Function to initialize Branch SDK with deep link handling
export const initBranch = (onDeepLinkHandler) => {
  return new Promise((resolve, reject) => {
    const initializeBranch = () => {
      if (typeof window.branch === 'undefined') {
        console.error('Branch SDK not loaded, waiting...');
        setTimeout(initializeBranch, 1000); // Retry after 1 second
        return;
      }

      try {
        window.branch.init('key_test_asCmg1x2BDyHh3GHNcEzofihqvepEG95', 
          (err, data) => {
            if (err) {
              console.error('Branch SDK initialization error:', err);
              reject(err);
              return;
            }

            console.log('Branch SDK initialized successfully:', data);

            // Handle deep link data if present
            if (data['+clicked_branch_link']) {
              console.log('Deep link detected during initialization');
              const deepLinkData = handleBranchDeepLink(data);
              if (deepLinkData && onDeepLinkHandler) {
                onDeepLinkHandler(deepLinkData);
              }
            }

            resolve(data);
          }
        );
      } catch (error) {
        console.error('Error during Branch initialization:', error);
        reject(error);
      }
    };

    initializeBranch();
  });
};

// Export a function to check Branch SDK status
export const isBranchInitialized = () => {
  return typeof window.branch !== 'undefined';
};
