const path = require('path');
const fs = require("fs");
const https = require('https');
// const express = require("express");
const io = require('socket.io')();
const { v1: uuid } = require('uuid');
const mysql = require('mysql');
const port = process.env.PORT || 3002;

const log = console.log;

// https://www.selfsignedcertificate.com/
// if need local deployment, can generate a cert for the local ip and load them here
const httpsOption = {
  key:  fs.readFileSync('./server/cert/10.0.1.40.key').toString(),
  cert: fs.readFileSync('./server/cert/10.0.1.40.cert').toString()
}
// local deployment use

const httpsServer = https.createServer(httpsOption, (req, res) => {
  res.writeHead(200);
  if (req.url === '/') req.url = 'index.html';
  const filePath = __dirname + '/../buildv1/' + req.url;
  if (fs.existsSync(filePath)) {
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } else {
    res.end(fs.readFileSync(__dirname + '/../buildv1/index.html'));
  }
});
httpsServer.listen(port);

log(`server is now listening to port ${port}`);
/**
 * server status
 */
const gameStatus = {
  idle:      0,
  waiting:   1,
  selecting: 2,
  selected:  3,
  ready:     4,
  started:   5,
  result:    6,
  offline:   7, // should be not able to get this signal
}
const roomSettings = {
  playerCount:    5,
  waitingTimeout: 30,
  readyTimeout:   3,
  gameDuration:   60,
  resultTimeout:  30,
  endedTimeout:   5,
};
const roomStatus = {
  name: 'shake01',
  status: gameStatus.offline,
  players: []
};


/**
 * open a socketio server to do the shake shake game
 */
io.attach(httpsServer);

// using middleware
/*
// https://socket.io/docs/client-api/#With-query-parameters
const isValidRoom = (token) => {
  return true;
};
// middleware
io.use((socket, next) => {
  let token = socket.handshake.query.token;
  // socket.io.opts.query
  if (isValidRoom(token)) {
    return next();
  }
  return next(new Error('authentication error'));
});
*/
// end of using middleware

let hostsList = [];
let clientsList = [];
let gameResult = [];

