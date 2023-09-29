import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import Image from 'next/image';
import { VoteContext } from '../../context/VotingContext';
import { Button } from '../../components';
import images from '../../assets';

const ElectionDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getElectionWithId, isAdminState, becomeMemberOfElection, hadRequestedForElection, getRequestedMemberOfElection, checkCanVote, acceptRequestToBecomeMember, elections } = useContext(VoteContext);
  const [election, setElection] = useState(null);
  const [hasRequested, setHasRequested] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [requestedMemberData, setRequestedMemberData] = useState(null);
  const [overallElectionData, setOverallElectionData] = useState(null);

  useEffect(() => {
    if (id) {
    //   getElectionWithId(id).then((result) => {
    //     setElection(result);
    //   });
      hadRequestedForElection(id).then((result) => {
        setHasRequested(result);
        console.log(result);
      });
      elections(setOverallElectionData);
      console.log(overallElectionData);
    }
  }, [id]);

  useEffect(() => {
    if (overallElectionData) {
      // eslint-disable-next-line eqeqeq
      const result = overallElectionData.find((element) => element.id == id);
      setElection(result);
    }
  }, [overallElectionData]);

  async function getRequestedMember() {
    const result = await getRequestedMemberOfElection(id).then((res) => res);
    setRequestedMemberData(() => result);
    console.log(requestedMemberData);
  }

  async function getCanVote(elecId) {
    const result = await checkCanVote(elecId).then((res) => res);
    setIsMember(result);
  }
  useEffect(() => {
    if (isAdminState === true) {
      getRequestedMember();
    }
    if (isAdminState === false) {
      getCanVote(id);
    }
  }, [isAdminState]);

  if (election == null) {
    return (
      <div>Something went wrong</div>
    );
  }
  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-0 border-r md:border-r-0 md:border-b dark:border-vote-black-1 border-vote-gray-1">
        <div className="relative  minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 w-[400px] h-[250px]">
          <Image src="https://devote.infura-ipfs.io/ipfs/QmPueBVGT1SfGfGswveCkx3opdn2AuvpvYJoEY137Vzrii" objectFit="cover" className=" rounded-xl shadow-lg" layout="fill" />
        </div>
      </div>
      <div>
        <div className="flex-1 justify-start sm:px-4 pt-20 sm:pb-4">
          <div className="flex flex-row sm:flex-col">
            <h2 className="font-poppins dark:text-white text-vote-black-1 font-semibold text-2xl minlg:text-3xl">Election Name</h2>
          </div>

          <div className="mt-10">
            <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-2xl minlg:text-2xl">Creator</p>
            <div className="flex flex-row items-center mt-3">
              <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
                <Image src={images.cross} objectFit="cover" className="rounded-full" />
              </div>
              <p className="font-poppins dark:text-white text-vote-black-1 text-sm minlg:text-lg font-semibold">Sheller Address</p>
            </div>
          </div>
        </div>
        <div className="m-4 my-8">
          {/* <div className="text-xl font-semibold">ElectionDetail</div>
          <div>Election Name: {election.electionDetail.electionName}</div> */}
          {isAdminState
            ? (
              <div>
                <p>Following are the member who have applied for registration</p>
                {requestedMemberData != null
                  ? requestedMemberData.length !== 0
                    ? requestedMemberData.map((val, index) => {
                      if (val !== '0x0000000000000000000000000000000000000000') {
                        return (
                          <div>
                            <span>{index + 1}</span>
                            <span className="ml-20">{val}</span>
                            <Button
                              btnName="Approve"
                              classStyles="ml-20 rounded-lg"
                              handleClick={() => {
                                acceptRequestToBecomeMember(id, requestedMemberData[index]);
                              }}
                            />
                          </div>
                        );
                      }
                    })
                    : <div className="w-[600px] text-center font-poppins font-semibold mt-8">No one in waiting line.</div>
                  : <p>Something went wrong</p>}
              </div>
            )
            : isMember
              ? (
                <div className="text-center text-lg w-[600px]">
                  <p className="mb-12">Your request have been approved you can vote now.</p>
                  <Button btnName="Vote Now" classStyles="rounded-lg" />
                </div>
              )
              : hasRequested
                ? (
                  <div className="w-[600px]">
                    <div className="text-center text-lg ">
                      You have requested to become voter.
                    </div>
                    <div className="text-center text-lg ">
                      Wait till your request get accepted by admin.
                    </div>
                  </div>
                )
                : (
                  <div>
                    <Button btnName="Register" handleClick={() => { becomeMemberOfElection(id); }} />
                  </div>
                )}
        </div>
      </div>
    </div>
  );
};
export default ElectionDetail;
