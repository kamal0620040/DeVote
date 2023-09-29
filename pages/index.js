import React, { useContext, useEffect, useState } from 'react';
import { VoteContext } from '../context/VotingContext';
import { ElectionCard } from '../components';

const Home = () => {
  const [electionsData, setElectionsData] = useState(null);
  const { elections } = useContext(VoteContext);

  useEffect(() => {
    elections(setElectionsData);
  }, []);

  useEffect(() => {
    console.log(electionsData);
  }, [electionsData]);

  if (electionsData === null) {
    return (
      <div className="pt-24">Nothing to display</div>
    );
  }

  if (electionsData.length === 0) {
    return (
      <div className="pt-24 text-xl font-medium text-center">No Election is condected at the moment.</div>
    );
  }

  return (
    <div className="flex flex-col pt-20 ml-8">
      <p className="font-medium text-lg">Ongoing Election</p>
      <div className="flex">
        {electionsData.map((value, index) => <ElectionCard key={index} election={value} />)}
      </div>
    </div>
  );
};

export default Home;
