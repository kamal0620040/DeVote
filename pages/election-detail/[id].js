import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { VoteContext } from '../../context/VotingContext';
import { Button } from '../../components';

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
    <div className="pt-20">
      <div>ElectionDetail</div>
      <div>Election Name: {election.electionDetail.electionName}</div>
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
                : <p>No one has applied</p>
              : <p>Something went wrong</p>}
          </div>
        )
        : isMember
          ? (
            <div className="text-center text-lg">
              <Button btnName="Vote Now" classStyles="rounded-lg" />
            </div>
          )
          : hasRequested
            ? (
              <div className="text-center text-lg">
                You have requested to become voter. Wait till your request get accepted by admin.
              </div>
            )
            : (
              <div>
                <Button btnName="Register" handleClick={() => { becomeMemberOfElection(id); }} />
              </div>
            )}
    </div>
  );
};
export default ElectionDetail;
