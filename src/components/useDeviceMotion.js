import React, {useState, useEffect, useRef} from 'react';

const useDeviceMotion = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  // const [direction, setDirection] = useState(0);
  // const [speed, setSpeed] = useState(0);
  // const [angle, setAngle] = useState(0);
  const [moveCounter, setMoveCounter] = useState(0);
  // let prevAngle = useRef(0);
  // let prevTime = useRef(0);
  useEffect(() => {
    if (permissionGranted) {
      window.addEventListener('devicemotion', updateDeviceStatus, false);
    }
    return () => {
      window.removeEventListener('devicemotion', updateDeviceStatus, false);
    }
  }, [permissionGranted]);

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
    // setLastAccVec3([alpha, beta, gamma]);
    lastAccVec3 = [x, y, z];
    // lastAccDir = currentAccDir;
  }
  
  return [{
    // direction, 
    // speed, 
    // angle,
    moveCounter,
    permissionGranted
  }, {
    setPermissionGranted,
    setMoveCounter
  }];
}

export default useDeviceMotion;