import React, { useState } from 'react';
import useDeviceOrientation from 'components/useDeviceOrientation';
const HomePage = () => {
  const [direction, speed, angle, permissionGranted, setPermissionGranted] = useDeviceOrientation();

  const requestPermission = () => {
    if (DeviceOrientationEvent && typeof(DeviceOrientationEvent.requestPermission) === "function") {
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
  return <div>
    {!permissionGranted && <button onClick={requestPermission}>Start</button>}
    <div>direction</div>
    <div>{direction}</div>
    <div>speed</div>
    <div>{speed}</div>
    <div>angle</div>
    <div>{angle}</div>
  </div>;
}

export default HomePage;