import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import binService from '../services/binService';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 17.9751351,
  lng: -76.925278,
};

const Map = ({ selectedParish }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [bins, setBins] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);

  useEffect(() => {
    const fetchParishCoordinates = async () => {
      if (selectedParish) {
        try {
          const data = await binService.fetchParishCoordinates(selectedParish);
          if (data && data.latitude && data.longitude) {
            setCenter({
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude),
            });
          } else {
            console.error('No coordinates found for the selected parish:', selectedParish);
          }
        } catch (error) {
          console.error('Error fetching parish coordinates:', error);
        }
      } else {
        setCenter(defaultCenter); // Reset to default center if no parish is selected
      }
    };

    fetchParishCoordinates();
  }, [selectedParish]);

  useEffect(() => {
    const fetchBinsData = async () => {
      try {
        if (selectedParish) {
          const binsData = await binService.fetchBinsByParish(selectedParish);
          setBins(binsData);
        }
        else{
          const binsData = await binService.fetchAllBins();
          setBins(binsData);
        }
      } catch (error) {
        console.error('Error fetching bins data:', error);
      }
    };
    fetchBinsData();
  }, [selectedParish]);

  const getMarkerColor = (status) => {
    switch (status) {
      case 'full':
        return 'red';
      case 'near full':
        return 'yellow';
      case 'needs maintenance':
        return 'orange';
      case 'healthy':
      default:
        return 'green';
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAA7ISw3BdW-b2sn7ekDlIFtTgGq9eTq_I">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={selectedParish ? 14 : 13} // Zoom in if parish is selected
      >
        {bins.map(bin => (
          <Marker
            key={bin.bin_id}
            position={{
              lat: parseFloat(bin.latitude),
              lng: parseFloat(bin.longitude),
            }}
            icon={{
              url: `http://maps.google.com/mapfiles/ms/icons/${getMarkerColor(bin.status)}-dot.png`,
            }}
            onClick={() => setSelectedBin(bin)} // Set selected bin on marker click
          />
        ))}
        {selectedBin && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedBin.latitude),
              lng: parseFloat(selectedBin.longitude),
            }}
            onCloseClick={() => setSelectedBin(null)} // Clear selected bin on close
          >
            <div>
              <h2>Bin Details</h2>
              <p><strong>ID:</strong> {selectedBin.bin_id}</p>
              <p><strong>Status:</strong> {selectedBin.status}</p>
              <p><strong>Location:</strong> {selectedBin.latitude}, {selectedBin.longitude}</p>
              <p><strong>Last Emptied:</strong> {new Date(selectedBin.last_emptied).toLocaleString()}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
