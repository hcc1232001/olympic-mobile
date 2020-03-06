
const { v1: uuid } = require('uuid');
const mysql = require('mysql');
const dbConfig = require('../config/dbConfig.js');
// const roomConfigs = require('../config/roomConfigs.js');
const log = console.log;

const gameStatus = {
  idle:      0,
  waiting:   1,
  selecting: 2,
  selected:  3,
  ready:     4,
  started:   5,
  result:    6,
  offline:   7, // should be not able to get this signal
};
const stageTimer = {
  [gameStatus.idle]:      -1,
  [gameStatus.waiting]:   20,
  [gameStatus.selecting]: 10,
  [gameStatus.selected]:  5,
  [gameStatus.ready]:     5,
  [gameStatus.started]:   30,
  [gameStatus.result]:    10,
  [gameStatus.offline]:   -1,
  // waitingTimeout: 30,
  // readyTimeout:   3,
  // gameDuration:   60,
  // resultTimeout:  30,
  // endedTimeout:   5,
};
class Room {
  constructor({roomId, roomManager, playersCount, hostCount}) {
    this.roomStatus = gameStatus.offline;
    this.roomManager = roomManager;
    this.socketio = roomManager.socketio;
    this.playersCount = playersCount;
    this.hostCount = hostCount;
    this.roomId = roomId || uuid().split('-')[0];
    this.gameId = 1;
    this.players = [];
    this.hosts = [];
    this.shakeArray = [];
    this.gameChoices = [];
    this.stageTimer = null;
    this.distanceMultiplier = 3;
    this.roomManager.addRoom(this.roomId, this);
    // this.roomManager.addHost();
    this.initialRoom();
  }

  emit(eventName, data) {
    this.socketio.to(this.roomId).emit(eventName, data);
  }

  // initDb() {
  //   this.db = mysql.createConnection(dbConfig);
  // }
  initialRoom() {
    this.generateAllPlayersId();
    this.updateGameStage(gameStatus.idle);
  }

  updateGameStage(newStage) {
    if (newStage === this.roomStatus) {
      this.emit('playersInfo', this.playersStatus);
      this.emit('gameStage', this.roomStatus);
      return;
    }
    const prevStage = this.roomStatus;
    this.roomStatus = newStage;
    switch (newStage) {
      case gameStatus['idle']:
        log(`game idle`);
        this.clearAllTimeout();
        if (prevStage !== gameStatus['waiting']) {
          this.generateAllPlayersId();
          this.gameChoices = new Array(this.playersCount).fill(0);
        }
        this.emit('playersInfo', this.playersStatus);
        break;
      case gameStatus['waiting']:
        log(`game waiting`);
        this.clearAllTimeout();
        this.emit('playersInfo', this.playersStatus);
        if (stageTimer[newStage] > 0) {
          this.stageTimer = setTimeout(() => {
            this.updateGameStage(gameStatus['selecting']);
          }, stageTimer[newStage] * 1000);
        }
        break;
      case gameStatus['selecting']:
        log(`game selecting`);
        this.clearAllTimeout();
        if (stageTimer[newStage] > 0) {
          this.stageTimer = setTimeout(() => {
            this.updateGameStage(gameStatus['selected']);
          }, stageTimer[newStage] * 1000);
        }
        break;
      case gameStatus['selected']:
        log(`game selected`);
        // emit game selected
        this.clearAllTimeout();
        // random the game base on users choices
        const gameIdxToRand = [];
        this.players.forEach((player, idx) => {
          if (player.joined) {
            gameIdxToRand.push(this.gameChoices[idx]);
          }
        });
        const finalGameIdx = Math.round(Math.random() * gameIdxToRand.length);
        this.gameId = gameIdxToRand[finalGameIdx];
        this.emit('gameSelected', this.gameId);
        if (stageTimer[newStage] > 0) {
          this.stageTimer = setTimeout(() => {
            this.updateGameStage(gameStatus['ready']);
          }, stageTimer[newStage] * 1000);
        }
        break;
      case gameStatus['ready']:
        log(`game ready`);
        this.clearAllTimeout();
        if (stageTimer[newStage] > 0) {
          this.stageTimer = setTimeout(() => {
            this.updateGameStage(gameStatus['started']);
          }, stageTimer[newStage] * 1000);
        }
        break;
      case gameStatus['started']:
        log(`game started`);
        this.clearAllTimeout();
        if (stageTimer[newStage] > 0) {
          this.stageTimer = setTimeout(() => {
            this.updateGameStage(gameStatus['result']);
          }, stageTimer[newStage] * 1000);
        }
        break;
      case gameStatus['result']:
        log(`game result`);
        // emit game result
        this.players.forEach((player, idx) => {
          if (player['joined']) {
            player['socket'].emit('gameResult', this.shakeArray[idx] * this.distanceMultiplier);
          }
        })
        this.clearAllTimeout();
        if (stageTimer[newStage] > 0) {
          this.stageTimer = setTimeout(() => {
            this.updateGameStage(gameStatus['idle']);
          }, stageTimer[newStage] * 1000);
        }
        // save to db here
        // this.saveGameResult();
        break;
      case gameStatus['offline']:
        break;
    }
    setImmediate(() => this.emit('gameStage', this.roomStatus));
  }
  clearAllTimeout() {
    clearTimeout(this.stageTimer);
    this.stageTimer = null;
  }
  generateAllPlayersId() {
    // remove old players if have
    this.players.forEach(oldPlayer => {
      if (oldPlayer) {
        this.roomManager.removePlayer(oldPlayer.playerId);
      }
    });
    // empty the players array
    this.players.length = 0;
    this.shakeArray.length = 0;
    // create new player slots
    for (let i = 0; i < this.playersCount; i++) {
      const newPlayer = {
        playerId: uuid(),
        joined: false,
        socket: null
      };
      this.players.push(newPlayer);
      this.shakeArray.push(false);
      this.roomManager.addPlayer(newPlayer.playerId, this);
    }
  }

