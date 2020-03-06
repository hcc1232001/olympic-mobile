import React, { useState, useEffect, useRef } from 'react';
import {useParams} from 'react-router-dom';
import useDeviceOrientation from 'components/useDeviceOrientation';

import withSocketio from 'components/withSocketio';

import config from 'globals/config';

import styles from './mobileHome.module.css';

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
const MobileHomePage = () => {
  const [{moveCounter, permissionGranted}, {setMoveCounter, setPermissionGranted}] = useDeviceOrientation();
  // const [permissionGranted, setPermissionGranted] = useState(false);
  const [gameStage, setGameStage] = useState(gameStatus['idle']);
  const [gameSelected, setGameSelected] = useState(0);
  const [score, setScore] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const playerId = useParams('playerId');
  const socket = useRef(null);
  const requestPermission = () => {
    // setPermissionGranted(true);
    // temp disable
    if (typeof(DeviceOrientationEvent) === "function" && typeof(DeviceOrientationEvent.requestPermission) === "function") {
      // alert('DeviceOrientationEvent.requestPermission');
      DeviceOrientationEvent.requestPermission().then(response => {
          if (response == 'granted') {
            setPermissionGranted(true);
            // window.addEventListener('deviceorientation', onMotion, false);
            // window.addEventListener('deviceorientation', (e) => {
            //   // do something with e
            // })
          }
        })
        .catch(console.error);
    } else {
      setPermissionGranted(true);
      // alert('no DeviceOrientationEvent.requestPermission');
      // window.addEventListener('deviceorientation', onMotion, false);
    }
  };
  const joinRoom = () => {
    if (!permissionGranted) {
      // setPermissionGranted(true);
      requestPermission();
    } else {
      // socket.current.emit('joinRoom', playerId);
    }
  }
  useEffect(() => {
    if (permissionGranted) {
      socket.current = withSocketio({
        host: config.socketioHost,
        eventEmitters: [
          {
            emitter: 'joinRoom',
            data: playerId,
            ack: (result) => {
              // alert(result);
              if (result === "failed, scan again") {
                alert("Room not found, please Scan the QRcode again.")
              }
            }
          }
        ],
        eventListeners: [
          {
            listener: 'gameStage',
            callback: (stageId) => {
              setGameStage(stageId);
              if (stageId === gameStatus.selecting) {
                setGameSelected(0);
              }
            }
          },
          {
            listener: 'gameResult',
            callback: (score) => {
              setScore(score);
            }
          },
          {
            listener: 'playersInfo',
            callback: (players) => {
              players.forEach(player => {
                if (player['playerId'] === playerId['playerId']) {
                  setIsJoined(player['joined']);
                }
              });
            }
          },
          {
            listener: 'gameChoice',
            callback: (gameIdx) => {
              setGameSelected(gameIdx);
            }
          },
          {
            listener: 'gameSelected',
            callback: (gameId) => {
              setGameSelected(gameId);
              // gameSelected.current = gameId;
            }
          },
        ]
      })
    }
  }, [permissionGranted]);
  useEffect(() => {
    if (moveCounter > 2) {
      // socket.current.emit('shake');
      shake();
      setMoveCounter(0);
    }
  }, [moveCounter]);
  const shake = () => {
    socket.current.emit('shake');
  }
  const selectGame = (gameIdx) => {
    socket.current.emit('selectGame', gameIdx, (newGameIdx) => {
      setGameSelected(newGameIdx);
    });

  }
  return <div className={styles.wrapper}>
    {/* <div>{gameStage} {permissionGranted? 'true': 'false'}</div> */}
    {{
      [gameStatus.idle]: (
        <button className={styles.joinButton} onClick={joinRoom}>Join Game!</button>
      ),
      [gameStatus.waiting]: (
        isJoined?
        <div className={styles.joinButton}>Wait for other players</div>:
        <button className={styles.joinButton} onClick={joinRoom}>Join Game!</button>
      ),
      [gameStatus.selecting]: (
        <div className={styles.joinButton}>
          <button onClick={()=>selectGame(0)} className={styles.selectButton + (gameSelected === 0? ' ' + styles.selected: '')}>Game 1</button>
          <br/>
          <button onClick={()=>selectGame(1)} className={styles.selectButton + (gameSelected === 1? ' ' + styles.selected: '')}>Game 2</button>
          <br/>
          <button onClick={()=>selectGame(2)} className={styles.selectButton + (gameSelected === 2? ' ' + styles.selected: '')}>Game 3</button>
        </div>
      ),
      [gameStatus.selected]: (
        <div className={styles.joinButton}>Game {gameSelected + 1}</div>
      ),
      [gameStatus.ready]: (
        <div className={styles.joinButton}>Ready</div>
      ),
      [gameStatus.started]: (
        <button className={styles.joinButton} onClick={shake}>Shake!</button>
      ),
      [gameStatus.result]: (
        <div className={styles.joinButton}>
          Result
          <div><b>{score}</b></div>
        </div>
      ),
    }[gameStage]}
  </div>;
}

export default MobileHomePage;