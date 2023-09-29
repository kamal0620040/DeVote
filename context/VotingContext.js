import React, { useState, useEffect } from 'react';

import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { VoteAddress, VoteAddressABI } from './constants';

const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_API_KEY_SECRET;
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

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

  const uploadToIPFS = async (file) => {
    const subdomain = 'https://devote.infura-ipfs.io';
    try {
      const added = await client.add({ content: file });
      const URL = `${subdomain}/ipfs/${added.path}`;
      return URL;
    } catch (error) {
      console.log('Error uploading file to IPFS.');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <VoteContext.Provider value={{ name, connectWallet, currentAccount, uploadToIPFS }}>
      {children}
    </VoteContext.Provider>
  );
};