  generatePlayer(idx) {
    this.kickPlayer(idx);
    this.players[idx] = {
      playerId: uuid(),
      joined: false,
      socket: null
    };
    this.shakeArray[idx] = false;
    this.roomManager.addPlayer(this.players[idx].playerId, this);
    this.emit('playersInfo', this.playersStatus);
    const connectedPlayersCount = this.players.reduce((prev, curr) => {
      return prev + ~~curr['joined'];
    }, 0);
    if (connectedPlayersCount === 0) {
      this.updateGameStage(gameStatus.idle);
    }
  }
  // kick the player in specifice idx
  kickPlayer(idx) {
    const oldPlayer = this.players[idx];
    if (oldPlayer) {
      // if (oldPlayer['socket'] && oldPlayer['socket'].connected) {
      //   oldPlayer['socket'].disconnect();
      // }
      this.players[idx] = null;
      this.shakeArray[idx] = false;
      this.roomManager.removePlayer(oldPlayer.playerId);
    }
  }

  addHost(hostSocket, ack) {
    this.hosts.push(hostSocket);
    hostSocket.join(this.roomId);
    log(`host join - ${this.roomId}`);
    this.bindSocketEventForHost(hostSocket);
    if (typeof(ack) === "function") {
      ack(this.roomId);
    }
    hostSocket.emit('playersInfo', this.playersStatus);
    hostSocket.emit('gameStage', this.roomStatus);
  }

  addDebug(debugSocket, ack) {
    debugSocket.join(this.roomId);
    log(`debug join - ${this.roomId}`);
    this.bindSocketEventForDebug(debugSocket);
    if (typeof(ack) === "function") {
      ack(this.roomId);
    }
    debugSocket.emit('playersInfo', this.playersStatus);
    debugSocket.emit('gameStage', this.roomStatus);
  }

  addPlayer(playerId, playerSocket, ack) {
    if (this.roomStatus === gameStatus.idle || this.roomStatus === gameStatus.waiting) {
      const playerJoiningIndex = this.players.findIndex(player => player.playerId === playerId);
      if (playerJoiningIndex !== -1) {
        const playerJoining = this.players[playerJoiningIndex];
        if (playerJoining['joined'] === false) {
          playerJoining['socket'] = playerSocket;
          playerJoining['joined'] = true;
          this.shakeArray[playerJoiningIndex] = 0;
          this.bindSocketEventForPlayer(playerJoiningIndex);
          playerSocket.join(this.roomId);
          log(`player joined - ${this.roomId}: ${playerJoiningIndex}`);
          if (typeof(ack) === "function") {
            ack("joined");
          }
          // this.emit('playersInfo', this.players);
          setImmediate(()=>this.updateGameStage(gameStatus.waiting));
        } else {
          if (typeof(ack) === "function") {
            ack("failed, occupied");
          }
        }
      } else {
        if (typeof(ack) === "function") {
          ack("failed, playerId not found (???)");
        }
      }
    } else {
      if (typeof(ack) === "function") {
        ack("failed, game started");
      }
    }
  }

