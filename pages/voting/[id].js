import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import CarouselComponent from '@/components/carouselComponent';
import { Button } from '@/components';
import images from '../../assets';
import { VoteContext } from '../../context/VotingContext';

const Voting = () => {
  const router = useRouter();
  const { id } = router.query;
  const { elections, voteCandidate } = useContext(VoteContext);
  const [currentActiveData, setCurrentActiveData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overallElectionData, setOverallElectionData] = useState(null);
  const [currentElection, setCurrentElection] = useState(null);

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

  useEffect(() => {
    if (overallElectionData) {
      // eslint-disable-next-line eqeqeq
      const result = overallElectionData.find((element) => element.id == id);
      setCurrentElection(() => result);
      console.log(result);
      setCurrentActiveData(result.candidates[currentIndex]);
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

  if (currentActiveData == null || currentElection == null || overallElectionData == null) {
    return (
      <div className="p-20">Loading</div>
    );
  }

  return (
    <div className="p-20">
      <div className="flex flex-col justify-center items-center">
        <Image src={currentElection.candidates[currentIndex].image} width={600} height={500} alt="something" className="rounded-lg" />
        <Image src={currentElection.candidates[currentIndex].image} width={100} height={100} alt="something" className="border-gray-400 border-2 rounded-lg absolute top-20" />
        <div className="flex p-4">
          <Image src={images.left} className="mr-10" onClick={() => { handleDecrease(); }} width={30} height={30} />
          <Image src={images.right} width={30} onClick={() => { handleIncrease(); }} height={30} />
        </div>
        <div className="flex p-4">
          <p className="font-poppins font-semibold text-xl">{currentElection.candidates[currentIndex].name}</p>
          <p className="font-poppins font-semibold text-xl">{currentElection.candidates[currentIndex].partyName}</p>
          <Button btnName="Vote" classStyles="rounded-lg  ml-4" handleClick={() => { voteCandidate(id, currentIndex); }} />
        </div>
      </div>
    </div>
  );
};

export default Voting;
