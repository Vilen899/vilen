const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Отдаем статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    socket.on('join', (peerId) => {
        console.log('User joined with peer ID: ' + peerId);
        socket.broadcast.emit('user-connected', peerId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Используем порт из переменной окружения или 3000
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
