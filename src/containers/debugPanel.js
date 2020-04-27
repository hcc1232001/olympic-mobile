import React, { useState, useEffect, useRef, useMemo } from 'react';
import {useParams, generatePath, Link} from 'react-router-dom';
import QRCode from 'qrcode';

import withSocketio from 'components/withSocketio';

import routes from 'globals/routes';
import config from 'globals/config';

import spriteImageUrl from 'media/sprite/offline-sprite-2x.png';

import styles from './debugPanel.module.css';

const playerColor = [
  "#ed334e",
  "#00652e",
  "#0080C7",
  "#fbb130",
  "#231f20",
];

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

const gameStatusText = {
  [gameStatus.idle]:      'idle',
  [gameStatus.waiting]:   'waiting',
  [gameStatus.selecting]: 'selecting',
  [gameStatus.selected]:  'selected',
  [gameStatus.ready]:     'ready',
  [gameStatus.started]:   'started',
  [gameStatus.result]:    'result',
  [gameStatus.offline]:   'offline',
};

const distanceMultipliersOptions = [
  0.1,
  1,
  2,
  5,
  10,
  20,
  50,
  100
];
const cactusPos = [
  446, 2, 34, 70
];

// const CachedCanvas = () => {
//   const cacheCanvas = document.createElement('canvas');
//   const cacheCtx = cacheCanvas.getContext('2d');
//   const spriteImage = new Image();
//   spriteImage.addEventListener('load', () => {
//     cacheCanvas.width = spriteImage.width;
//     cacheCanvas.height = spriteImage.height;
//     cacheCtx.drawImage(spriteImage, 0, 0);
//   }, {
//     once: true
//   });
//   spriteImage.src = spriteImageUrl;
//   return cacheCanvas;
// }

