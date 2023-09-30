import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import Webcam from 'react-webcam';
import { Button, CustomWebcam, Modal } from '@/components';
import images, { PAPNflag,
  DUFflag,
  PLCflag,
  NRPflag,
  RVMflag,
  SJLflag,
  UDFflag,
  NHPflag,
  PVPflag,
  PAMflag } from '../../assets';
import { VoteContext } from '../../context/VotingContext';

const Voting = () => {
  const router = useRouter();
  const { id } = router.query;
  const { elections, voteCandidate, checkCanVote, isAdminState, getPk } = useContext(VoteContext);
  const [currentActiveData, setCurrentActiveData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overallElectionData, setOverallElectionData] = useState(null);
  const [currentElection, setCurrentElection] = useState(null);

  const [votingModel, setVotingModel] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [verified, setVerified] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentPk, setCurrentPk] = useState(null);

  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const retake = () => {
    setImgSrc(null);
  };

  // create a capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    // base64Callback(imgSrc);
    console.log(imageSrc);
    setVerified(true);
    // verifyYourself(imgSrc);
  }, [webcamRef]);
  //   const info = [
  //     {
  //       name: 'A',
  //       partyName: 'B',
  //       image: 'https://devote.infura-ipfs.io/ipfs/QmPueBVGT1SfGfGswveCkx3opdn2AuvpvYJoEY137Vzrii',
  //       flag: 'https://devote.infura-ipfs.io/ipfs/QmVCpTGLxUK8XDRG3EdJft6JzQ1P5DUKe4kM6vqXGKYDfE',

  //     },
  //     {
  //       name: 'C',
  //       partyName: 'D',
  //       image: 'https://devote.infura-ipfs.io/ipfs/QmVCpTGLxUK8XDRG3EdJft6JzQ1P5DUKe4kM6vqXGKYDfE',
  //       flag: 'https://devote.infura-ipfs.io/ipfs/QmPueBVGT1SfGfGswveCkx3opdn2AuvpvYJoEY137Vzrii',
  //     },
  //   ];

  useEffect(() => {
    elections(setOverallElectionData);
  }, []);

  async function getCurrentPk() {
    const result = await getPk().then((res) => res);
    setCurrentPk(() => result);
    // console.log(requestedMemberData);
    // console.log(result);
  }

  useEffect(() => {
    if (overallElectionData) {
      // eslint-disable-next-line eqeqeq
      const result = overallElectionData.find((element) => element.id == id);
      setCurrentElection(() => result);
      console.log(result);
      setCurrentActiveData(result.candidates[currentIndex]);
      getCurrentPk();
    }
  }, [overallElectionData]);

  function handleDecrease() {
    if (currentIndex === 0) {
      setCurrentIndex(currentElection.candidates.length - 1);
      setCurrentActiveData(currentElection.candidates[currentElection.candidates.length - 1]);
    } else {
      setCurrentIndex(currentIndex - 1);
      setCurrentActiveData(currentElection.candidates[currentIndex - 1]);
    }
  }

  function handleIncrease() {
    if (currentIndex === currentElection.candidates.length - 1) {
      setCurrentIndex(0);
      setCurrentActiveData(currentElection.candidates[0]);
    } else {
      setCurrentIndex(currentIndex + 1);
      setCurrentActiveData(currentElection.candidates[currentIndex + 1]);
    }
  }

  async function getCanVote(elecId) {
    const result = await checkCanVote(elecId).then((res) => res);
    setIsMember(result);
    console.log(result);
  }

  function getExtractedBase64(imageData) {
    const startIndex = imageData.indexOf(',') + 1;
    const extractedString = imageData.substring(startIndex);

    return extractedString;
  }

  function flagImage(name) {
    const abbreviation = name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('');
    switch (abbreviation) {
      case 'PAPN':
        return images.PAPNflag;

      case 'DUF':
        return images.DUFflag;

      case 'PLC':
        return images.PLCflag;

      case 'NRP':
        return images.NRPflag;

      case 'RVM':
        return images.RVMflag;

      case 'SJL':
        return images.SJLflag;

      case 'UDF':
        return images.UDFflag;

      case 'NHP':
        return images.NHPflag;

      case 'PVP':
        return images.PVPflag;

      case 'PAM':
        return images.PAMflag;

      default:
        return images.defaultFlag;
    }
  }

  function verifyYourself(imageData) {
    // get webcame image in base64
    console.log(imageData);
    // fetch the currentImage using private key
    // send both above image to image similarity function
    axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/api/imgs`,
      data: JSON.stringify({
        img1: base64Image ? getExtractedBase64(base64Image) : getExtractedBase64(imageData),
        img2: currentImage,
      }),
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        // setTimeout(() => {
        //   router.push(`/election-detail/${id}`, undefined, { shallow: true });
        // }, 1000);
        console.log('result', response.Result);
        // setVerified();
      })
      .catch((err) => {
        console.log(err);
      });
    // is it returns true then set isVerified to true else false
  }

  useEffect(() => {
    if (base64Image) {
      verifyYourself(base64Image);
    }
  }, [base64Image]);

  useEffect(() => {
    if (currentPk != null) {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/credentials/${id.toString() + currentPk}`, {
        accept: 'application/json',
        'Content-Type': 'application/json',
      }).then((response) => {
        console.log(response);
        setCurrentImage(response.data.currentPhoto);
        // setRequestedMemberImageData([...requestedMemberImageData, response.data]);
        // console.log([...requestedMemberImageData, response.data]);
        // console.log(response);
      }).catch((e) => {
        console.log(e);
      });
    }
  }, [currentPk]);

  useEffect(() => {
    if (isAdminState === false) {
      getCanVote(id);
    }
  }, [isAdminState]);

  if (currentActiveData == null || currentElection == null || overallElectionData == null) {
    return (
      <div className="p-20">Loading</div>
    );
  }

  if (!isMember) {
    return (
      <div className="p-20 text-center pt-40 text-xl font-semibold">You are not allowed to vote.</div>
    );
  }

  return (
    <div className="p-20">
      <div className="flex flex-col justify-center items-center">
        <Image src={currentElection.candidates[currentIndex].image} width={500} height={400} alt="person" className="rounded-lg" />
        <Image src={flagImage(currentElection.candidates[currentIndex].partyName)} width={100} height={100} alt="flag" className="border-gray-400 border-2 rounded-lg absolute top-20" />
        <div className="flex p-4">
          <Image src={images.left} className="mr-20" onClick={() => { handleDecrease(); }} width={30} height={30} />
          <Image src={images.right} width={30} onClick={() => { handleIncrease(); }} height={30} />
        </div>
        <div className="flex p-4 gap-20 justify-center">
          <div>
            <p className="font-poppins font-normal">Name of candidate:</p>
            <p className="font-poppins font-semibold text-xl">{currentElection.candidates[currentIndex].name}</p>
          </div>
          <div>
            <p className="font-poppins font-normal">Political party:</p>
            <p className="font-poppins font-semibold text-xl">{currentElection.candidates[currentIndex].partyName}</p>
          </div>
          {verified
            ? <Button btnName="Vote" classStyles="rounded-lg  ml-4" handleClick={() => { voteCandidate(currentElection.id, currentIndex, router); }} />
            : <Button btnName="Verify Yourself" classStyles="rounded-lg ml-4" handleClick={() => { setVotingModel(true); }} />}
        </div>
      </div>
      { votingModel
      && (
      <Modal
        header="Verify Yourself"
        body={(
          <div className="flexCenter flex-col text-center" onClick={() => setVotingModel(false)}>
            <div className="container">
              {imgSrc ? (
                <img src={imgSrc} alt="webcam" />
              ) : (
                <Webcam height={600} width={600} ref={webcamRef} screenshotFormat="image/jpeg" screenshotQuality={0.6} className="rounded-lg mb-2" />
              )}
              <div className="btn-container">
                {imgSrc ? (
                  (<Button btnName="Retake" handleClick={retake} classStyles="rounded-lg" />)
                ) : (
                  <Button btnName="Capture and verify" handleClick={capture} classStyles="rounded-lg" />
                )}
              </div>
            </div>
          </div>
          )}
        // footer={}
        handleClose={() => { setVotingModel(false); }}
      />
      )}
    </div>
  );
};

export default Voting;
