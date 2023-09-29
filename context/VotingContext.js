import React, { useState, useEffect } from 'react';

import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';

import { VoteAddress, VoteAddressABI } from './constants';

export const VoteContext = React.createContext();

export const VoteProvider = ({ children }) => {
  const name = 'Kamal';
  return (
    <VoteContext.Provider value={{ name }}>
      {children}
    </VoteContext.Provider>
  );
};
