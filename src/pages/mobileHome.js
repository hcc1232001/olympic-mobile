import React, { useState, useEffect, useRef } from 'react';
import {useParams} from 'react-router-dom';
// import useDeviceOrientation from 'components/useDeviceOrientation';
import WaitingIcon from 'components/waitingIcon';
import FanIcon from 'components/fanIcon';
import FanIconSmall from 'components/fanIconSmall';
import ShakeIcon from 'components/shakeIcon';

import useDeviceMotion from 'components/useDeviceMotion';

import withSocketio from 'components/withSocketio';

import config from 'globals/config';

import styles from './mobileHome.module.css';

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

const playerColorCodeOfIdx = [
  "#ed334e",
  "#00652e",
  "#0080C7",
  "#fbb130",
  "#231f20",
];
const MobileHomePage = () => {
  const [{moveCounter, permissionGranted}, {setMoveCounter, setPermissionGranted}] = useDeviceMotion();
  // const [permissionGranted, setPermissionGranted] = useState(false);
  const [gameStage, setGameStage] = useState(gameStatus['idle']);
  const [gameSelected, setGameSelected] = useState(-1);
  const [score, setScore] = useState(0);
  const [alertText, setAlertText] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [stageChanging, setStageChanging] = useState(-1);
  const [playerColorCode, setPlayerColorCode] = useState(playerColorCodeOfIdx[0]);
  const [shakeIconArray, setShakeIconArray] = useState([]);
  const playerId = useParams('playerId');
  const socket = useRef(null);
  const gameWrapper = useRef(null);
  const setGameWrapper = (ref) => gameWrapper.current = ref;
  const requestPermission = () => {
    // setPermissionGranted(true);
    // temp disable
    if (typeof(DeviceOrientationEvent) === "function" && typeof(DeviceOrientationEvent.requestPermission) === "function") {
      // alert('DeviceOrientationEvent.requestPermission');
      DeviceOrientationEvent.requestPermission().then(response => {
          if (response == 'granted') {
            setPermissionGranted(true);
            // window.addEventListener('deviceorientation', onMotion, false);
            // window.addEventListener('deviceorientation', (e) => {
            //   // do something with e
            // })
          } else {
            alert("...");
          }
        })
        .catch(console.error);
    } else {
      setPermissionGranted(true);
      // alert('no DeviceOrientationEvent.requestPermission');
      // window.addEventListener('deviceorientation', onMotion, false);
    }
  };

  const debugByKeyboard = (event) => {
    let isJoinedFlag = true;
    switch (event.key) {
      case "1":
        isJoinedFlag = false;
      case "2":
      case "3":
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
  useEffect(() => {
    document.addEventListener("keyup", debugByKeyboard);
    return () => {
      document.removeEventListener("keyup", debugByKeyboard);
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      setStageChanging(gameStage);
    });
    if (gameStage === gameStatus.ready) {
      setShakeIconArray([]);
    }
  }, [gameStage]);
  const joinRoom = () => {
    if (!permissionGranted) {
      // setPermissionGranted(true);
      requestPermission();
    } else {
      // socket.current.emit('joinRoom', playerId);
    }
  }
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
    if (moveCounter > 2) {
      // socket.current.emit('shake');
      shake();
      setMoveCounter(0);
    }
  }, [moveCounter, gameStage]);
  const shake = () => {
    if (socket.current) {
      socket.current.emit('shake');
    }
    // debugger;
    // if (gameStage === gameStatus.ready || gameStage === gameStatus.started) {
    generateShakeIcon();
    // }
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
        bottom: `${72 + randomY}vw`,
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
    />;
      
    // icon.style = {
    //   bottom: '72vw',
    //   left: '50%',
    //   transform: 'translateX(-50%)',
    //   opacity: 0.8
    // };
    setShakeIconArray((prevShakeIconArray) => {
      return [...prevShakeIconArray, icon];
    })
    // shakeIconArray.current.push(icon);
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
  const setFullscreen = () => {
    if (gameWrapper.current.requestFullscreen) { 
      gameWrapper.current.requestFullscreen({
        navigationUI: "hide"
      });
    }
  }
  return <div ref={setGameWrapper} className={styles.wrapper}>
    {{
      [gameStatus.idle]: (
        <div className={[styles['stage'], styles['stage-idle'], styles['active']].join(' ')}>
          <div className={styles["background"]}>
            <div className={styles["texture"]} />
          </div>
          <div className={[styles["marquee"], styles["marqueeTop"], styles["marqueeIdle"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeLeft"], styles["marqueeIdle"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeBottom"], styles["marqueeIdle"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeRight"], styles["marqueeIdle"]].join(' ')} />
          <div className={styles["title"]} />
          <div className={[styles["counter"], styles["counter1"]].join(' ')}>
            <div className={[styles["background-en"]]} />
            <div className={[styles["background-zh"]]} />
            <span>{2884}</span> km
          </div>
          <div className={[styles["counter"], styles["counter2"]].join(' ')}>
            <div className={[styles["background-en"]]} />
            <div className={[styles["background-zh"]]} />
            <span>10</span>
          </div>
          <div className={styles["logo"]} />
          <div className={styles["join-game"]} onClick={joinRoom}>
            <div className={styles["text-en"]}></div>
            <div className={styles["text-zh"]}></div>
          </div>
        </div>
      ),
      [gameStatus.waiting]: (
        isJoined?
        <div className={[styles['stage'], styles['stage-waiting'], (stageChanging === gameStatus.waiting? styles['active']: null)].join(' ')}>
          <div className={styles["background"]}>
            <div className={styles["texture"]} />
            <WaitingIcon className={[styles["movingIcon"], styles["movingIcon1"]].join(' ')} colorCodeInHex={playerColorCode} />
            <WaitingIcon className={[styles["movingIcon"], styles["movingIcon2"]].join(' ')} colorCodeInHex={playerColorCode} />
            <WaitingIcon className={[styles["movingIcon"], styles["movingIcon3"]].join(' ')} colorCodeInHex={playerColorCode} />
            <WaitingIcon className={[styles["movingIcon"], styles["movingIcon4"]].join(' ')} colorCodeInHex={playerColorCode} />
          </div>
          <div className={[styles["marquee"], styles["marqueeTop"], styles["marqueeWaiting"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeLeft"], styles["marqueeWaiting"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeBottom"], styles["marqueeWaiting"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeRight"], styles["marqueeWaiting"]].join(' ')} />
          {/* <div className={styles.joinButton}>Wait for other players</div> */}
        </div>
        :
        <div className={[styles['stage'], styles['stage-idle']].join(' ')}>
          <div className={styles["background"]}>
            <div className={styles["texture"]} />
          </div>
          <div className={styles["title"]} />
          <div className={[styles["counter"], styles["counter1"]].join(' ')}>
            <div className={[styles["background-en"]]} />
            <div className={[styles["background-zh"]]} />
            <span>{1884}</span> km
          </div>
          <div className={[styles["counter"], styles["counter2"]].join(' ')}>
            <span>10,000,121</span>
          </div>
          <div className={styles["logo"]} />
          <div className={styles["join-game"]} onClick={joinRoom}></div>
        </div>
      ),
      [gameStatus.selecting]: (
        <div className={[styles['stage'], styles['stage-selecting'], (stageChanging === gameStatus.selecting? styles['active']: null), (gameSelected !== -1? styles.selected: null)].join(' ')}>
          <div className={styles["background"]}>
            <div className={styles["texture"]} />
          </div>
          <div className={[styles["marquee"], styles["marqueeTop"], styles["marqueeSelecting"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeLeft"], styles["marqueeSelecting"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeBottom"], styles["marqueeSelecting"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeRight"], styles["marqueeSelecting"]].join(' ')} />
          
          <div className={[styles.buttonsWrapper].join(' ')}>
            {
              new Array(3).fill(0).map((_, idx) => {
                return (
                  <div className={styles.button}>
                    <button onClick={()=>selectGame(idx)} 
                      className={[styles.gameButton, styles[`gameButton${idx}`], (gameSelected === idx? styles.selected: null)].join(' ')}>
                      <div className={styles["contentWrapper"]}>
                        <div className={styles["zh"]} />
                        <div className={styles["en"]} />
                        <div className={styles["ani"]} />
                      </div>
                    </button>
                  </div>
                );
              })
            }
          </div>
        </div>
      ),
      [gameStatus.selected]: (
        <div className={[styles['stage'], styles['stage-selected'], (stageChanging === gameStatus.selected? styles['active']: null)].join(' ')}>
          <div className={styles["background"]}>
            <div className={styles["texture"]} />
          </div>
          <div className={[styles["marquee"], styles["marqueeTop"], styles["marqueeSelecting"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeLeft"], styles["marqueeSelecting"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeBottom"], styles["marqueeSelecting"]].join(' ')} />
          <div className={[styles["marquee"], styles["marqueeRight"], styles["marqueeSelecting"]].join(' ')} />
          <div className={styles["title"]} />
          <div className={[styles["gameName"], styles[`game${gameSelected}`]].join(' ')}>
            <div className={styles["zh"]} />
            <div className={styles["en"]} />
          </div>
          <div className={[styles["gacha"], styles["gachaTop"]].join(' ')} />
          <div className={[styles["gacha"], styles["gachaBottom"]].join(' ')} />
          <div className={[styles["result"], styles[`result${gameSelected}`]].join(' ')} />
        </div>
      ),
      [gameStatus.ready]: (
        <div className={[styles['stage'], styles['stage-ready'], (stageChanging === gameStatus.ready? styles['active']: null)].join(' ')}>
          <div className={styles["background"]} />
          <div className={styles["get-image"]} />
          <div className={styles["set-image"]} />
          <div onClick={shake}>
            <FanIcon className={[styles["fanIcon"]].join(' ')} colorCodeInHex={playerColorCode} />
          </div>
          {shakeIconArray}
        </div>
      ),
      [gameStatus.started]: (
        <div className={[styles['stage'], styles['stage-started'], (stageChanging === gameStatus.started? styles['active']: null)].join(' ')}>
          <div className={styles["background"]} />
          <div className={styles["go-image"]} />
          <div onClick={shake}>
            <FanIcon className={[styles["fanIcon"]].join(' ')} colorCodeInHex={playerColorCode} />
          </div>
          {shakeIconArray}
        </div>
      ),
      [gameStatus.result]: (
        <div className={[styles['stage'], styles['stage-result'], (stageChanging === gameStatus.result? styles['active']: null)].join(' ')}>
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
              <div className={styles["zh"]}>{2884 - score}</div>
              <div className={styles["en"]}>{2884 - score} to go</div>
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
            <div className={styles["zh"]} />
            <div className={styles["en"]} />
          </a>
          {/* <div className={styles.joinButton}>
            <div>Result</div>
            <div className={styles.score}>{score}</div>
            <a className={styles.shareToFb} href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}&quote=I played Shake Shake Game and got ${score} marks !`} target="_blank">
              Share
            </a>
          </div> */}
        </div>
      ),
      [gameStatus.offline]: (
        <div className={styles.joinButton}>
          <div>{alertText}</div>
        </div>
      )
    }[gameStage]}
  </div>;
}

export default MobileHomePage;