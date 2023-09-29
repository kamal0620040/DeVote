import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import ProgressBar from '@ramonak/react-progress-bar';
import Image from 'next/image';
import { VoteContext } from '@/context/VotingContext';

const ViewResult = () => {
  const router = useRouter();
  const { id } = router.query;
  const [overallElectionData, setOverallElectionData] = useState(null);
  const [currentElection, setCurrentElection] = useState(null);
  const { elections } = useContext(VoteContext);

  useEffect(() => {
    elections(setOverallElectionData);
  }, []);

  useEffect(() => {
    if (overallElectionData) {
      // eslint-disable-next-line eqeqeq
      const result = overallElectionData.find((element) => element.id == id);
      setCurrentElection(() => result);
      console.log(result);
    }
  }, [overallElectionData]);

  if (currentElection == null || overallElectionData == null) {
    return (
      <div className="p-20">Loading</div>
    );
  }

  return (
    <div className="p-20">
      <div className="text-center font-semibold text-xl font-poppins">Result of {currentElection.electionDetail.electionName}</div>
      <div className="flex flex-col items-center">
        {
            currentElection.candidates.map((val, idx) => (
              <div className="p-2 bg-vote-black-3 m-2 rounded-lg w-2/3">
                <div className="flex justify-around items-center m-2">
                  <div>{val.name}</div>
                  <Image src={val.image} height={100} width={100} className="rounded-lg" />
                </div>
                <ProgressBar completed={(currentElection.votes[idx] / currentElection.totalVotes) * 100} transitionDuration="2s" animateOnRender />
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default ViewResult;
