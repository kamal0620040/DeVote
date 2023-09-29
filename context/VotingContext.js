import React, { useState, useEffect } from 'react';

import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { VoteAddress, VoteAddressABI } from './constants';

const projectId = process.env.NEXT_PUBLIC_IPFS_API_KEY;
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

const fetchContract = (signerOrProvider) => new ethers.Contract(VoteAddress, VoteAddressABI, signerOrProvider);

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

  const createVoting = async (url, date, options) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    await contract.createElection(url, date, options).then(() => alert('Success')).catch((err) => alert(err));
  };

  const createElection = async (jsonData, date, options, router) => {
    const subdomain = 'https://devote.infura-ipfs.io';
    try {
      const added = await client.add(jsonData);
      const url = `${subdomain}/ipfs/${added.path}`;
      console.log('Data', url);
      await createVoting(url, date, options);
    //   router.push('/');
    } catch (error) {
      console.log(error);
      console.log('Error uploading data to IPFS.');
    }
  };

  const isAdmin = async () => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    await contract.isAdmin().then((result) => console.log('isAdmin', result)).catch((err) => console.log(err));
  };

  const elections = async () => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const filter = contract.filters.ElectionCreated();
    // contract.queryFilter(filter).then((result) => console.log(result)).catch((err) => console.log(err));
    contract.queryFilter(filter).then((result) => getElectionVoteData(contract, result)).catch((err) => console.log(err));
  };

  // eslint-disable-next-line no-shadow
  const getElectionVoteData = async (contract, elections) => {
    const promises = [];
    const newElections = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const election of elections) {
      const { owner, electionId, createdAt, endTime } = election.args;
      const promise = contract.getVote(electionId).then(async (voteData) => {
        const uri = voteData[0];
        if (!uri) return;
        const currentVotes = voteData[2];
        const currentVoteNumbers = currentVotes.map((val) => val.toNumber());

        const newElection = {
          id: electionId.toNumber(),
          owner,
          createdAt: createdAt.toNumber(),
          endTime: endTime.toNumber(),
          totalVotes: currentVoteNumbers.reduce((sum, value) => sum + value, 0),
          votes: currentVoteNumbers,
        };

        try {
          await fetch(uri).then((result) => result.json()).then((res) => {
            newElection.electionDetail = res.electionDetail;
            newElection.candidates = res.candidates;
            newElection.options = res.candidates.length;
            newElections.push(newElection);
          });
        } catch (error) {
          console.log(error);
        }
      });
      promises.push(promise);
    }
    await Promise.all(promises);
    console.log(newElections);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    isAdmin();
    elections();
    // createVoting('something');
  }, []);

  return (
    <VoteContext.Provider value={{ name, connectWallet, currentAccount, uploadToIPFS, createElection }}>
      {children}
    </VoteContext.Provider>
  );
};
