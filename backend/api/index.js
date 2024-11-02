const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { initSocket, emitBinStatusUpdate } = require('../waste-management-system/src/components/SocketService'); // Adjust path as needed

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app); // Initialize the server first

// Initialize socket.io with the server
initSocket(server);

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your front-end's URL
}));

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Visa@198!', // Be careful with sensitive information
    database: process.env.DB_NAME || 'waste_management',
});

// Handle connection pool errors
pool.on('error', (err) => {
    console.error('Database connection pool error:', err);
});

// Function to execute queries
const queryDB = (query, values) => {
    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};


////////////////////////

// Fetch Report Data Endpoint
app.get('/api/report/:parishName', async (req, res) => {
    const parishName = req.params.parishName;

    // SQL Query to fetch waste collection data by month
    const eachMonthByTotal_SQL = `
        SELECT
            MONTH(wc.collection_date) AS collection_month,
            SUM(wc.amount) AS total_amount
        FROM
            waste_collection wc
        JOIN
            parish p ON wc.parish_id = p.parish_id
        WHERE
            p.parish_name = ?
        GROUP BY
            collection_month
        ORDER BY
            collection_month
    `;

    // Getting recyclables vs non-recyclables
    const recy_vrs_nonRecy_SQL = `
        SELECT
            b.bin_type,
            SUM(wc.amount) AS total_amount
        FROM
            bins b
        LEFT JOIN
            waste_collection wc ON wc.waste_type_id IN (
                SELECT waste_type_id FROM waste_types WHERE bin_id = b.bin_id
            )
        GROUP BY
            b.bin_type
    `;

    // SQL Query to fetch total waste by type
    const wasteTypeByTotal_SQL = `
        SELECT
            wt.waste_type_name AS name,
            SUM(wc.amount) AS value
        FROM
            parish p
        JOIN
            waste_collection wc ON p.parish_id = wc.parish_id
        JOIN
            waste_types wt ON wc.waste_type_id = wt.id
        WHERE
            p.parish_name = ?
        GROUP BY
            wt.waste_type_name
    `;

    try {
        // Fetching waste trends
        const monthResults = await queryDB(eachMonthByTotal_SQL, [parishName]);

        // Fetching recyclables vs non-recyclables
        const recyclables = await queryDB(recy_vrs_nonRecy_SQL);

        // Fetching waste by type
        const typeResults = await queryDB(wasteTypeByTotal_SQL, [parishName]);

        // Preparing waste trends
        const wasteTrends = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'long' }),
            amount: monthResults.find(r => r.collection_month === (i + 1))?.total_amount || 0
        }));

        // Preparing waste by type
        const wasteByType = typeResults.map(row => ({
            name: row.name,
            value: row.value || 0
        }));

        // Calculating total waste
        const totalWaste = monthResults.reduce((sum, row) => sum + (row.total_amount || 0), 0);

        // Prepare response data
        const responseData = {
            totalWaste,
            wasteByType,
            wasteTrends,
            recyclables
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({ error: 'Error fetching report data' });
    }
});


///////////////////////////

app.get('/api/report/report-details', async (req, res) => {
    try {
        // Queries for fetching different data
        const binDetailsQuery = 'SELECT bin_id, latitude, longitude, status FROM bins';
        const healthBreakdownQuery = `
            SELECT c.community_name, COUNT(b.bin_id) AS total,
                   SUM(CASE WHEN b.status = 'needs maintenance' THEN 1 ELSE 0 END) AS needsMaintenance
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            GROUP BY c.community_name;
        `;
        const fullBinsQuery = `
            SELECT c.community_name, b.bin_id, b.status
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            WHERE b.status = 'full';
        `;
        const historicalDataQuery = 'SELECT date,status, bin_id, COUNT(*) AS count_per_day FROM historical_data GROUP BY date';
        const locationBreakdownQuery = `
            SELECT c.community_name, COUNT(b.bin_id) AS bin_count_per_community
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            GROUP BY c.community_name;
        `;
        const activeRoutesQuery = 'SELECT * FROM active_routes WHERE status = "active"';

        // Fetch all data concurrently
        const [binDetails, healthBreakdown, fullBins, historicalData, locationBreakdown, activeRoutes] = await Promise.all([
            queryDB(binDetailsQuery),
            queryDB(healthBreakdownQuery),
            queryDB(fullBinsQuery),
            queryDB(historicalDataQuery),
            queryDB(locationBreakdownQuery),
            queryDB(activeRoutesQuery)
        ]);

        // Send the data back to the frontend
        res.json({
            binDetails,
            healthBreakdown,
            fullBins,
            historicalData,
            locationBreakdown,
            activeRoutes
        });
    } catch (error) {
        console.error('Error fetching bin details:', error);
        res.status(500).json({ error: 'Failed to fetch bin details' });
    }
});