  saveGameResult() {
    const dbConnection = mysql.createConnection(dbConfig);
    dbConnection.connect();
    const distanceShaked = this.shakeArray.reduce((prev, curr) => prev + curr, 0) * this.distanceMultiplier;
    const playerJoined = this.players.reduce((prev, curr) => prev + ~~curr.joined, 0);
    const gameData  = { 
      playerdata: JSON.stringify(this.shakeArray),
      gametype: this.gameId,
      distance: distanceShaked,
      createdate: new Date()
    };
    const gameRecordSave = new Promise((resolve, reject) => {
      dbConnection.query('INSERT INTO gamerecord SET ?', gameData, function (error, results, fields) {
        if (error) throw error;
        resolve(true);
        // Neat!
      });
    });

    // https://en.wikipedia.org/wiki/Merge_(SQL)#upsert
    const totalDistanceUpdate = new Promise((resolve, reject) => {
      dbConnection.query(
        'UPDATE summary SET value = ? WHERE name = ?', [ { toSqlString: () => { return `value + ${distanceShaked}`; } }, 'total_distance'], 
        (error, results, fields) => {
          if (error) throw error;
          if (results.affectedRows === 0) {
            dbConnection.query(
              'INSERT INTO summary SET ?', {name: 'total_distance', value: distanceShaked}, 
              (error, results, fields) => {
                if (error) throw error;
                resolve(true);
              }
            )
          } else {
            resolve(true);
          }
        }
      );
    })

    const totalVisitUpdate = new Promise((resolve, reject) => {
      dbConnection.query(
        'UPDATE summary SET value = ? WHERE name = ?', [ { toSqlString: () => { return `value + ${playerJoined}`; } }, 'total_visit'], 
        (error, results, fields) => {
          if (error) throw error;
          if (results.affectedRows === 0) {
            dbConnection.query(
              'INSERT INTO summary SET ?', {name: 'total_visit', value: playerJoined}, 
              (error, results, fields) => {
                if (error) throw error;
                resolve(true);
              }
            )
          } else {
            resolve(true);
          }
        }
      );
    })

    Promise.all([gameRecordSave, totalDistanceUpdate, totalVisitUpdate]).then(() => {
      // console.log(values);
      dbConnection.end();
    });
    // connection.end();
  }
  bindSocketEventForHost(socket) {
    // nothing to do if the timer handled in server

    // change stage if the timer handled by frontend
    socket.on('changeStage', (newStage) => {
      if (stageTimer[newStage] !== undefined) {
        this.updateGameStage(newStage);
      }
    });
  }

  bindSocketEventForPlayer(playerIdx) {
    const socket = this.players[playerIdx]['socket'];
    socket.on('disconnect', () => {
      this.generatePlayer(playerIdx);
    });
    socket.on('shake', () => {
      if (this.roomStatus === gameStatus.started) {
        this.shakeArray[playerIdx] += 1;
        const shakeMessage = new Array(this.playersCount).fill(0);
        shakeMessage[playerIdx] = 1
        this.emit('playersShake', shakeMessage);
      }
    });
    socket.on('selectGame', (gameId, ack) => {
      if (this.roomStatus === gameStatus.selecting) {
        this.gameChoices[playerIdx] = gameId;
        this.emit('gameChoices', this.gameChoices);
        ack(gameId);
      }
    });
  }

  bindSocketEventForDebug(socket) {
    socket.on('debug', (data) => {
      switch (data['type']) {
        case 'gameStage':
          const newStage = parseInt(data['data']);
          if (stageTimer[newStage] !== undefined) {
            this.updateGameStage(newStage);
          }
          break;
        case 'joinGame': {
          const playerIdx = this.players.findIndex((player) => (player.playerId === data['data']['playerId']));
          if (playerIdx >= 0) {
            this.players[playerIdx]['joined'] = true;
            this.players[playerIdx]['socket'] = socket;
            this.updateGameStage(gameStatus['waiting']);
            // this.emit('playersInfo', this.players);
          }
          break;
        }
        case 'kickPlayer': {
          const playerIdx = this.players.findIndex((player) => (player.playerId === data['data']['playerId']));
          if (playerIdx >= 0) {
            this.generatePlayer(playerIdx);
          }
          break;
        }
        case 'selectGame': {
          if (this.roomStatus === gameStatus.selecting) {
            data['data']['selectedArray'].forEach((newChoice, idx) => {
              if (newChoice !== this.gameChoices[idx]) {
                this.gameChoices[idx] = newChoice;
                if (this.players[idx]['socket']) {
                  this.players[idx]['socket'].emit('gameChoice', newChoice);
                }
              }
            })
            // this.gameChoices = data['data']['selectedArray'];
            this.emit('gameChoices', this.gameChoices);
          }
          break;
        }
        case 'shake': {
          if (this.roomStatus === gameStatus.started) {
            const playerIdx = this.players.findIndex((player) => (player.playerId === data['data']['playerId']));
            this.shakeArray[playerIdx] += 1;
            const shakeMessage = new Array(this.playersCount).fill(0);
            shakeMessage[playerIdx] = 1
            this.emit('playersShake', shakeMessage);
          }
          break;
        }
      }
    })
  }
  // unbindSocketEventForPlayer(playerIdx) {
  //   const socket = this.players[playerIdx]['socket'];
  //   socket.removeAllListeners()
  // }
  get name() {
    return this.roomId;
  }
  get playersStatus() {
    return JSON.parse(JSON.stringify(this.players, ['playerId', 'joined']));
  }

  // getSqlDateString(date = new Date) {
  //   return date.getFullYear() + '-' +
  //     ('00' + (date.getMonth()+1)).slice(-2) + '-' +
  //     ('00' + date.getDate()).slice(-2) + ' ' + 
  //     ('00' + date.getHours()).slice(-2) + ':' + 
  //     ('00' + date.getMinutes()).slice(-2) + ':' + 
  //     ('00' + date.getSeconds()).slice(-2);
  // }
}

module.exports = Room;