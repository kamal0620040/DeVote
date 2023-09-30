import Webcam from 'react-webcam';
import { useCallback, useRef, useState } from 'react'; // import useCallback
import Button from './Button';

const CustomWebcam = ({ base64Callback, verifyCallback }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const retake = () => {
    setImgSrc(null);
  };

  // create a capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    base64Callback(imgSrc);
    console.log(imageSrc);
    // verifyCallback(imgSrc);
  }, [webcamRef]);

  return (
    <div className="container">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam height={600} width={600} ref={webcamRef} className="rounded-lg mb-2" />
      )}
      <div className="btn-container">
        {imgSrc ? (
          (<Button btnName="Retake" handleClick={retake} classStyles="rounded-lg" />)
        ) : (
          <Button btnName="Capture" handleClick={capture} classStyles="rounded-lg" />
        )}
      </div>
    </div>
  );
};

export default CustomWebcam;