const DebugPanel = () => {
  const [gameStage, setGameStage] = useState(gameStatus.offline);
  // const cachedCanvas = CachedCanvas();
  const [joinGamePaths, setJoinGamePaths] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [qrcodeArray, setQrcodeArray] = useState([]);
  const [playersInfo, setPlayersInfo] = useState([]);
  const [scoreArray, setScoreArray] = useState(new Array(5).fill(0));
  const [choicesArray, setChoicesArray] = useState(new Array(5).fill(-1));
  const [gameSelected, setGameSelected] = useState(0);
  const [distanceMultiplier, setDistanceMultiplier] = useState(1);
  const {roomId} = useParams();

  // const roomName 
  const tempScoreArray = [0, 0, 0, 0, 0];
  const socket = useRef(null);
  useEffect(() => {
    socket.current = withSocketio({
      host: config.socketioHost,
      eventEmitters: [
        {
          emitter: 'debugRoom',
          data: {
            roomId: roomId
          },
          ack: (result) => {
            console.log(result['data']);
            if (Array.isArray(result['data'])) {
              setRoomList(result['data']);
            }
          }
        }
      ],
      eventListeners: [
        {
          listener: 'disconnect',
          callback: () => console.log('disconnect!')
        },
        // {
        //   listener: 'roomCreated',
        //   callback: (roomName) => {
        //     roomCreated
        //   }
        // },
        {
          listener: 'gameStage',
          callback: (data) => {
            const stageId = data['data'];
            const additionalParams = data['playersInfo'];
            console.log('gameStage', stageId, additionalParams);
            setGameStage(stageId);
            if (stageId === gameStatus.started) {
              for (let i = 0; i < tempScoreArray.length; i++) {
                tempScoreArray[i] = 0;
              }
              setScoreArray(new Array(5).fill(0));
            } else if (stageId === gameStatus.selecting) {
              setChoicesArray(new Array(5).fill(-1));
            }
          }
        },
        {
          listener: 'playersInfo',
          callback: (data) => {
            const playersInfo = data['data'];
            console.log('playersInfo', playersInfo);
            setPlayersInfo(playersInfo);
            const tempQrcodeArray = [];
            playersInfo.forEach((playerInfo, idx) => {
              if (playerInfo['joined'] === false) {
                const joinGamePath = window.location.origin + generatePath(routes.mobileHome, {playerId: playerInfo['playerId']});
                // 1234
                setJoinGamePaths((prevJoinGamePaths) => {
                  const newJoinGamePaths = [...prevJoinGamePaths];
                  newJoinGamePaths[idx] = joinGamePath;
                  return newJoinGamePaths;
                });
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
          listener: 'gameChoices',
          callback: (data) => {
            const choicesArray = data['data'];
            console.log('gameChoices', choicesArray);
            setChoicesArray(choicesArray);
          }
        },
        {
          listener: 'gameSelected',
          callback: (data) => {
            const gameId = data['data'];
            console.log('gameSelected', gameId);
            setGameSelected(gameId);
          }
        },
        {
          listener: 'playersShake',
          callback: (data) => {
            const shakeArray = data['data'];
            console.log('playersShake', shakeArray);
            // const tempScoreArray = [...scoreArray];
            shakeArray.forEach((score, idx) => {
              // if (tempScoreArray[idx] === undefined) {
              //   tempScoreArray[idx] = score;
              // } else {
              tempScoreArray[idx] += score;
              // }
            })
            setScoreArray([...tempScoreArray]);
          }
        },
        {
          listener: 'updateDistanceMultiplier',
          callback: (newDistanceMultiplier) => {
            console.log('updateDistanceMultiplier', newDistanceMultiplier);
            setDistanceMultiplier(newDistanceMultiplier);
          }
        },
        {
          listener: 'roomList',
          callback: (newRoomList) => {
            console.log('roomList', newRoomList);
            if (Array.isArray(newRoomList)) {
              setRoomList(newRoomList);
            }
          }
        },
        {
          listener: 'gameResult',
          callback: (result) => {
            console.log('gameResult', result);
          }
        }
      ]
    });
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    }
  }, [roomId])
  const changeGameStatus = (event) => {
    const newStage = event.target.value;
    setGameStage(newStage);
    socket.current.emit('debug', {
      type: 'gameStage',
      data: newStage
    });
  }
  const changeDistanceMultiplier = (event) => {
    const newDistanceMultiplier = event.target.value;
    setDistanceMultiplier(newDistanceMultiplier);
    socket.current.emit('debug', {
      type: 'setDistanceMultiplier',
      data: newDistanceMultiplier
    });
  }
  const joinGame = (playerIdx) => {
    const playerId = playersInfo[playerIdx]['playerId'];
    socket.current.emit('debug', {
      type: 'joinGame',
      data: {
        playerId: playerId
      }
    });
  }
  const kickPlayer = (playerIdx) => {
    const playerId = playersInfo[playerIdx]['playerId'];
    socket.current.emit('debug', {
      type: 'kickPlayer',
      data: {
        playerId: playerId
      }
    });
  }
  const doShake = (playerIdx) => {
    const playerId = playersInfo[playerIdx]['playerId'];
    socket.current.emit('debug', {
      type: 'shake',
      data: {
        playerId: playerId
      }
    });
  }
  const playerSelectGame = (playerIdx, gameIdx) => {
    choicesArray[playerIdx] = gameIdx;
    socket.current.emit('debug', {
      type: 'selectGame',
      data: {
        selectedArray: choicesArray
      }
    });
  }
  return (
  <div className={styles.debugPanel}>
    <div className={styles.header}>Debug Panel - Room 
      {roomId !== undefined && 
        <>
          &nbsp;
          <Link to={generatePath(routes.debug)} className={styles.backToList} />
          <span className={styles.roomId} title={`Room Id: ${roomId}`}>{roomId}</span>
        </>
      }
    </div>
    {roomId !== undefined ?
      <>
        <div className={styles.row}>
          Game Stage: &nbsp;
          <select value={gameStage} onChange={changeGameStatus}>
            {Object.keys(gameStatusText).map(status => {
              return <option key={status} value={status}>{gameStatusText[status]}</option>
            })}
          </select>
        </div>
        <div className={styles.row}>
          Distance Multiplier: &nbsp;
          <select value={distanceMultiplier} onChange={changeDistanceMultiplier}>
            {distanceMultipliersOptions.map(distanceMultiplierOptions => {
              return <option key={distanceMultiplierOptions} value={distanceMultiplierOptions}>{distanceMultiplierOptions}</option>
            })}
          </select>
        </div>
        {{
          [gameStatus.idle]: (
            <div className={styles.row}>
              {qrcodeArray.map((url, idx) => {
                if (url !== null) {
                  return <a key={idx} href={joinGamePaths[idx]} className={styles.qrblock} onClick={(e) => {
                    e.preventDefault();
                    joinGame(idx);
                  }}>
                    <img src={url}  />
                    <div>Use this</div>
                  </a>;
                } else {
                  return <div key={idx} className={styles.qrblock} onClick={() => kickPlayer(idx)}>
                    <div className={styles.qrplaceholder} style={{
                      color: playerColor[idx]
                    }}>
                      Joined
                    </div>
                    <div>Kick this</div>
                  </div>;
                }
              })}
            </div>
          ),
          [gameStatus.waiting]: (
            <div className={styles.row}>
              {qrcodeArray.map((url, idx) => {
                if (url !== null) {
                  return <a key={idx} href={joinGamePaths[idx]} className={styles.qrblock} onClick={(e) => {
                    e.preventDefault();
                    joinGame(idx);
                  }}>
                    <img src={url}  />
                    <div>Use this</div>
                  </a>;
                } else {
                  return <div key={idx} className={styles.qrblock} onClick={() => kickPlayer(idx)}>
                    <div className={styles.qrplaceholder} style={{
                      color: playerColor[idx]
                    }}>
                      Joined
                    </div>
                    <div>Kick this</div>
                  </div>;
                }
              })}
            </div>
          ),
          [gameStatus.selecting]: (
            <div className={styles.row}>
              {playersInfo.map((playerInfo, idx) => {
                if (playerInfo.joined) {
                  return <div key={idx} className={styles.playerJoined} onClick={() => doShake(idx)} style={{
                    color: playerColor[idx]
                  }}>
                    <button onClick={()=>playerSelectGame(idx, 0)} className={styles.gameSelectingBtn + (choicesArray[idx] === 0? ' ' + styles.gameSelected: '')}>Game 1</button>
                    <button onClick={()=>playerSelectGame(idx, 1)} className={styles.gameSelectingBtn + (choicesArray[idx] === 1? ' ' + styles.gameSelected: '')}>Game 2</button>
                    <button onClick={()=>playerSelectGame(idx, 2)} className={styles.gameSelectingBtn + (choicesArray[idx] === 2? ' ' + styles.gameSelected: '')}>Game 3</button>
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
          ),
          [gameStatus.selected]: (
            <div className={styles.row}>
              Game {gameSelected + 1}
            </div>
          ),
          [gameStatus.started]: (
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
          ),
        }[gameStage]}
      </>
      :
      <>
        {
          roomList.length > 0 ?
            <div className={styles.roomItemWrap}>
              {roomList.map((roomId) => {
                return <Link key={roomId} to={generatePath(routes.debug, { roomId: roomId })} className={styles.roomItem}>{roomId.split('-')[0]}</Link>
              })}
            </div>
          :
            <div className={styles.row}>
              No Game is Running
            </div>
        }
      </>
    }
  </div>);
};

export default DebugPanel;