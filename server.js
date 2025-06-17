// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());

// Dummy translation function (English to Hindi simulation)
function translateToHindi(text) {
  return `हिंदी: ${text}`; // Replace this with real Google Translate API call if needed
}

// When a client connects
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a message is received from a client
  socket.on('send_message', (data) => {
    const translatedText = translateToHindi(data.message);

    const fullMessage = {
      sender: data.sender,
      original: data.message,
      translated: translatedText,
    };

    // Broadcast message to all clients
    io.emit('receive_message', fullMessage);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
