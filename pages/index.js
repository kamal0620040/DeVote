import React, { useContext, useEffect, useState } from 'react';
import { VoteContext } from '../context/VotingContext';
import { ElectionCard, Banner } from '../components';

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
    <div className="flex flex-col items-center pt-20 ml-8">
      <Banner childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left" parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl" />
      <div>
        <p className="font-medium text-xl ml-8">Ongoing Election</p>
        <div className="flex">
          {electionsData.map((value, index) => <ElectionCard key={index} election={value} />)}
        </div>
      </div>
    </div>
  );
};

export default Home;
