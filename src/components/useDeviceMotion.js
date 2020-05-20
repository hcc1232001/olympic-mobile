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
      // seems can add both event listener at the same request
      // window.addEventListener('deviceorientation', updateDeviceOrientation, false);
      window.addEventListener('devicemotion', updateDeviceStatus, false);
    }
    return () => {
      // window.removeEventListener('deviceorientation', updateDeviceOrientation, false);
      window.removeEventListener('devicemotion', updateDeviceStatus, false);
    }
  }, [permissionGranted]);

  let lastAccVec3 = [null, null, null];
  let lastOriVec3 = [null, null, null];
  // let lastAccDir = 0;
  const threshold = 0.5;
  const prevTime = useRef(0);

  // const updateDeviceOrientation = (event) => {
  //   lastOriVec3 = [event.alpha, event.beta, event.gamma];
  //   // console.log(event.alpha, event.beta, event.gamma)
  // }
  const updateDeviceStatus = (event) => {
    let x = 0;
    let y = 0;
    let z = 0;
    if(event.acceleration){
      //requires a gyroscope to work.
      // alert("Motion Acceleration: " +  event.acceleration.x + ", " +  event.acceleration.y + ", " +  event.acceleration.z);
      x = event.acceleration.x;
      y = event.acceleration.y;
      z = event.acceleration.z;
    }
    else{
      //this is for iPhone 3GS or a device with no gyroscope, and includes gravity.
      // ios 13.x somehow return null in event.acceleration, so need to use this to get the acceleration
      x = event.accelerationIncludingGravity.x;
      y = event.accelerationIncludingGravity.y;
      z = event.accelerationIncludingGravity.z;
    }
    const timeNow = Date.now();
    const timeDelta = timeNow - prevTime.current;
    prevTime.current = timeNow;
    // event.interval is differnet scale in ios(0.016) and android (16)
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