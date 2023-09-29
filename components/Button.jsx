import React from 'react';

const Button = ({ btnName, classStyles, handleClick }) => <button type="button" onClick={handleClick} className={`vote-gradient text-sm minlg:text-;g py-2 px-6 minlg:px-8 font-poppins font-semibold text-white ${classStyles}`}>{btnName}</button>;

export default Button;
