/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

const CarouselComponent = ({ children: info }) => {
  const [currIndex, setCurrIndex] = useState(0);

  // console.log('From Carousel Component');
  // console.log(info);

  function prev() {
    if (currIndex === 0) {
      setCurrIndex(info.length - 1);
    } else {
      setCurrIndex(currIndex - 1);
    }
  }

  function next() {
    if (currIndex === info.length - 1) {
      setCurrIndex(0);
    } else {
      setCurrIndex(currIndex + 1);
    }
  }

  return (
    <div className="overflow-hidden relative mx-48 mt-20">
      {/* <div className="text-2xl">VOTING</div> */}
      <div
        className="z-50 flex transition-transform ease-out duration-700"
        style={{ transform: `translateX(-${currIndex * 100}%)` }}
      >
        {info}
      </div>

      {/* navigation section buttons */}

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          type="button"
          onClick={prev}
          className="bg-white/[.6] rounded-full hover:bg-white"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={next}
          className="bg-white/[.6] rounded-full hover:bg-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="flex  justify-center mt-4 bottom-4 right-0 left-0">
        Indicators here
      </div>
    </div>
  );
};

export default CarouselComponent;
