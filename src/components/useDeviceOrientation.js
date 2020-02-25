import React, {useState, useEffect, useRef} from 'react';

const useDeviceOrientation = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [direction, setDirection] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [angle, setAngle] = useState(0);
  let prevAngle = useRef(0);
  let prevTime = useRef(0);
  useEffect(() => {
    if (permissionGranted) {
      window.addEventListener('deviceorientation', updateDeviceStatus, false);
    }
    return () => {
      window.removeEventListener('deviceorientation', updateDeviceStatus, false);
    }
  }, [permissionGranted]);

  const updateDeviceStatus = (event) => {
    const timeNow = Date.now();
    const timeDelta = timeNow - prevTime.current;
    const angleNow = event.alpha;
    let angleDelta = angleNow - prevAngle.current;
    prevTime.current = timeNow;
    prevAngle.current = angleNow;
    console.log(angleDelta);
    console.log(angleDelta / timeDelta * 1000);
    setAngle(angleNow);
    setDirection(Math.sign(angleDelta));
    setSpeed(angleDelta / timeDelta * 1000);
  }
  
  return [direction, speed, angle, permissionGranted, setPermissionGranted];
}

export default useDeviceOrientation;