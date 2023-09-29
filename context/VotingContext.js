import React, { useState, useEffect } from 'react';

import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';

import { VoteAddress, VoteAddressABI } from './constants';

export const VoteContext = React.createContext();

export const VoteProvider = ({ children }) => {
  const name = 'Kamal';
  const [currentAccount, setCurrentAccount] = useState('');

  const checkIfWalletIsConnected = async () => {
    // check methamask is installed
    if (!window.ethereum) return alert('Please install metamask');
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }

    console.log(accounts);
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install metamask');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <VoteContext.Provider value={{ name, connectWallet, currentAccount }}>
      {children}
    </VoteContext.Provider>
  );
};
