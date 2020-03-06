import React from 'react';
import {Link, generatePath} from 'react-router-dom';

import GameCanvas from 'containers/gameCanvas';
import DebugPanel from 'containers/debugPanel';
import routes from 'globals/routes';

const LandingPage = () => {
  return <div>
    <h1>Home Page</h1>
    <p>Some Introduction to the event here.</p>
    <Link to={generatePath(routes.home)}>Create a New Game</Link>
  </div>;
}

export default LandingPage;