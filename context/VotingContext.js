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
  const [isAdminState, setIsAdminState] = useState(null);

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
      router.push('/');
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

    await contract.isAdmin().then((result) => setIsAdminState(result)).catch((err) => console.log(err));
  };

  const elections = async (callback) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const filter = contract.filters.ElectionCreated();
    // contract.queryFilter(filter).then((result) => console.log(result)).catch((err) => console.log(err));
    contract.queryFilter(filter).then((result) => getElectionVoteData(contract, result, callback)).catch((err) => console.log(err));
  };

  // eslint-disable-next-line no-shadow
  const getElectionVoteData = async (contract, elections, callback) => {
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
    // console.log(newElections);
    if (callback) {
      callback(newElections);
    }
  };

  const getElectionWithId = async (id) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const dataElection = await contract.getVote(id).then(async (voteData) => {
      const uri = voteData[0];
      const owner = voteData[1];
      // console.log(owner);

      const { electionDetail } = await fetch(uri).then((res) => res.json());
      // console.log(electionDetail);
      return {
        electionDetail,
        owner,
      };
    });
    return dataElection;
  };

  const becomeMemberOfElection = async (elecId, router) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    await contract.sendRequestToBecomeMember(elecId).then(() => alert('Success')).catch(() => alert('Failed'));
    setTimeout(() => {
      router.reload();
    }, [10000]);
  };

  const hadRequestedForElection = async (electionId) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    const result = await contract.hasRequestedMembership(electionId).then((res) => res);
    return result;
  };

  const getRequestedMemberOfElection = async (electionId) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    const result = await contract.getRequestedMembers(electionId).then((res) => res);
    return result;
  };

  const checkCanVote = async (electionId) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    const result = await contract.checkIsReqSenderMember(electionId).then((res) => res);
    return result;
  };

  const acceptRequestToBecomeMember = async (electionId, member, router) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    const result = await contract.acceptRequestToBecomeMember(electionId, member).then(() => 'success').catch(() => 'failed');
    if (result === 'success') {
      setTimeout(() => {
        router.reload();
      }, [10000]);
    }
  };

  const getPk = async () => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    const result = await contract.getCurrentPK().then((res) => res);
    return result;
  };

  const voteCandidate = async (electionId, option, router) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    // const provider = new ethers.BrowserProvider(window.ethereum);

    // who is making this
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    const result = await contract.vote(electionId, option).then(() => 'success').catch(() => 'failed');
    if (result === 'success') {
      setTimeout(() => {
        router.push(`/view-result/${electionId}`);
      }, [10000]);
    } else {
    //   router.push(`/view-result/${electionId}`);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    isAdmin();
    // checkCanVote(0);
    // elections();
    // createVoting('something');
  }, []);

  return (
    <VoteContext.Provider value={{ name, connectWallet, currentAccount, uploadToIPFS, createElection, elections, getElectionWithId, isAdminState, becomeMemberOfElection, hadRequestedForElection, getRequestedMemberOfElection, checkCanVote, acceptRequestToBecomeMember, voteCandidate, getPk }}>
      {children}
    </VoteContext.Provider>
  );
};
