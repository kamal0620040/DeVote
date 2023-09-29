import React from 'react';
import Image from 'next/image';
// import Link from 'next/link';

import { useRouter } from 'next/router';
import images from '../assets';
import Button from './Button';

const ElectionCard = ({ election }) => {
  const router = useRouter();
  return (
    <div className="flex-1 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-237 dark:bg-vote-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
      <div className="relative w-full h-52 sm:h-26 xs:h-56 mind:h-60 minlg:h-300 rounded-2xl overflow-hidden">
        {election.electionDetail.banner
          ? (
            <Image
              src={election.electionDetail.banner}
              layout="fill"
              objectFit="cover"
              alt="election-banner"
            />
          )
          : (
            <Image
              src={images.defaultVoteCard}
              layout="fill"
              objectFit="cover"
              alt="election-banner"
            />
          )}
      </div>
      <div className="mt-3 flex flex-col">
        <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-sm minlg:text-xl">
          {election.electionDetail.electionName}
        </p>
        <div className="flexBetween mt-3 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
          <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-xs minlg:text-lg">
            {election.options} <span className="normal">Candidates</span>
          </p>
          <Button
            btnName="View Details"
            classStyles="rounded-xl text-xs px-3"
            handleClick={() => {
              router.push(`/election-detail/${election.id}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default ElectionCard;
