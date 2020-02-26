import React from 'react';
import {HashRouter, BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import routes from 'globals/routes';
import asyncLoadingFunction, {asyncLoadingPage} from 'components/loadingComponent';

const getRenderPropForRoute = (pageId) => {
  const AppComponent = asyncLoadingFunction(() => import(`pages/${pageId}`));
  return (match) => { return (<AppComponent match={match} />) };
  
}
const App = () => {
  return <HashRouter>
    <Route path={routes.home} render={getRenderPropForRoute('home')} />
    <Route path={routes.mobileHome} render={getRenderPropForRoute('mobileHome')} />
    {/* <Redirect to={routes.mobileHome} /> */}
  </HashRouter>;
}

export default App;