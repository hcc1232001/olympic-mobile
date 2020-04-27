const Room = require('./room.js');
const roomConfigs = require('../config/roomConfigs.js');
const log = console.log;
class RoomManager {
  constructor(socketio) {
    this.roomsList = {};
    this.hostsList = {};
    this.debugList = {};
    this.playersList = {};
    this.socketio = socketio;
    this.initSocketEvents();
    log('----- RoomManager Started -----');
  }

  initSocketEvents() {
    this.socketio.on('connection', socket => {
      log('----- Client Connected -----');
      // createRoom for host use
      socket.on('createRoom', (options, ack) => {
        // leave room before create/join room
        
        if (options.roomId === undefined || this.roomsList[options.roomId] === undefined) {
          log(`createRoom - ${options.roomId}`);
          const newRoom = this.createRoom(options.roomId);
          newRoom.addHost(socket, ack);
        } else {
          this.roomsList[options.roomId].addHost(socket, ack);
        }
      });
      socket.on('joinRoom', (options, ack) => {
        if (this.playersList[options['playerId']] !== undefined) {
          this.playersList[options['playerId']].addPlayer(options['playerId'], socket, ack);
        } else {
          log(`room not found - ${socket.id}`);
          if (typeof(ack) === "function") {
            ack({
              data: "failed, scan again"
            });
          }
        }
      });

      // debug, maybe remove on production
      socket.on('debugRoom', (options, ack) => {
        socket.join('roomDebug');
        if (options.roomId === undefined || this.roomsList[options.roomId] === undefined) {
          if (typeof(ack) === "function") {
            ack({
              data: Object.keys(this.roomsList)
            });
          }
        } else {
          this.roomsList[options.roomId].addDebug(socket, ack);
        }
      })
    })
  }
  createRoom(roomId) {
    const newRoom = new Room({
      roomId: roomId,
      roomManager: this,
      playersCount: 5,
      hostCount: 1
    });
    return newRoom;
  }

  addRoom(roomId, room) {
    this.roomsList[roomId] = room;
    this.socketio.in('roomDebug').emit('roomList', Object.keys(this.roomsList));
  }

  addPlayer(playerId, room) {
    this.playersList[playerId] = room;
  }
  
  addHost(hostId, room) {
    this.hostsList[hostId] = room;
  }

  // call from Room
  removeRoom(roomId) {
    delete this.roomsList[roomId];
    this.socketio.in('roomDebug').emit('roomList', Object.keys(this.roomsList));
  }
  // call from Room
  removePlayer(playerId) {
    delete this.playersList[playerId];
  }

}

module.exports = RoomManager;