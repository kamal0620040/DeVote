import Webcam from 'react-webcam';
import { useCallback, useRef, useState } from 'react'; // import useCallback
import Button from './Button';

const CustomWebcam = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const retake = () => {
    setImgSrc(null);
  };

  // create a capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  return (
    <div className="container">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam height={600} width={600} ref={webcamRef} />
      )}
      <div className="btn-container">
        {imgSrc ? (
          (<Button btnName="Retake" handleClick={retake} />)
        ) : (
          <Button btnName="Capture" handleClick={capture} />
        )}
      </div>
    </div>
  );
};

export default CustomWebcam;
