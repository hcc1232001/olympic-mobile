import React, { useEffect, useRef, useState } from 'react';

import './textAnimation.css';

const TextAnimation = ({
  texts,
  textsClass = ['zh', 'en'],
  // delta = 80,
  breakTime = 1500,
  duration = 1000,
}) => {
  const currentTextIdx = useRef(0);
  const timer = useRef(null);
  const subTimers = useRef([]);
  const [textDisplay, setTextDisplay] = useState("");
  useEffect(() => {
    changeText();
    // timer.current = setTimeout(changeText, duration);
    return () => {
      clearTimeout(timer.current);
      while (subTimers.current.length > 0) {
        const subTimer = subTimers.current.pop();
        clearTimeout(subTimer);
      }
    }
  }, []);
  const changeText = (clear) => {
    if (clear) {
      const currentText = texts[currentTextIdx.current];
      const delta = duration / currentText.length;
      for (let i = 0; i < currentText.length; i++) {
        ((i) => {
          subTimers.current.push(setTimeout(() => {
            setTextDisplay(currentText.substr(0, currentText.length - i - 1));
          }, delta * i));
        })(i)
      }
      timer.current = setTimeout(()=>changeText(), duration);
      // timer.current = setTimeout(changeText, breakTime);
      // setTextDisplay("");
    } else {
      currentTextIdx.current = (currentTextIdx.current + 1) % texts.length;
      const currentText = texts[currentTextIdx.current];
      const delta = duration / currentText.length;
      for (let i = 0; i < currentText.length; i++) {
        ((i) => {
          subTimers.current.push(setTimeout(() => {
            setTextDisplay(currentText.substr(0, i + 1));
          }, delta * i));
        })(i)
      }
      timer.current = setTimeout(()=>changeText(true), duration + breakTime);
    }
  }
  return <div className={'animateText ' + (textsClass && textsClass.length? textsClass[currentTextIdx.current]: '')}>{textDisplay}</div>;
}

export default TextAnimation;