// Получаем доступ к камере и микрофону
async function getLocalMedia() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        const localVideo = document.getElementById('local-video');
        localVideo.srcObject = stream;
        localStream = stream; // Сохраняем поток для передачи
        startPeer(); // Запускаем PeerJS
    } catch (error) {
        console.error('Ошибка получения медиа:', error);
        alert('Не удается получить доступ к камере или микрофону.');
    }
}

// Создаём объект Peer
let peer;
let localStream;

function startPeer() {
    peer = new Peer(); // Создаем объект Peer
    peer.on('open', id => {
        console.log('My peer ID is: ' + id);
        const socket = io(); // Подключаемся к серверу через Socket.io
        socket.emit('join', id); // Отправляем ID на сервер
    });

    peer.on('call', (call) => {
        call.answer(localStream); // Отвечаем на звонок
        call.on('stream', remoteStream => {
            const remoteVideo = document.getElementById('remote-video');
            remoteVideo.srcObject = remoteStream; // Отображаем поток собеседника
        });
    });
}

// Функция для звонка другому пользователю
function callOtherUser(peerId) {
    const call = peer.call(peerId, localStream);
    call.on('stream', remoteStream => {
        const remoteVideo = document.getElementById('remote-video');
        remoteVideo.srcObject = remoteStream;
    });
}

// Инициализация
getLocalMedia();
