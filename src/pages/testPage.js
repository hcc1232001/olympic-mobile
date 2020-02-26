import React from 'react';
import {useParams} from 'react-router-dom';
import useDeviceOrientation from 'components/useDeviceOrientation';


const MobileHomePage = () => {
  const [direction, speed, angle, permissionGranted, setPermissionGranted] = useDeviceOrientation();
  const playerId = useParams('playerId');
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
  return <div>
    {!permissionGranted && <button onClick={requestPermission}>Start!</button>}
    <div>direction</div>
    <div>{direction}</div>
    <div>speed</div>
    <div>{speed}</div>
    <div>angle</div>
    <div>{angle}</div>
  </div>;
}

export default MobileHomePage;