let waitingTimeout = null;
let readyTimeout = null;
let startedTimeout = null;
let playingTimeout = null;
let resultTimeout = null;
const clearAllTimeout = () => {
  clearTimeout(waitingTimeout);
  waitingTimeout = null;
  clearTimeout(readyTimeout);
  readyTimeout = null;
  clearTimeout(startedTimeout);
  startedTimeout = null;
  clearTimeout(playingTimeout);
  playingTimeout = null;
  clearTimeout(resultTimeout);
  resultTimeout = null;
}
const updateGameStage = (newStage) => {
  if (roomStatus['status'] === newStage) {
    return;
  }
  roomStatus['status'] = newStage;
  io.emit('gameStage', roomStatus['status']);
  switch (newStage) {
    case gameStatus['idle']:
      // ?
      clearAllTimeout();
      // io.emit('gameStage', roomStatus['status']);
      roomStatus['players'] = [];
      gameResult = [];
      for (let i = 0; i < roomSettings.playerCount; i++) {
        ((i) => {
          roomStatus['players'].push({
            joined: false,
            playerId: `player_${i + 1}`, // uuid(),
            socketId: null
          });
          gameResult.push(0);
        })(i)
      }
      io.emit('playersInfo', roomStatus['players']);
      break;
    case gameStatus['waiting']:
      log(`count down to start`);
      clearAllTimeout();
      // io.emit('gameStage', roomStatus['status']);
      waitingTimeout = setTimeout(() => {
        updateGameStage(gameStatus['ready']);
        waitingTimeout = null;
      }, roomSettings['waitingTimeout'] * 1000);
      break;
    case gameStatus['ready']:
      log(`ready`);
      // io.emit('gameStage', roomStatus['status']);
      readyTimeout = setTimeout(() => {
        updateGameStage(gameStatus['started']);
        readyTimeout = null;
      }, roomSettings['readyTimeout'] * 1000);
      break;
    case gameStatus['started']:
      log(`go`);
      // io.emit('gameStage', roomStatus['status']);
      clearAllTimeout();
      playingTimeout = setTimeout(() => {
        updateGameStage(gameStatus['result']);
        playingTimeout = null;
      }, roomSettings['gameDuration'] * 1000);
      break;
    case gameStatus['result']:
      log(`result`);
      // io.emit('gameStage', roomStatus['status']);
      roomStatus['players'].forEach((playerStatus, idx) => {
        if (playerStatus['socketId'] != null) {
          io.to(`${playerStatus['socketId']}`).emit('gameResult', gameResult[idx]);
        }
      })
      clearAllTimeout();
      resultTimeout = setTimeout(() => {
        updateGameStage(gameStatus['idle']);
        resultTimeout = null;
      }, roomSettings['resultTimeout'] * 1000);
      // save to db here
      // 
      //

      break;
    case gameStatus['offline']:
      break;
  }
}
io.on('connection', socket => {
  log(`socket connection - ${socket.id}`);
  clientsList.push(socket);
  socket.on('createRoom', (options, ack) => {
    log(`socket createRoom - ${socket.id}`);
    log(`socket createRoom params - ${options.roomId}`);
    if (options.roomId !== roomStatus['name']) {
      roomStatus['name'] = uuid().split('-')[0];
      log(`new room created - ${roomStatus['name']}`);
      if (typeof(ack) === "function") {
        ack(roomStatus['name']);
      }
      // socket.disconnect();
    }
    // } else {
      log(`socket accept - ${socket.id}`);
      hostsList.push(socket.id);
      socket.emit('roomCreated', roomStatus['name']);
      if (roomStatus['status'] === gameStatus.offline) {
        // initial the room
        updateGameStage(gameStatus['idle']);
      } else {
        // another host connected, maybe debug panel?
        socket.emit('gameStage', roomStatus['status']);
        socket.emit('playersInfo', roomStatus['players']);
      }
    // }
    
    // roomSettings.playerCount
    // uuid()
  });
  socket.on('joinRoom', options => {
    log(`socket joinRoom - ${socket.id}`);
    const playerIdx = roomStatus['players'].findIndex((player) => (player['joined'] === false && player['playerId'] === options['playerId']));
    if (playerIdx >= 0) {
      roomStatus['players'][playerIdx]['joined'] = true;
      roomStatus['players'][playerIdx]['socketId'] = socket.id;
      io.emit('playersInfo', roomStatus['players']);
      updateGameStage(gameStatus['waiting']);
    }
  });
  socket.on('shake', () => {
    if (roomStatus['status'] === gameStatus['started']) {
      const shakeArray = new Array(roomSettings['playerCount']).fill(0);
      const playerIdx = roomStatus['players'].findIndex((player) => (player.socketId === socket.id));
      if (playerIdx >= 0) {
        shakeArray[playerIdx] = 1;
        gameResult[playerIdx] += 1;
      }
      io.emit('playersShake', shakeArray);
    }
  })
  socket.on('debug', (data) => {
    switch (data['type']) {
      case 'gameStage':
        roomStatus['status'] = data['data'];
        const newStage = parseInt(roomStatus['status']);
        updateGameStage(newStage);
        break;
      case 'joinGame': {
        const playerIdx = roomStatus['players'].findIndex((player) => (player.playerId === data['data']['playerId']));
        if (playerIdx >= 0) {
          roomStatus['players'][playerIdx]['joined'] = true;
          roomStatus['players'][playerIdx]['socketId'] = socket.id;
          updateGameStage(gameStatus['waiting']);
          io.emit('playersInfo', roomStatus['players']);
        }
        break;
      }
      case 'shake': {
        if (roomStatus['status'] === gameStatus['started']) {
          const playerIdx = roomStatus['players'].findIndex((player) => (player.playerId === data['data']['playerId']));
          if (playerIdx >= 0) {
            const shakeArray = new Array(roomSettings['playerCount']).fill(0);
            shakeArray[playerIdx] = 1;
            gameResult[playerIdx] += 1;
            io.emit('playersShake', shakeArray);
          }
        }
        break;
      }
    }
  })
  socket.on('disconnect', () => {
    log(`socket disconnect - ${socket.id}`);
    const clientIndex = clientsList.findIndex(client => client === socket);
    if (clientIndex >= 0) {
      clientsList.splice(clientIndex, 1);
    }
    // const playerIdx = roomStatus['players'].findIndex((player) => (player.socketId === socket.id));
    roomStatus['players'].forEach((player, playerIdx) => {
      if (player.socketId === socket.id) {
        roomStatus['players'][playerIdx]['joined'] = false;
        roomStatus['players'][playerIdx]['playerId'] = `player_${playerIdx + 1}`; // uuid();
        roomStatus['players'][playerIdx]['socketId'] = null;
      }
    });
    io.emit('playersInfo', roomStatus['players']);
    const playerRemain = roomStatus['players'].reduce((accumulate, current) => accumulate + (current['joined']? 1: 0), 0);
    if (playerRemain === 0) {
      updateGameStage(gameStatus['idle']);
    }
    const hostIndex = hostsList.findIndex(host => host === socket.id);
    if (hostIndex >= 0) {
      hostsList.splice(hostIndex, 1);
    }
    if (hostsList.length === 0) {
      log('all host disconnected');
      roomStatus['status'] = gameStatus.offline;
    }
  });
});