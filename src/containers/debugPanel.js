import React, { useState, useRef, useMemo } from 'react';
import {generatePath} from 'react-router-dom';
import QRCode from 'qrcode';

import withSocketio from 'components/withSocketio';

import routes from 'globals/routes';
import config from 'globals/config';

import spriteImageUrl from 'media/sprite/offline-sprite-2x.png';

import styles from './debugPanel.module.css';

const playerColor = [
  '#0885c2',
  '#fbb132',
  '#000000',
  '#1c8b3c',
  '#ed334e'
];

const gameStatus = {
  idle:    0,
  waiting: 1,
  ready:   2,
  started: 3,
  result:  4,
  offline: 5,
};

const gameStatusText = {
  [gameStatus.idle]:    'idle',
  [gameStatus.waiting]: 'waiting',
  [gameStatus.ready]:   'ready',
  [gameStatus.started]: 'started',
  [gameStatus.result]:  'result',
  [gameStatus.offline]: 'offline',
};
const cactusPos = [
  446, 2, 34, 70
];

const CachedCanvas = () => {
  const cacheCanvas = document.createElement('canvas');
  const cacheCtx = cacheCanvas.getContext('2d');
  const spriteImage = new Image();
  spriteImage.addEventListener('load', () => {
    cacheCanvas.width = spriteImage.width;
    cacheCanvas.height = spriteImage.height;
    cacheCtx.drawImage(spriteImage, 0, 0);
  }, {
    once: true
  });
  spriteImage.src = spriteImageUrl;
  return cacheCanvas;
}

const DebugPanel = () => {
  const [gameStage, setGameStage] = useState(gameStatus.offline);
  const cachedCanvas = CachedCanvas();
  const [qrcodeArray, setQrcodeArray] = useState([]);
  const [playersInfo, setPlayersInfo] = useState([]);
  const [scoreArray, setScoreArray] = useState([0, 0, 0, 0, 0]);

  const tempScoreArray = [0, 0, 0, 0, 0];
  const socket = useMemo(() => withSocketio({
    host: config.socketioHost,
    eventEmitters: [
      {
        emitter: 'createRoom',
        data: {
          roomId: 'shake01'
        }
      }
    ],
    eventListeners: [
      {
        listener: 'disconnect',
        callback: () => console.log('disconnect!')
      },
      {
        listener: 'gameStage',
        callback: (stageId) => {
          setGameStage(stageId);
          if (stageId === gameStatus.started) {
            for (let i = 0; i < tempScoreArray.length; i++) {
              tempScoreArray[i] = 0;
            }
            setScoreArray([0, 0, 0, 0, 0]);
          }
        }
      },
      {
        listener: 'playersInfo',
        callback: (playersInfo) => {
          console.log('playersInfo', playersInfo);
          setPlayersInfo(playersInfo);
          const tempQrcodeArray = [];
          playersInfo.forEach((playerInfo, idx) => {
            if (playerInfo['joined'] === false) {
              const joinGamePath = window.location.origin + window.location.pathname + '#' + generatePath(routes.mobileHome, {playerId: playerInfo['playerId']});
              QRCode.toDataURL(
                joinGamePath,
                {
                  margin: 0,
                  width: 150,
                  color: {
                    dark: playerColor[idx],
                  }
                }, (err, url) => {
                  tempQrcodeArray[idx] = url;
                  setQrcodeArray([...tempQrcodeArray]);
                }
              );
            } else {
              tempQrcodeArray[idx] = null;
              setQrcodeArray([...tempQrcodeArray]);
            }
          })
        }
      },
      {
        listener: 'playersShake',
        callback: (shakeArray) => {
          // const tempScoreArray = [...scoreArray];
          shakeArray.forEach((score, idx) => {
            // if (tempScoreArray[idx] === undefined) {
            //   tempScoreArray[idx] = score;
            // } else {
            tempScoreArray[idx] += score;
            // }
          })
          // console.log(tempScoreArray);
          setScoreArray([...tempScoreArray]);
        }
      }
    ]
  }), []);
  const changeGameStatus = (event) => {
    const newStage = event.target.value;
    setGameStage(newStage);
    socket.emit('debug', {
      type: 'gameStage',
      data: newStage
    });
  }
  const joinGame = (playerIdx) => {
    const playerId = playersInfo[playerIdx]['playerId'];
    socket.emit('debug', {
      type: 'joinGame',
      data: {
        playerId: playerId
      }
    });
  }
  const doShake = (playerIdx) => {
    const playerId = playersInfo[playerIdx]['playerId'];
    socket.emit('debug', {
      type: 'shake',
      data: {
        playerId: playerId
      }
    });
  }
  return <div className={styles.debugPanel}>
    <div className={styles.header}>Debug Panel</div>
    <div className={styles.row}>
      Current Game Stage: 
      <select value={gameStage} onChange={changeGameStatus}>
        {Object.keys(gameStatusText).map(status => {
          return <option key={status} value={status}>{gameStatusText[status]}</option>
        })}
      </select>
    </div>
    {(gameStage === gameStatus.idle || gameStage === gameStatus.waiting) &&
      <div className={styles.row}>
        {qrcodeArray.map((url, idx) => {
          if (url !== null) {
            return <div key={idx} className={styles.qrblock} onClick={() => joinGame(idx)}>
              <img src={url}  />
              <div>Use this</div>
            </div>;
          } else {
            return <div key={idx} className={styles.qrblock}>
              <div className={styles.qrplaceholder} style={{
                color: playerColor[idx]
              }}>
                Joined
              </div>
            </div>;
          }
        })}
      </div>
    }
    {(gameStage === gameStatus.started) &&
      <div className={styles.row}>
        {playersInfo.map((playerInfo, idx) => {
          if (playerInfo.joined) {
            return <div key={idx} className={styles.playerJoined} onClick={() => doShake(idx)} style={{
              color: playerColor[idx]
            }}>
              <div>Shake</div>
              <div>{scoreArray[idx]}</div>
            </div>;
          } else {
            return <div key={idx} className={styles.playerNotJoined} style={{
              color: playerColor[idx]
            }}>
              <div>Not Joined</div>
            </div>;
          }
        })}
      </div>
    }
  </div>
};

export default DebugPanel;