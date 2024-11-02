const { Server } = require('socket.io');

let io; // Declare io variable

// Function to initialize Socket.IO
const initSocket = (server) => {
    io = new Server(server); // Initialize the Socket.IO server

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });

        // You can handle other events here, e.g.:
        // socket.on('someEvent', (data) => {
        //     console.log('Received data:', data);
        // });
    });
};

// Function to emit bin status updates
const emitBinStatusUpdate = (binData) => {
    if (io) {
        io.emit('binStatusUpdate', binData); // Emit the bin status update to all connected clients
        console.log('Emitted bin status update:', binData);
    } else {
        console.error('Socket.IO is not initialized');
    }
};

module.exports = {
    initSocket,
    emitBinStatusUpdate,
};
