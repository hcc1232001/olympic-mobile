import React, { useState, useEffect, useRef } from 'react';
import {useParams} from 'react-router-dom';
import useDeviceOrientation from 'components/useDeviceOrientation';

import withSocketio from 'components/withSocketio';

import config from 'globals/config';

import styles from './mobileHome.module.css';

const gameStatus = {
  idle:    0,
  waiting: 1,
  ready:   2,
  started: 3,
  result:  4,
  offline: 5,
};

const MobileHomePage = () => {
  const [direction, speed, angle, permissionGranted, setPermissionGranted] = useDeviceOrientation();
  const [gameStage, setGameStage] = useState(gameStatus['idle']);
  const [score, setScore] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const playerId = useParams('playerId');
  const socket = useRef(null);
  const requestPermission = () => {
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
      requestPermission();
    } else {
      socket.current.emit('joinRoom', playerId);
    }
  }
  useEffect(() => {
    if (permissionGranted) {
      socket.current = withSocketio({
        host: config.socketioHost,
        eventEmitters: [
          {
            emitter: 'joinRoom',
            data: playerId
          }
        ],
        eventListeners: [
          {
            listener: 'gameStage',
            callback: (stageId) => {
              setGameStage(stageId);
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
          }
        ]
      })
    }
  }, [permissionGranted]);
  useEffect(() => {
    if (speed > 5) {
      socket.current.emit('shake');
    }
  }, [direction])
  const shake = () => {
    socket.current.emit('shake');
  }
  return <div className={styles.wrapper}>
    {/* <div>{gameStage} {permissionGranted? 'true': 'false'}</div> */}
    {{
      [gameStatus.idle]: (
        <button className={styles.joinButton} onClick={joinRoom}>Join Game!</button>
      ),
      [gameStatus.waiting]: (
        isJoined?
        <div className={styles.joinButton}>choose game here</div>:
        <button className={styles.joinButton} onClick={joinRoom}>Join Game!</button>
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