const path = require('path');
const fs = require("fs");
// const https = require('http');
const https = require('https');
// const express = require("express");
const io = require('socket.io')();
const { v1: uuid } = require('uuid');
const mysql = require('mysql');

const RoomManager = require('./components/roomManager.js');

const port = process.env.PORT || 3005;

const log = console.log;

// https://www.selfsignedcertificate.com/
// if need local deployment, can generate a cert for the local ip and load them here
const httpsOption = {
  key:  fs.readFileSync('./server/cert/10.0.1.40.key').toString(),
  cert: fs.readFileSync('./server/cert/10.0.1.40.cert').toString()
}
// local deployment use

const httpsServer = https.createServer(httpsOption, (req, res) => {
// const httpsServer = https.createServer((req, res) => {
  // api for distance and visit
  if (req.url === '/data') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json',
    });
    // !!! need to get data from db here !!!
    res.end(JSON.stringify({
      d: 2884,
      v: 101
    }));
  } else {
    res.writeHead(200);
    if (req.url === '/') req.url = 'index.html';
    const filePath = __dirname + '/../build/' + req.url;
    if (fs.existsSync(filePath)) {
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } else {
      res.end(fs.readFileSync(__dirname + '/../build/index.html'));
    }
  }
});
httpsServer.listen(port);

log(`server is now listening to port ${port}`);

/**
 * open a socketio server to do the shake shake game
 */
io.attach(httpsServer);

const roomManager = new RoomManager(io);