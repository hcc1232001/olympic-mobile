import React from 'react';
import {HashRouter, BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import routes from 'globals/routes';
import asyncLoadingFunction, {asyncLoadingPage} from 'components/loadingComponent';

const getRenderPropForRoute = (pageId) => {
  const AppComponent = asyncLoadingPage(pageId);
  return (match) => { return (<AppComponent match={match} />) };
  
}
const App = () => {
  return <HashRouter>
    <Route path={routes.home} render={getRenderPropForRoute('home')} />
    <Redirect to={routes.home} />
  </HashRouter>;
}

export default App;