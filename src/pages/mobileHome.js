import React, { useState, useEffect, useRef } from 'react';
import {useParams} from 'react-router-dom';
// import useDeviceOrientation from 'components/useDeviceOrientation';
import TextAnimation from 'components/textAnimation';
import WaitingIcon from 'components/waitingIcon';
import FanIcon from 'components/fanIcon';
import FanIconSmall from 'components/fanIconSmall';
import ShakeIcon from 'components/shakeIcon';

import useDeviceMotion from 'components/useDeviceMotion';
import useImagePreload from 'components/useImagePreload';

import withSocketio from 'components/withSocketio';

import config from 'globals/config';

import styles from './mobileHome.module.css';
import useServerData from 'components/useServerData';

const gameStatus = {
  idle:      0,
  waiting:   1,
  selecting: 2,
  selected:  3,
  ready:     4,
  started:   5,
  result:    6,
  offline:   7, // should be not able to get this signal
}
const gameStageClass = {
  [gameStatus.idle]:      'stage-idle',
  [gameStatus.waiting]:   'stage-waiting',
  [gameStatus.selecting]: 'stage-selecting',
  [gameStatus.selected]:  'stage-selected',
  [gameStatus.ready]:     'stage-ready',
  [gameStatus.started]:   'stage-started',
  [gameStatus.result]:    'stage-result',
  [gameStatus.offline]:   'stage-offline',
}
const gameIdxToColor = [
  'red',
  'yellow',
  'blue',
]
const playerColorCodeOfIdx = [
  "#ed334e",
  "#00652e",
  "#0080C7",
  "#fbb130",
  "#231f20",
];
const imagesArray = [
  '/media/images/title.png',
  '/media/images/idle.png',
  '/media/images/landing-counter1.png',
  '/media/images/landing-counter2.png',
  '/media/images/logo-white.png',
  '/media/images/waiting.png',
  '/media/images/background-logo.png',
  '/media/images/chosing.png',
  '/media/sprites/sports.png',
  '/media/images/atheletics-zh.png',
  '/media/images/atheletics-en.png',
  '/media/images/cycle-zh.png',
  '/media/images/cycle-en.png',
  '/media/images/swim-zh.png',
  '/media/images/swim-en.png',
  '/media/images/gacha-top-red.png',
  '/media/images/gacha-bottom-red.png',
  '/media/images/gacha-top-blue.png',
  '/media/images/gacha-bottom-blue.png',
  '/media/images/gacha-top-yellow.png',
  '/media/images/gacha-bottom-yellow.png',
  '/media/images/cheerhk.png',
  '/media/images/atheletics-zh-inv.png',
  '/media/images/atheletics-en-inv.png',
  '/media/images/cycle-zh-inv.png',
  '/media/images/cycle-en-inv.png',
  '/media/images/swim-zh-inv.png',
  '/media/images/swim-en-inv.png',
  '/media/images/get.png',
  '/media/images/set.png',
  '/media/images/go.png',
  '/media/images/congratz-red.png',
  '/media/images/congratz-green.png',
  '/media/images/congratz-yellow.png',
  '/media/images/congratz-blue.png',
  '/media/images/congratz-black.png',
  '/media/images/result.png',
  '/media/sprites/number.png',
  '/media/images/remain-zh.png',
];

