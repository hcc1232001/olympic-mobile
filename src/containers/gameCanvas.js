import React, { useEffect, useState, useRef } from 'react';
import {generatePath} from 'react-router-dom';
import QRCode from 'qrcode';

import withSocketio from 'components/withSocketio';

import routes from 'globals/routes';
import config from 'globals/config';

import spriteImageUrl from 'media/sprite/offline-sprite-2x.png';

import styles from './gameCanvas.module.css';

const gameStatus = {
  idle:    0,
  waiting: 1,
  ready:   2,
  started: 3,
  result:  4,
  offline: 5,
};

const fps = 60;

const playerColor = [
  '#0885c2',
  '#fbb132',
  '#000000',
  '#1c8b3c',
  '#ed334e'
];
const numPos = [
  [954, 2, 18, 21],
  [974, 2, 18, 21],
  [994, 2, 18, 21],
  [1014, 2, 18, 21],
  [1034, 2, 18, 21],
  [1054, 2, 18, 21],
  [1074, 2, 18, 21],
  [1094, 2, 18, 21],
  [1114, 2, 18, 21],
  [1134, 2, 18, 21]
]
const cloudPos = [
  166, 2, 92, 27
];
const birdPos = [
  [260, 2, 92, 80],
  [352, 2, 92, 80],
];
const floorPos = [
  2, 104, 2400, 26
];
const TrexPos = [
  [1338, 2, 88, 94],
  [1426, 2, 88, 94],
  [1514, 2, 88, 94],
  [1602, 2, 88, 94],
  [1690, 2, 88, 94],
  [1778, 2, 88, 94],
  [1866, 2, 118, 94],
  [1984, 2, 118, 94],
];
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
const GameCanvas = () => {
  const [gameStage, setGameStage] = useState(gameStatus.offline);

  const cachedCanvas = CachedCanvas();
  const canvas = useRef();
  const ctx = useRef();
  const animationFrame = useRef();

  const qrcodeArray = useRef([]);
  const playerJoined = useRef([]);
  let cloudArray = [];
  let birdArray = [];
  let cactusArray = useRef([0,0,0,0,0]);
  const setGameCanvas = canvasRef => {
    canvas.current = canvasRef;
    if (canvasRef) {
      canvasRef.width = canvasRef.offsetWidth;
      canvasRef.height = canvasRef.offsetHeight;
      ctx.current = canvasRef.getContext('2d');
    } else {
      ctx.current = null;
    }
  };

  let shakeCounter = useRef(0);
  let score = useRef(0);
  let backgroundTimer = useRef(0);
  const drawTrex = (status) => {
    ctx.current.drawImage(cachedCanvas, ...TrexPos[status], 88, 196, 88, 94);
    // console.log(TrexPos[0]);
  };
  const drawFloor = (status) => {
    const targetX = (status) % floorPos[2];
    ctx.current.drawImage(cachedCanvas, targetX, floorPos[1], canvas.current.width, floorPos[3], 0, 264, canvas.current.width, floorPos[3]);
    const remainX = targetX - floorPos[2] + canvas.current.width;
    if (remainX > 0) {
      ctx.current.drawImage(cachedCanvas, floorPos[0], floorPos[1], remainX, floorPos[3], canvas.current.width - remainX, 264, remainX, floorPos[3]);
    }
    // console.log(TrexPos[0]);
  };
  const drawScore = (score) => {
    const scoreArray = score.toString().padStart(5, '0').split('');
    scoreArray.forEach((num, idx) => {
      ctx.current.drawImage(cachedCanvas, ...numPos[num], canvas.current.width - 22 * (scoreArray.length - idx + 0.5), 11, numPos[num][2], numPos[num][3]);
    })
  };
  const drawCloud = (status) => {
    cloudArray.forEach((cloudOffset, idx) => {
      const newX = (canvas.current.width +  2 * cloudPos[2]) - (status * cloudOffset[0] - cloudOffset[2]) % (canvas.current.width +  2 * cloudPos[2]) - 2 * cloudPos[2];
      ctx.current.drawImage(cachedCanvas, ...cloudPos, newX, cloudOffset[1], cloudPos[2], cloudPos[3]);
      if (newX <= -cloudPos[2]) {
        cloudArray[idx] = null;
      }
    })
    cloudArray = cloudArray.filter(el => el !== null);
  };
  const drawBird = (status) => {
    const currentFrame = ~~(status / fps) % birdPos.length;
    birdArray.forEach((birdOffset, idx) => {
      const newX = (canvas.current.width +  2 * birdPos[currentFrame][2]) - (status * birdOffset[0] - birdOffset[2]) % (canvas.current.width +  2 * birdPos[currentFrame][2]) - 2 * birdPos[currentFrame][2];
      ctx.current.drawImage(cachedCanvas, ...birdPos[currentFrame], newX, birdOffset[1], birdPos[currentFrame][2], birdPos[currentFrame][3]);
      if (newX <= -birdPos[currentFrame][2]) {
        birdArray[idx] = null;
      }
    });
    birdArray = birdArray.filter(el => el !== null);
  };
  let prevTime = new Array(5).fill(Date.now());
  const drawCactus = () => {
    const now = Date.now();
    cactusArray.current.forEach((cactus, idx) => {
      const timeDelta = now - prevTime[idx];
      ctx.current.save();
      if (playerJoined.current[idx] !== true) {
        ctx.current.globalAlpha = 0.3;
      }
      if (cactus > 0) {
        const needAnimate = timeDelta >= Math.min(500 / cactus, 200);
        ctx.current.drawImage(cachedCanvas, ...cactusPos, 218 + (80 * idx), 320 - (cactus % 2) * 15, cactusPos[2], cactusPos[3]);
        if (needAnimate) {
          cactusArray.current[idx] -= 1;
          prevTime[idx] = now;
        }
      } else {
        ctx.current.drawImage(cachedCanvas, ...cactusPos, 218 + (80 * idx), 320, cactusPos[2], cactusPos[3]);
      }
      ctx.current.fillStyle = playerColor[idx];
      ctx.current.fillRect(218 + (80 * idx), 380, cactusPos[2], 10);
      ctx.current.restore();
    })
  };

  const drawQRCode = () => {
    qrcodeArray.current.forEach((qrcode, idx) => {
      ctx.current.drawImage(qrcode, 85 + 120 * idx, (idx % 2 === 0 ? 30: 210));
    });
  };
  
  const drawResult = (score) => {
    const scoreArray = score.toString().padStart(5, '0').split('');
    scoreArray.forEach((num, idx) => {
      ctx.current.drawImage(cachedCanvas, ...numPos[num], (canvas.current.width - 22 * scoreArray.length) / 2 + 22 * idx, (390 - numPos[num][3]) / 2, numPos[num][2], numPos[num][3]);
    })
  };
  const addScore = (countArray) => {
    countArray.forEach((count, idx) => cactusArray.current[idx] += count * 2);
    const countSum = countArray.reduce((accumulator, currentValue) => accumulator + currentValue);
    score.current += countSum;
    addShakeCounter(countSum);
  };
  const addShakeCounter = (count) => {
    shakeCounter.current += count;
    shakeCounter.current = Math.max(Math.min(shakeCounter.current, 30), 0);
  };
  const trexMultiplier = 1; // 0.01 * fps min, 0.3 * fps max seems good, each shake + 0.01 (5 player shake 6 times in a second will be max)
  const floorMultiplier = 60; // 1 * fps min, 15 * fps max seems good, each shake + 0.5 (5 player shake 6 times in a second will be max)
  const scoreMultiplier = 1; // 0.016 * fps min, 0.3 * fps max seems good, each shake + 0.01 (5 player shake 6 times in a second will be max)
  const cloudMultipler = 10;
  const birdMultipler = 30;
  const render = () => {
    animationFrame.current = requestAnimationFrame(render);
    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
    switch (gameStage) {
      case gameStatus.idle:
      case gameStatus.waiting:
        // show qrcode
        // ctx.current.font = "80px Georgia";
        // ctx.current.fillText("IDLE", 300, 200);
        backgroundTimer.current = 0;
        shakeCounter.current = 0;
        score.current = 0;
        drawQRCode();
        break;
      case gameStatus.ready:
        // get set go
        backgroundTimer.current += 1;
        drawFloor(0);
        if (backgroundTimer.current / fps < 2) {
          drawTrex(~~((backgroundTimer.current / fps) % 10 / 9));
        } else {
          drawTrex(6);
        }
        drawCactus();
        drawScore(0);
        break;
      case gameStatus.started:
        // playing
        backgroundTimer.current += 0.5 + shakeCounter.current;
        if (shakeCounter.current > 0) {
          addShakeCounter(-Math.max(0.1, shakeCounter.current * 0.01));
        }
        // shakeCounter += 30;
        drawFloor((backgroundTimer.current) / fps * floorMultiplier);
        drawCloud((backgroundTimer.current) / fps * cloudMultipler);
        drawBird((backgroundTimer.current) / fps * birdMultipler);
        drawTrex(~~((backgroundTimer.current) / fps * trexMultiplier) % 2 + 2);
        drawCactus();
        drawScore(score.current);
        if (cloudArray.length < 1) {
          cloudArray.push(
            [0.5, Math.random() * 100, (backgroundTimer.current) / fps * cloudMultipler * 0.5]
          );
        }
        if (birdArray.length < 1) {
          birdArray.push(
            [1, 30 + Math.random() * 90, (backgroundTimer.current) / fps * birdMultipler]
          );
        }
        break;
      case gameStatus.result:
        // show result
        drawResult(score.current);
        // ctx.current.font = "80px monospace";
        // ctx.current.fillText(score.current.toString(), 300, 200);
        break;
      case gameStatus.offline:
        // not yet connect to server ?
        break;
    }
    
  };

  useEffect(() => {
    withSocketio({
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
          callback: () => console.log('disconnect')
        },
        {
          listener: 'gameStage',
          callback: (stageId) => {
            setGameStage(stageId);
          }
        },
        {
          listener: 'playersInfo',
          callback: (playersInfo) => {
            qrcodeArray.current.length = 0;
            playersInfo.forEach((playerInfo, idx) => {
              const dummyCanvas = document.createElement('canvas');
              dummyCanvas.width = 150;
              dummyCanvas.height = 150;
              if (playerInfo['joined'] === false) {
                playerJoined.current[idx] = false;
                const joinGamePath = window.location.origin + window.location.pathname + '#' + generatePath(routes.mobileHome, {playerId: playerInfo['playerId']});
                QRCode.toCanvas(
                  dummyCanvas,
                  joinGamePath,
                  {
                    margin: 0,
                    width: 150,
                    color: {
                      dark: playerColor[idx],
                      // light: '#FFFFFFFF'
                    }
                  }
                );
              } else {
                playerJoined.current[idx] = true;
                const ctx = dummyCanvas.getContext('2d');
                ctx.fillStyle = playerColor[idx];
                ctx.fillRect(0, 0, 150, 150);
                ctx.drawImage(cachedCanvas, ...cactusPos, (150 - cactusPos[2]) / 2, (150 - cactusPos[3]) / 2, cactusPos[2], cactusPos[3]);
              }
              qrcodeArray.current[idx] = dummyCanvas;
            })
          }
        },
        {
          listener: 'playersShake',
          callback: (shakeArray) => {
            // console.log(shakeArray);
            // console.log(gameStage);
            addScore(shakeArray);
          }
        }
      ]
    })
    return () => {
      cancelAnimationFrame(animationFrame.current);
    }
  }, []);
  useEffect(() => {
    switch (gameStage) {
      case gameStatus.idle:
      case gameStatus.waiting:
      case gameStatus.ready:
      case gameStatus.started:
        backgroundTimer.current = 0;
        shakeCounter.current = 0;
        score.current = 0;
        break;
      case gameStatus.result:
        // show result
        break;
      case gameStatus.offline:
    }
    render();
    return () => {
      cancelAnimationFrame(animationFrame.current);
    }
  }, [gameStage]);

  return <div className={styles.gameCanvasWrapper}>
    <canvas className={styles.gameCanvas} ref={setGameCanvas} />
    {/* <button onClick={()=>addScore([1,0,0,0,0])}>Shake 1</button>
    <button onClick={()=>addScore([1,1,1,1,1])}>Shake 5</button>
    <button onClick={()=>addScore([2,2,2,2,2])}>Shake 10</button>
    <button onClick={()=>addScore([3,3,3,3,3])}>Shake 15</button>
    <button onClick={()=>addScore([6,6,6,6,6])}>Shake 30</button> */}
  </div>;
}

export default GameCanvas;