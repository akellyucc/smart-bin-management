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

// Fetch Report Data Endpoint
app.get('/api/report/:parishName', async (req, res) => {
    const parishName = req.params.parishName;

    // SQL Queries
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
        // Fetching data
        const monthResults = await queryDB(eachMonthByTotal_SQL, [parishName]);
        const recyclables = await queryDB(recy_vrs_nonRecy_SQL);
        const typeResults = await queryDB(wasteTypeByTotal_SQL, [parishName]);

        // Prepare response data
        const wasteTrends = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'long' }),
            amount: monthResults.find(r => r.collection_month === (i + 1))?.total_amount || 0
        }));

        const wasteByType = typeResults.map(row => ({
            name: row.name,
            value: row.value || 0
        }));

        const totalWaste = monthResults.reduce((sum, row) => sum + (row.total_amount || 0), 0);

        res.json({
            totalWaste,
            wasteByType,
            wasteTrends,
            recyclables
        });
    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({ error: 'Error fetching report data' });
    }
});

// More endpoints...

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
