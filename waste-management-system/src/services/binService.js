const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Generic fetch function
const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// Fetch functions
const fetchBins = () => fetchData('/api/bins');

const fetchTotalFullBins = () =>
  fetchData('/api/bins/totalFullBins').then(data => data.total);

const fetchNearFullBins = () =>
  fetchData('/api/bins/totalNearFullBins').then(data => data.total);

const fetchNearFullBinsDetails = () =>
  fetchData('/api/bins/nearFullBinsDetails').then(data => data);

const fetchFullBinsDetails  = () =>
  fetchData('/api/bins/fullBinsDetails').then(data => data);

const fetchTotalBinsMonitored = () =>
  fetchData('/api/bins/totalBinsMonitored').then(data => data.total);


const fetchBinDetails = () => fetchData('/api/bin-details');

const fetchBinById = (binId) => fetchData(`/api/bins/${binId}`);

const fetchParishCoordinates = async (parishName) =>{
    console.log('parish to be selected frm bin service:', parishName);
    try{
    const response = await fetch(`${BASE_URL}/api/parish/${parishName}`);  // Make sure this URL is correct  /api/parish/:parishName
    console.log('parish name from bin services:', parishName);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log('parish cordinates:', data);
    return data;
  } catch (error) {
    console.error('Error fetching coordinates', error);
    return [];
  }
};

const fetchBinsByParish = async (binsByParish) => {
  try {
    const response = await fetch(`${BASE_URL}/api/bins/binsByParish/${binsByParish}`);  // Make sure this URL is correct
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log('bins by parish:', data);
    return data;
  } catch (error) {
    console.error('Error fetching bins:', error);
    return [];
  }
};

// fetch all bins
const fetchAllBins = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/bins/allBins`);  // Make sure this URL is correct
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log('fetch all bins:', data);
    return data;
  } catch (error) {
    console.error('Error fetching bins:', error);
    return [];
  }
};


//fetch report by parish
const fetchReportByParish = async (parish) => {
  try {
    const response = await fetch(`${BASE_URL}/api/report/${parish}`);  // Make sure this URL is correct
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log('report by parish:', data);
    return data;
  } catch (error) {
    console.error('Error fetching report details:', error);
    return [];
  }
};

const fetchReportDetails  = () =>
  fetchData('/api/report/report-details').then(data => data);



const fetchActiveRoutes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/active-routes`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`); // Throw an error for non-200 responses
    }
    const data = await response.json(); // Parse the JSON response
    console.log('Active routes data:', data);
    return data; // Return the parsed data
  } catch (error) {
    console.error('Error fetching active routes:', error);
    throw error; // Rethrow error for further handling
  }
};

const fetchActiveRoutesDetails = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/activeRoutesDetails`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`); // Throw an error for non-200 responses
    }
    const data = await response.json(); // Parse the JSON response
    console.log('Active routes details from bin services:', data);
    return data; // Return the parsed data
  } catch (error) {
    console.error('Error fetching active routes:', error);
    throw error; // Rethrow error for further handling
  }
};



 //fetchActiveRoutesDetails();
// Example usage
//fetchReportByParish ('kingston');

// Assign the functions to an object

const binService = {
  fetchBins,
  fetchTotalBinsMonitored,
  fetchBinById,
  fetchTotalFullBins,
  fetchNearFullBins,
  fetchNearFullBinsDetails,
  fetchFullBinsDetails,
  fetchBinDetails,
  fetchBinsByParish,
  fetchParishCoordinates,
  fetchActiveRoutes,
  fetchActiveRoutesDetails,
  fetchReportByParish,
  fetchReportDetails,
  fetchAllBins,
};

// Export the object
export default binService;
