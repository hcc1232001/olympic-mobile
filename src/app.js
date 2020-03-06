import React from 'react';
import {HashRouter, BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import routes from 'globals/routes';
import asyncLoadingFunction, {asyncLoadingPage} from 'components/loadingComponent';

const getRenderPropForRoute = (pageId) => {
  const AppComponent = asyncLoadingFunction(() => import(`pages/${pageId}`));
  return (match) => { return (<AppComponent match={match} />) };
  
}
const App = () => {
  return <BrowserRouter>
    <Switch>
      <Route path={routes.home} render={getRenderPropForRoute('home')} />
      <Route path={routes.mobileHome} render={getRenderPropForRoute('mobileHome')} />
      <Route path={routes.landing} render={getRenderPropForRoute('landing')} />
      <Route path={routes.debug} render={getRenderPropForRoute('debug')} />
      <Redirect to={routes.landing} />
    </Switch>
  </BrowserRouter>;
}

export default App;