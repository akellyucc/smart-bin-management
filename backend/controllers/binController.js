

const { queryDB } = require('../config/db');  // Import the queryDB function from db.js

// Get all bins from the database
const getAllBins = async (req, res) => {
    try {
        const bins = await queryDB('SELECT * FROM bins');
        res.json(bins);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bins: ' + error.message });
    }
};


// Get a specific bin by ID
const getBinById = async (req, res) => {


    const { id } = req.params;
    try {
        const bin = await queryDB('SELECT * FROM bins WHERE bin_id = ?', [id]);
        if (bin.length === 0) {
            return res.status(404).json({ error: 'Bin not found' });
        }
        res.json(bin[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the bin: ' + error.message });
    }
};



const getTotalBinsMonitored = async (req, res) => {
    console.log('getTotalBinsMonitored called');
    try {
        const query = 'SELECT COUNT(*) AS total FROM waste_management.bins';
        const rows = await queryDB(query);

        console.log('Query result:', rows); // Log the result to see its structure

        if (rows.length === 0 || !rows[0].total) {
            return res.status(404).json({ message: 'No bins found' });
        }

        res.json({ total: rows[0].total });
    } catch (error) {
        console.error('Error fetching total bins monitored:', error);
        res.status(500).json({ message: 'Could not fetch total bins monitored: ' + error.message });
    }
};




// Create a new bin
const createBin = async (req, res) => {
    const { bin_id, community_id, latitude, longitude, status } = req.body;
    try {
        const query = 'INSERT INTO bins (bin_id, community_id, latitude, longitude, status) VALUES (?, ?, ?, ?, ?)';
        const result = await queryDB(query, [bin_id, community_id, latitude, longitude, status || 'empty']);
        res.status(201).json({ message: 'Bin created successfully', binId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create bin: ' + error.message });
    }
};

// Update an existing bin
const updateBin = async (req, res) => {
    const { id } = req.params;
    const { bin_id, community_id, latitude, longitude, status } = req.body;
    try {
        // Use the correct identifier for your bins table (bin_id or another)
        const query = 'UPDATE bins SET community_id = ?, latitude = ?, longitude = ?, status = ? WHERE bin_id = ?';
        await queryDB(query, [community_id, latitude, longitude, status, bin_id]);

        res.json({ message: 'Bin updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update bin: ' + error.message });
    }
};




// Delete a bin
const deleteBin = async (req, res) => {
    const { id } = req.params;
    try {
        await queryDB('DELETE FROM bins WHERE id = ?', [id]);
        res.json({ message: 'Bin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete bin: ' + error.message });
    }
};



module.exports = {
    getAllBins,
    getTotalBinsMonitored,
    getBinById,
    createBin,
    updateBin,
    deleteBin
};

