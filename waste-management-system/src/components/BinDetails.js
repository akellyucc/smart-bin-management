import React from 'react';
import '../styles/BinsDetails.css';

const BinDetails = ({ data }) => {
  console.log('test active data',data);
  if (!data) {
    return <p>No data available.</p>;
  }

  console.log('Bin Details Data:', data); // Log the incoming data

  return (
    <div className="bin-details">
      {/* Bin Details Section */}
      {data.binDetails && data.binDetails.length > 0 && (
        <section>
          <h3>Bin Details</h3>
          <table>
            <thead>
              <tr>
                <th>Bin ID</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.binDetails.map((bin, index) => (
                <tr key={index}>
                  <td>{bin.bin_id || 'N/A'}</td>
                  <td>Latitude: {bin.latitude}, Longitude: {bin.longitude}</td>
                  <td>{bin.status || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Health Breakdown Section */}
      {data.healthBreakdown && data.healthBreakdown.length > 0 && (
        <section>
          <h3>Health Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Community</th>
                <th>Total Bins</th>
                <th>Needs Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {data.healthBreakdown.map((item, index) => (
                <tr key={index}>
                  <td>{item.community_name || 'N/A'}</td>
                  <td>{item.total || 'N/A'}</td>
                  <td>{item.needsMaintenance || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}


    {/* Active Routes Section */}
    {data.activeRoutes && data.activeRoutes.length > 0 && (
      <section>
        <h3>Active Routes</h3>
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Location</th>
              <th>Status</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {data.activeRoutes.map((route, index) => (
              <tr key={index}>
                <td>{route.id|| 'N/A'}</td>
                <td>{route.location || 'N/A'}</td>
                <td>{route.status || 'N/A'}</td>
                <td>{route.start_time ? new Date(route.start_time).toLocaleString() : 'N/A'}</td>
                <td>{route.end_time ? new Date(route.end_time).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    )}

      {/* Health Breakdown Section */}
      {data.fullBins && data.fullBins.length > 0 && (
        <section>
          <h3>Full Bins Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Community</th>
                <th>Bin ID</th>
                <th>Bin Status</th>
              </tr>
            </thead>
            <tbody>
              {data.fullBins.map((item, index) => (
                <tr key={index}>
                  <td>{item.community_name || 'N/A'}</td>
                  <td>{item.bin_id || 'N/A'}</td>
                  <td>{item.status || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Historical Data Section */}
      {data.historicalData && data.historicalData.length > 0 && (
        <section>
          <h3>Historical Data</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Count Per Day</th>
              </tr>
            </thead>
            <tbody>
              {data.historicalData.map((entry, index) => (
                <tr key={index}>
                  <td>{new Date(entry.date).toLocaleDateString() || 'N/A'}</td>
                  <td>{entry.count_per_day  || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Location Breakdown Section */}
      {data.locationBreakdown && data.locationBreakdown.length > 0 && (
        <section>
          <h3>Location Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Community</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {data.locationBreakdown.map((item, index) => (
                <tr key={index}>
                  <td>{item.community_name || 'N/A'}</td>
                  <td>{item.bin_count_per_community || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

           {/* Active Routes Section */}
      {data.activeRoutsDetails && data.activeRoutsDetails.length > 0 && (
        <section>
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Location</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {data.activeRoutsDetails.map((route) => (
                <tr key={route.id}>
                  <td>{route.route || 'N/A'}</td>
                  <td>{route.location || 'N/A'}</td>
                  <td>{route.status || 'N/A'}</td>
                  <td>{route.start_time ? new Date(route.start_time).toLocaleString() : 'N/A'}</td>
                  <td>{route.end_time ? new Date(route.end_time).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Full Bins Section */}
      {data.fullBinDetails && data.fullBinDetails.length > 0 && (
        <section>
          <table>
            <thead>
              <tr>
                <th>Bin ID</th>
                <th>Community Name</th>
                <th>Parish</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.fullBinDetails.map((bin) => (
                <tr key={bin.bin_id}>
                  <td>{bin.bin_id || 'N/A'}</td>
                  <td>{bin.community_name || 'N/A'}</td>
                  <td> {bin.parish_name}</td>

                  <td>{bin.status || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Near Full Bins Section */}
      {data.nearFullDetails && data.nearFullDetails.length > 0 && (
        <section>

          <table>
            <thead>
              <tr>
                <th>Bin ID</th>
                <th>Community Name</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.nearFullDetails.map((bin) => (
                <tr key={bin.bin_id}>
                  <td>{bin.bin_id || 'N/A'}</td>
                  <td>{bin.community_name || 'N/A'}</td>
                  <td> {bin.parish_name}</td>
                  <td>{bin.status || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}



      {/* Additional Sections (Full Bins, Historical Data, etc.) */}
      {/* Include other sections as needed */}
    </div>
  );
};

export default BinDetails;
