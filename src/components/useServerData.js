import React, {useState, useEffect} from 'react';

const useServerData = (initialUrl) => {
  const [serverUrl, setServerUrl] = useState(initialUrl);
  const [serverData, setServerData] = useState({});
  useEffect(() => {
    fetch(serverUrl, {
      // mode: 'cors',
      // headers: {
      //   'Content-Type': 'application/json'
      // }
    })
      .then(res => res.json())
      .then(json => setServerData(json))
      .catch(error => alert(error));
  }, [serverUrl]);
  useEffect(() => {
    console.log(serverData);
  }, [serverData])
  return [serverData, setServerUrl];
}

export default useServerData;