const addCommas = (x) => {
  if (typeof x === "number")
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (typeof x === "string")
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return x;
}
const MobileHomePage = () => {
  const [preloadProgress] = useImagePreload(imagesArray);
  const [{moveCounter, permissionGranted}, {setMoveCounter, setPermissionGranted}] = useDeviceMotion();
  const [serverData, setServerUrl] = useServerData(config.apiUrl);
  const [gameStage, setGameStage] = useState(gameStatus['selecting']);
  const [stageChanging, setStageChanging] = useState(gameStatus['offline']);
  const [isJoined, setIsJoined] = useState(false);
  const [playerColorCode, setPlayerColorCode] = useState(playerColorCodeOfIdx[0]);
  const [gameSelected, setGameSelected] = useState(-1);
  const [shakeIconArray, setShakeIconArray] = useState([]);
  const [score, setScore] = useState(0);
  const [alertText, setAlertText] = useState('');

  const gameWrapper = useRef(null);
  const socket = useRef(null);

  const playerId = useParams('playerId');

  const setGameWrapper = (ref) => gameWrapper.current = ref;
  const requestPermission = () => {
    if (typeof(DeviceMotionEvent) === "function" && typeof(DeviceMotionEvent.requestPermission) === "function") {
      DeviceMotionEvent.requestPermission().then(response => {
        if (response == 'granted') {
          setPermissionGranted(true);
          // setGameStage(gameStatus['started']);
        } else {
          alert("Please allow the Device Motion to start the game.\n請允許使用裝置加速計權限以進行遊戲");
        }
      })
      .catch(console.error);
    } else {
      setPermissionGranted(true);
      // setGameStage(gameStatus['started']);
    }
  };

  const joinRoom = () => {
    if (!permissionGranted) {
      // setPermissionGranted(true);
      requestPermission();
    } else {
      // socket.current.emit('joinRoom', playerId);
    }
  }
  const selectGame = (gameIdx) => {
    if (socket.current) {
      socket.current.emit('selectGame', {
        data: gameIdx
      }, (data) => {
        const newGameIdx = data['data'];
        setGameSelected(newGameIdx);
      });
    } else {
      if (gameSelected === gameIdx) {
        setGameSelected(-1);
      } else {
        setGameSelected(gameIdx);
      }
    }
  }

  const shake = () => {
    if (socket.current) {
      socket.current.emit('shake');
    }
    generateShakeIcon();
    // vibration api, ios not support
    // window.navigator.vibrate(100);
  }
  const generateShakeIcon = () => {
    const randomScale = (Math.random() + 8) / 9;
    const randomXStart = Math.random() * 50 - 25;
    const randomXEnd = Math.random() * 30 - 10;
    const randomY = Math.random() * 10 - 5;
    const randomRotationStart = Math.random() * 180 - 90;
    const randomRotationEnd = Math.random() * 90 - 45;
    const randomDuration = Math.random() + 4;
    const icon = <ShakeIcon 
      className={styles['shake-icon']} 
      colorCodeInHex={playerColorCode}
      initialStyles={{
        bottom: `${60 + randomY}vw`,
        left: `${50 + randomXStart}%`,
        transform: `translateX(-50%) scale(${randomScale}) rotate(${randomRotationStart}DEG)`,
        opacity: 0.8,
        transition: `all ${randomDuration}s`
      }}
      finalStyles={{
        bottom: '100vh',
        left: `${randomXEnd}%`,
        transform: `translateX(-50%) scale(0) rotate(${randomRotationEnd}DEG)`,
        opacity: 0,
        transition: `all ${randomDuration}s`
      }}
      key={`${Date.now()}${Math.random()}`}
    />;
    requestAnimationFrame(() => {
      setShakeIconArray((prevShakeIconArray) => {
        return [...prevShakeIconArray.slice(-15), icon];
        // return [...prevShakeIconArray, icon];
      });
    })
  }
  
  useEffect(() => {
    if (moveCounter > 2) {
      shake();
      setMoveCounter(0);
    }
  }, [moveCounter]);
  useEffect(() => {
    setTimeout(() => {
      setStageChanging(gameStage);
    }, 20);
    if (gameStage === gameStatus.ready) {
      setShakeIconArray([]);
    }
  }, [gameStage]);
  useEffect(() => {
    if (permissionGranted) {
      socket.current = withSocketio({
        host: config.socketioHost,
        eventEmitters: [
          {
            emitter: 'joinRoom',
            data: playerId,
            ack: (result) => {
              // alert(result);
              if (result['data'] !== "joined") {
                setGameStage(gameStatus.offline);
                setAlertText(result['data']);
              } else {
                setPlayerColorCode(
                  playerColorCodeOfIdx[result['index']]
                );
              }
            }
          }
        ],
        eventListeners: [
          {
            listener: 'gameStage',
            callback: (data) => {
              const stageId = data['data'];
              setGameStage(stageId);
              // if (stageId === gameStatus.selecting) {
              //   setGameSelected(0);
              // } else 
              if (stageId === gameStatus.result) {
                socket.current.disconnect();
              }
            }
          },
          {
            listener: 'gameResult',
            callback: (data) => {
              console.log(data);
              const score = data['data'];
              setScore(Math.round(score));
            }
          },
          {
            listener: 'playersInfo',
            callback: (data) => {
              const players = data['data'];
              players.forEach(player => {
                if (player['playerId'] === playerId['playerId']) {
                  setIsJoined(player['joined']);
                }
              });
            }
          },
          {
            listener: 'gameChoice',
            callback: (data) => {
              const gameIdx = data['data'];
              setGameSelected(gameIdx);
            }
          },
          {
            listener: 'gameSelected',
            callback: (data) => {
              const gameId = data['data'];
              setGameSelected(gameId);
              // gameSelected.current = gameId;
            }
          },
        ]
      })
    }
  }, [permissionGranted]);
  useEffect(() => {
    document.addEventListener("keyup", debugByKeyboard);
    return () => {
      document.removeEventListener("keyup", debugByKeyboard);
    }
  }, []);
  const debugByKeyboard = (event) => {
    let isJoinedFlag = true;
    switch (event.key) {
      case "1":
        isJoinedFlag = false;
      case "2":
      case "3":
        setGameSelected(-1);
      case "4":
      case "5":
      case "6":
      case "7":
        setGameStage(event.key - 1);
        setIsJoined(isJoinedFlag);
        break;
      default:
        break;
    }
  }
  return (
    <div ref={setGameWrapper} className={styles.wrapper}>
      {<div className={[styles["preloadWrapper"], preloadProgress < 1? styles["active"]: null].join(' ')}>
        <div className={styles['progress']}>
          <div className={styles['bar']} style={{
            width: `${preloadProgress * 100}%`
          }} />
        </div>
        <div className={styles['percent']}>
          {`${Math.round(preloadProgress * 100)}%`}
        </div>
      </div>}
      <div className={[styles['stage'], styles[gameStageClass[gameStage]], (stageChanging === gameStage? styles['active']: null), (gameSelected !== -1? styles.selected: null)].join(' ')}>
        <div className={styles["background"]}>
          <div className={styles["texture"]} />
        </div>
        <div className={[styles["marquee"], styles["marqueeTop"], styles["marqueeIdle"]].join(' ')} />
        <div className={[styles["marquee"], styles["marqueeLeft"], styles["marqueeIdle"]].join(' ')} />
        <div className={[styles["marquee"], styles["marqueeBottom"], styles["marqueeIdle"]].join(' ')} />
        <div className={[styles["marquee"], styles["marqueeRight"], styles["marqueeIdle"]].join(' ')} />
        {gameStage === gameStatus.idle && <>
          <div className={styles["title"]} />
          <div className={[styles["counter"], styles["counter1"]].join(' ')}>
            <span>{addCommas(serverData.d)}</span> km
            <div className={styles["counterHints"]}>
              <TextAnimation 
                textsClass={[
                  'zh',
                  'en'
                ]}
                texts={[
                  "累積距離",
                  "Cumulative distance"
                ]}
              />
            </div>
          </div>
          <div className={[styles["counter"], styles["counter2"]].join(' ')}>
            <span>{addCommas(serverData.v)}</span>
            <div className={styles["counterHints"]}>
              <TextAnimation 
                texts={[
                  "累積人數",
                  "Cumulative visits"
                ]}
              />
            </div>
          </div>
          <div className={styles["logo"]} />
          <div className={styles["join-game-button"]} onClick={joinRoom}>
            <div className={styles["face"]}>
              <TextAnimation 
                texts={[
                  "立即參加",
                  "Join game"
                ]}
              />
            </div>
            <div className={styles["shadow"]} />
          </div>
        </>}
        {gameStage === gameStatus.waiting && <>
          <WaitingIcon className={[styles["movingIcon"], styles["movingIcon1"]].join(' ')} colorCodeInHex={playerColorCode} />
          <WaitingIcon className={[styles["movingIcon"], styles["movingIcon2"]].join(' ')} colorCodeInHex={playerColorCode} />
          <WaitingIcon className={[styles["movingIcon"], styles["movingIcon3"]].join(' ')} colorCodeInHex={playerColorCode} />
          <WaitingIcon className={[styles["movingIcon"], styles["movingIcon4"]].join(' ')} colorCodeInHex={playerColorCode} />
        </>}
        {gameStage === gameStatus.selecting && <>
          <div className={[styles.buttonsWrapper, (gameSelected !== -1? styles.selected: null)].join(' ')}>
            {
              new Array(3).fill(0).map((_, idx) => {
                return (
                  <div className={styles.button}>
                    <button onClick={()=>selectGame(idx)} 
                      className={[styles.gameButton, styles[`gameButton${idx}`], (gameSelected === idx? styles.selected: null)].join(' ')}>
                      <div className={styles["contentWrapper"]}>
                        <div className={styles["zh"]}><div className={styles['textImg']} /></div>
                        <div className={styles["en"]}><div className={styles['textImg']} /></div>
                        <div className={styles["ani"]} />
                      </div>
                    </button>
                  </div>
                );
              })
            }
            <div className={[styles['gacha'], styles['red']].join(' ')}>
              <div className={styles['gachaTop']} />
              <div className={styles['gachaBottom']} />
            </div>
            <div className={[styles['gacha'], styles['yellow']].join(' ')}>
              <div className={styles['gachaTop']} />
              <div className={styles['gachaBottom']} />
            </div>
            <div className={[styles['gacha'], styles['blue']].join(' ')}>
              <div className={styles['gachaTop']} />
              <div className={styles['gachaBottom']} />
            </div>
          </div>
        </>}
        {gameStage === gameStatus.selected && <>
          <div className={[styles['title']].join(' ')}></div>
          <div className={[styles["gameName"], styles[`game${gameSelected}`]].join(' ')}>
            <div className={styles["loading"]}>Loading...</div>
            <div className={styles["zh"]} />
            <div className={styles["en"]} />
          </div>
          <div className={[styles['gacha'], styles['selected'], styles[gameIdxToColor[gameSelected]]].join(' ')}>
            <div className={styles['gachaTop']} />
            <div className={styles['gachaBottom']} />
          </div>
          <div className={[styles['resultWrapper']].join(' ')}>
            <div className={[styles['result'], styles[`result${gameSelected}`]].join(' ')} />
          </div>
        </>}
        {(gameStage === gameStatus.ready || gameStage === gameStatus.started) && <>
          <div className={styles["get-image"]} />
          <div className={styles["set-image"]} />
          <div className={styles["go-image"]} />
          <div onClick={shake}>
            <FanIcon className={[styles["fanIcon"]].join(' ')} colorCodeInHex={playerColorCode} />
          </div>
          {shakeIconArray}
        </>}
        {gameStage === gameStatus.result && <>
          <div className={styles["background"]}>
            <div className={styles["texture"]} />
          </div>
          <div className={styles["splashScreen"]}>
            {new Array(10).fill(0).map((_, idx) => {
              return <div className={[styles["banner-wrapper"], styles[`bannerLot${Math.floor(idx / 5)}`], styles[`bannerType${idx % 5}`]].join(' ')}>
                <div className={styles["banner"]} />
              </div>;
            })}
          </div>
          <div className={styles["title"]} />
          <div className={styles["header"]} />
          <div className={[styles["score"], styles[`digit${score.toString().split('').length}`]].join(' ')}>
            {score.toString().split('').map((chr, idx) => {
              return <span key={idx} className={[styles["number"], styles[`number${chr}`]].join(' ')} />;
            })}
            <div className={styles["unit"]}>km</div>
            <div className={styles["remain"]}>
              <div className={styles["zh"]}>{addCommas(2884 - score)}</div>
              {/* <div className={styles["en"]}>{2884 - score} to go</div> */}
            </div>
          </div>
          <div className={styles["bar-chart"]}>
            <div className={styles["bar"]} style={{
              backgroundColor: playerColorCode,
              width: `${(stageChanging === gameStatus.result? Math.random() * 50 + 50: 0)}%`
            }} />
            <FanIconSmall className={styles["icon"]} colorCodeInHex={playerColorCode} />
          </div>
          <div className={[styles["selected"], styles[`selected${gameSelected}`]].join(' ')} />
          <a className={styles.shareToFb} href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}&quote=I played Shake Shake Game and got ${score} marks !`} target="_blank">
            <div className={styles["face"]}>
                <TextAnimation 
                  duration={500}
                  breakTime={2000}
                  texts={[
                    "立即分享",
                    "Share"
                  ]}
                />
              </div>
              <div className={styles["shadow"]} />
          </a>
        </>}
        {gameStage === gameStatus.offline && <>
          <div className={styles["alertText"]} dangerouslySetInnerHTML={{
            __html: alertText
          }} />
        </>
        }
        <div id={styles["debug"]}>
        {shakeIconArray.length}
        <br />
        {gameStage}
        <br />
        {serverData.d + ' ' + serverData.v}
        </div>
      </div>
    </div>
  );
}

export default MobileHomePage;