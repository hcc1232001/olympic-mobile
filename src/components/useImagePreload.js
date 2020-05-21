import React, {useState, useEffect, useRef} from 'react';

const useImagePreload = (imagesArray) => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [imagesEl, setImagesEl] = useState([]);
  useEffect(() => {
    if (imagesArray.length) {
      imagesArray.forEach(image => {
        const dummyImg = new Image();
        dummyImg.onload = () => {
          requestAnimationFrame(() => setImagesLoaded((prevImagesLoaded) => {
            return prevImagesLoaded + 1;
          }))
        }
        dummyImg.onerror = () => {
          requestAnimationFrame(() => setImagesLoaded((prevImagesLoaded) => {
            return prevImagesLoaded + 1;
          }))
        }
        dummyImg.src = image;
        setImagesEl((prevImagesEl) => {
          return [...prevImagesEl, dummyImg];
        });
      });
    }
  }, [imagesArray]);

  return [imagesArray.length? imagesLoaded / imagesArray.length: 0];
}

export default useImagePreload;