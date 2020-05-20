import React, { useEffect, useRef, useState } from 'react';

const TextAnimation = ({
  texts,
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
      currentTextIdx.current = (currentTextIdx.current + 1) % texts.length;
      // setTextDisplay("");
    } else {
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
  return <>{textDisplay}</>;
}

export default TextAnimation;