///////////
app.get('/api/bin-details', async (req, res) => {
    try {
        // Queries for fetching different data
        const binDetailsQuery = 'SELECT bin_id, latitude, longitude, status FROM bins';
        const healthBreakdownQuery = `
            SELECT c.community_name, COUNT(b.bin_id) AS total,
                   SUM(CASE WHEN b.status = 'needs maintenance' THEN 1 ELSE 0 END) AS needsMaintenance
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            GROUP BY c.community_name;
        `;
        const fullBinsQuery = `
            SELECT c.community_name, b.bin_id, b.status
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            WHERE b.status = 'full';
        `;
        const historicalDataQuery = 'SELECT date,status, bin_id, COUNT(*) AS count_per_day FROM historical_data GROUP BY date';
        const locationBreakdownQuery = `
            SELECT c.community_name, COUNT(b.bin_id) AS bin_count_per_community
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            GROUP BY c.community_name;
        `;
        const activeRoutesQuery = 'SELECT * FROM active_routes WHERE status = "active"';

        // Fetch all data concurrently
        const [binDetails, healthBreakdown, fullBins, historicalData, locationBreakdown, activeRoutes] = await Promise.all([
            queryDB(binDetailsQuery),
            queryDB(healthBreakdownQuery),
            queryDB(fullBinsQuery),
            queryDB(historicalDataQuery),
            queryDB(locationBreakdownQuery),
            queryDB(activeRoutesQuery)
        ]);

        // Send the data back to the frontend
        res.json({
            binDetails,
            healthBreakdown,
            fullBins,
            historicalData,
            locationBreakdown,
            activeRoutes
        });
    } catch (error) {
        console.error('Error fetching bin details:', error);
        res.status(500).json({ error: 'Failed to fetch bin details' });
    }
});

