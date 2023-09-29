import React from 'react';

const Input = ({ inputType, title, placeholder, handleChange }) => (
  <div className="mt-10 w-full">
    <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-xl">
      {title}
    </p>
    {inputType === 'number' ? (
      <div className="dark:bg-vote-black-1 bg-white border dark:border-vote-black-1 border-vote-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-vote-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
        <input
          type="number"
          className="flex w-full dark:bg-vote-black-1 bg-white outline-none"
          placeholder={placeholder}
          onChange={handleChange}
        />
      </div>
    ) : inputType === 'textarea' ? (
      <textarea
        rows={10}
        className="dark:bg-vote-black-1 bg-white border dark:border-vote-black-1 border-vote-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-vote-gray-2 text-base mt-4 px-4 py-3"
        placeholder={placeholder}
        onChange={handleChange}
      />
    ) : (
      <input
        className="dark:bg-vote-black-1 bg-white border dark:border-vote-black-1 border-vote-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-vote-gray-2 text-base mt-4 px-4 py-3"
        placeholder={placeholder}
        onChange={handleChange}
      />
    )}
  </div>
);

export default Input;
