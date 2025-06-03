const API_BASE_URL = 'https://yalaa-production.up.railway.app';

export const getSharedFile = async (fileId) => {
  console.log('Starting API request for file:', fileId);
  
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    console.log('Sending request to:', `${API_BASE_URL}/auth/getSharedFile/${fileId}`);

    const response = await fetch(`${API_BASE_URL}/auth/getSharedFile/${fileId}`, requestOptions);

    console.log('Received response:', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    console.log('Raw response text:', result);

    // Try to parse the response as JSON
    let responseData;
    try {
      responseData = JSON.parse(result);
      console.log('Parsed response data:', responseData);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid response format');
    }

    if (!responseData || !responseData.file) {
      throw new Error('Invalid response: missing file data');
    }

    const { file } = responseData;

    // Transform and validate the response data
    const fileData = {
      id: file.id,
      name: file.name,
      type: file.type === 7 ? 'application/pdf' : 'application/octet-stream', // Type 7 seems to be PDF
      url: file.url,
      size: parseInt(file.size, 10),
      uploadDate: file.createdAt,
      description: responseData.message,
      sharedBy: file.sharedBy ? {
        username: file.sharedBy.username,
        email: file.sharedBy.email
      } : null
    };

    console.log('Transformed file data:', fileData);

    if (!fileData.url) {
      throw new Error('Invalid file data: missing URL');
    }

    return {
      success: true,
      data: fileData
    };
  } catch (error) {
    console.error('API request failed:', {
      message: error.message,
      stack: error.stack
    });

    let errorMessage = 'Failed to fetch file data';

    if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error - please check your internet connection';
    } else if (error.message.includes('404')) {
      errorMessage = 'File not found or expired';
    } else if (error.message.includes('500')) {
      errorMessage = 'Server error - please try again later';
    } else if (error.message.includes('Invalid response')) {
      errorMessage = 'Invalid response from server';
    } else {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};
