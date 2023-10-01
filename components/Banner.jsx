import React from 'react';

const Banner = ({ childStyles, parentStyles, banner }) => (
  <div className={`relative w-5/6 flex items-center justify-center z-0 overflow-hidden vote-gradient ${parentStyles}`}>
    <div className="">
      <p className={`font-bold text-4xl font-poppins leading-70 ${childStyles} `}>Empowering Nepal's Democracy</p>
      <p className={`font-normal text-xl text-center font-poppins ${childStyles} `}>Your Voice, Your Vote, Decentralized!</p>
    </div>
    <div className="absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-9 -left-16 -z-5" />
    <div className="absolute w-72 h-72 sm:w-56 sm:h-56 rounded-full white-bg -bottom-24 -right-14 -z-5" />
  </div>
);

export default Banner;
