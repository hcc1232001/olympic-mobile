import React from 'react';
import Loadable from 'react-loadable';

const asyncLoadingFunction = (funcToImportPage) => {
  return Loadable({
    loader: funcToImportPage,
    loading: (props) => { 
      if (props.isLoading) {
        return <div className="loading-loading">Loading...</div>;
      }else if (props.timedOut) {
        return <div className="loading-timeout">Timeout. Please retry.</div>
      } else if (props.error) {
        return <div className="loading-error">Sorry, there was a problem when loading.</div>;
      } else {
        return <div className="loading-unknown">Unknown Error</div>;
      }
    }
  });
}

const asyncLoadingPage = (pageId) => {
  return asyncLoadingFunction(()=> import('pages/' + pageId));
}

export default asyncLoadingFunction;

export {
  asyncLoadingPage
};
