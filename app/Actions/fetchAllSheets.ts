// fetchData.js
import axios from 'axios';

// Define the base URL for your API
const API_BASE_URL = 'http://localhost:3002/api'; // Adjust as necessary

// Fetch files from the API
export const fetchAllFiles = async () => {
  try {
    // Perform a GET request to fetch files
    const response = await axios.get(`${API_BASE_URL}/api/sheets`);
    // Return the data from the response
    console.log(response.data);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error fetching files:', error);
    throw new Error('Could not fetch files');
  }
};