// Route to update bin status
app.put('/api/bins/:bin_id', async (req, res) => {
    const binId = req.params.bin_id;
    const { status, longitude, latitude } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        const result = await queryDB('UPDATE bins SET status = ?, longitude = ?, latitude = ? WHERE bin_id = ?', [status, longitude, latitude, binId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Bin with ID ${binId} not found` });
        }

        // Emit the bin status update
        emitBinStatusUpdate({
            binId: binId,
            status: status,
            location: { lat: latitude, lng: longitude },
        });

        res.status(200).json({ message: `Bin ${binId} updated successfully`, result });
    } catch (error) {
        console.error('Database update error:', error);
        res.status(500).json({ error: 'Failed to update bin' });
    }
});

// Route to update bin status
app.put('/api/test/:bin_id', async (req, res) => {
    const binId = req.params.bin_id;
    const { status } = req.body;

    try {
        // Emit the bin status update
        emitBinStatusUpdate({
            binId: binId,
        // Replace with actual location if available
        });

    } catch (error) {
        console.error('eror emiting notification:', error);
        res.status(500).json({ error: 'Failed to update bin' });
    }

});
// Route to fetch all bins
app.get('/api/bins', async (req, res) => {
    try {
        const results = await queryDB('SELECT * FROM bins');
        res.json(results);
    } catch (error) {
        console.error('Error fetching bins:', error);
        res.status(500).json({ error: 'Failed to fetch bins' });
    }
});

// Route to get total bins monitored
app.get('/api/bins/totalBinsMonitored', async (req, res) => {
    try {
        const rows = await queryDB('SELECT COUNT(*) AS total FROM bins');
        res.json({ total: rows[0]?.total || 0 });
    } catch (error) {
        console.error('Error fetching total bins monitored:', error);
        res.status(500).json({ message: 'Could not fetch total bins monitored: ' + error.message });
    }
});

// Route to fetch total full bins
app.get('/api/bins/totalFullBins', async (req, res) => {
    try {
        const rows = await queryDB('SELECT COUNT(*) AS total FROM bins WHERE status = "full"');
        res.json({ total: rows[0]?.total || 0 });
    } catch (error) {
        console.error('Error fetching total full bins:', error);
        res.status(500).json({ message: 'Could not fetch total full bins: ' + error.message });
    }
});

// Route to fetch total near full bins
app.get('/api/bins/totalNearFullBins', async (req, res) => {
    try {
        const rows = await queryDB('SELECT COUNT(*) AS total FROM bins WHERE status = "near full"');
        res.json({ total: rows[0]?.total || 0 });
    } catch (error) {
        console.error('Error fetching total near full bins:', error);
        res.status(500).json({ message: 'Could not fetch total near full bins: ' + error.message });
    }
});

// Route to fetch near full bins details
app.get('/api/bins/nearFullBinsDetails', async (req, res) => {
    try {
        const nearFullQuery = 'SELECT  c.community_name, p.parish_name,c.community_id ,b.bin_id,b.status FROM community c   join bins b on  b.community_id = c.community_id  join parish p  WHERE status = "near full"';
            const [nearFullDetails] = await Promise.all([
                  queryDB(nearFullQuery),
            ]);
            res.json({ nearFullDetails,  });

    } catch (error) {
        console.error('Error fetching near full bins details:', error);
        res.status(500).json({ message: 'Could not fetch near full bins details: ' + error.message });
    }
});



// Route to fetch full bins details
app.get('/api/bins/fullBinsDetails', async (req, res) => {
    try {
           const fullBinDetailsQuery = 'SELECT  c.community_name, p.parish_name,c.community_id ,b.bin_id,b.status FROM community c   join bins b on  b.community_id = c.community_id  join parish p  WHERE status = "full"';
            // Fetch all data concurrently
            const [fullBinDetails] = await Promise.all([
                  queryDB(fullBinDetailsQuery),
            ]);
            // Send the data back to the frontend
            res.json({
               fullBinDetails,
            });
    } catch (error) {
        console.error('Error fetching active routes details:', error);
        res.status(500).json({ message: 'Could not fetch active routes details: ' + error.message });
    }
});
// Route to fetch bins by parish
app.get('/api/bins/binsByParish/:parish', async (req, res) => {
    const parish = req.params.parish;
    try {
        const rows = await queryDB('SELECT b.bin_id, b.latitude,b.last_emptied, b.longitude, b.status FROM bins b JOIN community c ON b.community_id = c.community_id JOIN parish p ON c.parish_id = p.parish_id WHERE p.parish_name   = ?', [parish]);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching bins by parish:', error);
        res.status(500).json({ message: 'Could not fetch bins by parish: ' + error.message });
    }
});
// Route to fetch all bins
app.get('/api/bins/allBins', async (req, res) => {
    try {
        const rows = await queryDB('SELECT b.bin_id, b.latitude,b.last_emptied, b.longitude, b.status FROM bins b  ');

        res.json(rows);
    } catch (error) {
        console.error('Error fetching all bins: ', error);
        res.status(500).json({ message: 'Could not fetch all bins : ' + error.message });
    }
});
// Route to fetch parish coordinates
app.get('/api/parish/:parishName', async (req, res) => {
    const parishName = req.params.parishName;
    try {
        const rows = await queryDB('SELECT latitude, longitude FROM parish WHERE parish_name = ?', [parishName]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Parish not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching parish coordinates:', error);
        res.status(500).json({ message: 'Could not fetch parish coordinates: ' + error.message });
    }
});

// Route to fetch active routes
app.get('/api/active-routes', async (req, res) => {
    try {
        const rows = await queryDB('SELECT * FROM active_routes WHERE status = "active"');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching active routes:', error);
        res.status(500).json({ message: 'Could not fetch active routes: ' + error.message });
    }
});
// Route to fetch e routes
app.get('/api/routes', async (req, res) => {
    try {
        const rows = await queryDB('SELECT * FROM routes');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching active routes:', error);
        res.status(500).json({ message: 'Could not fetch active routes: ' + error.message });
    }
});




// Route to fetch active route details
app.get('/api/activeRoutesDetails', async (req, res) => {
    try {
       const activeRoutesDetailsQuery = 'SELECT * FROM active_routes';
        // Fetch all data concurrently
        const [activeRoutsDetails] = await Promise.all([
              queryDB(activeRoutesDetailsQuery),
        ]);
        // Send the data back to the frontend
        res.json({
           activeRoutsDetails,
        });
    } catch (error) {
        console.error('Error fetching active routes details:', error);
        res.status(500).json({ message: 'Could not fetch active routes details: ' + error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
