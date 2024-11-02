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
app.use("/",(req,res)=>{
     res.send("Server is running.");
   });


// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
