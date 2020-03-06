import React, { useState, useEffect, useRef } from 'react';
import {useParams} from 'react-router-dom';

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
  const [moveCounter, setMoveCounter] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [lastVec3, setLastVec3] = useState([0,0,0]);
  const [eventTimeDelta, setEventTimeDelta] = useState(0);

  // const [permissionGranted, setPermissionGranted] = useState(false);
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
  let lastAccVec3 = [null, null, null];
  // let lastAccDir = 0;
  const threshold = 0.5;
  const prevTime = useRef(0);

  const updateDeviceStatus = (event) => {
    const {x, y, z} = event.acceleration;
    const timeNow = Date.now();
    const timeDelta = timeNow - prevTime.current;
    prevTime.current = timeNow;
    // const timeDelta = event.interval;
    // alert(`${x}, ${y}, ${z}`);
    
    let deltaX = Math.abs(x - lastAccVec3[0]);
    let deltaY = Math.abs(y - lastAccVec3[1]);
    let deltaZ = Math.abs(z - lastAccVec3[2]);
    // let currentAccDir = Math.sign(y - lastAccVec3[1]);
    if (deltaY / timeDelta > threshold) {
      setMoveCounter((prevMoveCounter) => {
        return prevMoveCounter + 1;
      })
    } else {
      setMoveCounter((prevMoveCounter) => {
        return Math.max(0, prevMoveCounter - 1);
      })
    }
    setLastVec3([x, y, z]);
    setEventTimeDelta(timeDelta);
    lastAccVec3 = [x, y, z];
    // lastAccDir = currentAccDir;
  }
  useEffect(() => {
    if (permissionGranted) {
      window.addEventListener('devicemotion', updateDeviceStatus, false);
    }
    return () => {
      window.removeEventListener('devicemotion', updateDeviceStatus, false);
    }
  }, [permissionGranted]);
  return <div className={styles.wrapper}>
    <button className={styles.joinButton} onClick={joinRoom}>Join Game!</button>
    {Math.round(lastVec3[1] * 1000) / 1000}
    <br/>
    {eventTimeDelta}
  </div>;
}

export default MobileHomePage;