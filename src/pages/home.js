import React from 'react';
import {Link} from 'react-router-dom';
import GameCanvas from 'containers/gameCanvas';
import DebugPanel from 'containers/debugPanel';

const HomePage = () => {
  return <>
    <GameCanvas />
    {/* <DebugPanel /> */}
  </>;
}

export default HomePage;