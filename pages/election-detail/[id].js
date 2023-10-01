import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { VoteContext } from '../../context/VotingContext';
import { Button } from '../../components';
import images from '../../assets';

const ElectionDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getElectionWithId, isAdminState, becomeMemberOfElection, hadRequestedForElection, getRequestedMemberOfElection, checkCanVote, acceptRequestToBecomeMember, elections, getPk } = useContext(VoteContext);
  const [election, setElection] = useState(null);
  const [hasRequested, setHasRequested] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [requestedMemberData, setRequestedMemberData] = useState(null);
  const [requestedMemberImageData, setRequestedMemberImageData] = useState([]);
  const [overallElectionData, setOverallElectionData] = useState(null);
  //   const [imageDataArray, setImageDataArray] = useState(null);
  const [imageData, setImageData] = useState({ citizenshipImage: '', currentImage: '' });
  const [citizenshipImage, setCitizenshipImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [imageDataKey, setImageDataKey] = useState(null);
  const [currentPk, setCurrentPk] = useState(null);

  const uploadToCloudinary = async (image) => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'localmart');
    data.append('cloud_name', 'dcmsjwslq');
    const res = await fetch('https://api.cloudinary.com/v1_1/dcmsjwslq/image/upload', {
      method: 'post',
      body: data,
    });

    const result = await res.json();
    // console.log(result.url);
    return result.url;
  };

  async function getCurrentPk() {
    const result = await getPk().then((res) => res);
    setCurrentPk(() => result);
    // console.log(requestedMemberData);
    // console.log(result);
  }

  useEffect(() => {
    if (id) {
    //   getElectionWithId(id).then((result) => {
    //     setElection(result);
    //   });
      hadRequestedForElection(id).then((result) => {
        setHasRequested(result);
        console.log(result);
      });
      elections(setOverallElectionData);
      console.log(overallElectionData);
      getCurrentPk();
    }
  }, [id]);

  useEffect(() => {
    if (overallElectionData) {
      // eslint-disable-next-line eqeqeq
      const result = overallElectionData.find((element) => element.id == id);
      setElection(result);
    }
  }, [overallElectionData]);

  async function getRequestedMember() {
    const result = await getRequestedMemberOfElection(id).then((res) => res);
    setRequestedMemberData(() => result);
  }

  useEffect(() => {
    if (requestedMemberData !== null) {
      requestedMemberData.map((val) => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/credentials/${id.toString() + val}`, {
          accept: 'application/json',
          'Content-Type': 'application/json',
        }).then((response) => {
          setRequestedMemberImageData([...requestedMemberImageData, response.data]);
          console.log([...requestedMemberImageData, response.data]);
          console.log(response);
        }).catch((e) => {
          console.log(e);
        });
      });
    }
  }, [requestedMemberData]);

  async function getCanVote(elecId) {
    const result = await checkCanVote(elecId).then((res) => res);
    setIsMember(result);
  }

  // function to be used in dropzone when dropped
  //   const onDropFn = useCallback(async (acceptedFile, func) => {
  // upload image to blockchain aka IPFS
  // const index = func();
  // const url = await uploadToIPFS(acceptedFile[0]);
  // console.log(index, url);
  // const data = [...candidates];
  // data[index].image = url;
  // setCandidates(data);
  //   }, []);

  const updateImageData = (keyData, url) => {
    const newObj = { ...imageData };
    newObj[keyData] = url;
    setImageData(() => newObj);
    if (keyData === 'citizenshipImage') {
      setCitizenshipImage(() => url);
    } else if (keyData === 'currentImage') {
      setCurrentImage(() => url);
    }
    console.log(citizenshipImage);
    // setImageData({ ...imageData, [keyData]: url });
    // console.log({ ...imageData, [keyData]: url });
  };
  const onDropFn = useCallback(async (acceptedFile, fn) => {
    // upload image to the cloudinary
    const keyData = fn();
    const url = await uploadToCloudinary(acceptedFile[0]);
    // console.log(url);
    updateImageData(keyData, url);
    // setImageData({ ...imageData, [keyData]: url });
    // console.log({ ...imageData, [keyData]: url });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop: (accepted) => { onDropFn(accepted, () => imageDataKey); },
    accept: 'image/*',
    maxSize: 5000000,
  });

  const fileStyle = useMemo(() => (
    `dark:bg-vote-black-1 bg-white border dark:border-white border-vote-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
      ${isDragActive ? ' border-file-active ' : ''} 
      ${isDragAccept ? ' border-file-accept ' : ''} 
      ${isDragReject ? ' border-file-reject ' : ''}
    `
  ), [isDragActive, isDragAccept, isDragReject]);

  const returnDate = (timestamp) => {
    const d = new Date(timestamp);
    return d.toISOString();
  };

  useEffect(() => {
    if (isAdminState === true) {
      getRequestedMember();
    }
    if (isAdminState === false) {
      getCanVote(id);
    }
  }, [isAdminState]);

  if (election == null) {
    return (
      <div>Something went wrong</div>
    );
  }

  if (requestedMemberImageData.length === 0 && requestedMemberData != null && requestedMemberData > 0) {
    return (
      <div>Loading</div>
    );
  }
  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-0 border-r md:border-r-0 md:border-b dark:border-vote-black-1 border-vote-gray-1">
        <div className="relative  minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 w-[600px] h-[350px]">
          <Image src={images.defaultPost} objectFit="cover" className=" rounded-xl shadow-lg" layout="fill" />
        </div>
      </div>
      <div>
        <div className="flex-1 justify-start sm:px-4 pt-20 sm:pb-4">
          <div className="flex flex-row sm:flex-col">
            <h2 className="font-poppins dark:text-white text-vote-black-1 font-semibold text-2xl minlg:text-3xl">{election.electionDetail.electionName}</h2>
          </div>

          <div className="mt-10">
            <p className="font-poppins dark:text-white text-vote-black-1 font-normal text-xl minlg:text-2xl">Creator</p>
            <div className="flex flex-row items-center  mt-3">
              <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
                <Image src={images.cross} height={30} objectFit="cover" className="rounded-full" />
              </div>
              <p className="font-poppins -mt-5 dark:text-white text-vote-black-1 text-sm minlg:text-lg font-semibold">{`${election.owner.substring(0, 8)}...`}</p>
            </div>
            <div>Ends on: {returnDate(election.endTime)}</div>
          </div>
        </div>
        <div className="m-4 my-8">
          {/* <div className="text-xl font-semibold">ElectionDetail</div>
          <div>Election Name: {election.electionDetail.electionName}</div> */}
          {isAdminState
            ? (
              <div className="w-[600px]">
                <p>Following are the member who have applied for registration</p>
                {requestedMemberData != null
                  ? requestedMemberData.length !== 0
                    ? requestedMemberData.map((val, index) => {
                      if (val !== '0x0000000000000000000000000000000000000000') {
                        return (
                          <div className="flex gap-4 justify-center items-center">
                            <div>{index + 1}</div>
                            <div className="">{`${val.substring(0, 6)}...`}</div>
                            <Image src={requestedMemberImageData[index].citizenshipImage} height={80} width={80} />
                            <Image src={requestedMemberImageData[index].currentPhoto} height={80} width={80} />
                            <Button
                              btnName="Approve"
                              classStyles="ml-20 rounded-lg"
                              handleClick={() => {
                                acceptRequestToBecomeMember(id, requestedMemberData[index], router);
                              }}
                            />
                          </div>
                        );
                      }
                    })
                    : <div className="w-[600px] text-center font-poppins font-semibold mt-8">No one in waiting line.</div>
                  : <p>Something went wrong</p>}
              </div>
            )
            : isMember
              ? (
                <div className="text-center text-lg w-[600px]">
                  <p className="mb-12">Your request have been approved you can vote now.</p>
                  <Button
                    btnName="Vote Now"
                    classStyles="rounded-lg"
                    handleClick={() => {
                      router.push(`/voting/${id}`);
                    }}
                  />
                </div>
              )
              : hasRequested
                ? (
                  <div className="w-[600px]">
                    <div className="text-center text-lg ">
                      You have requested to become voter.
                    </div>
                    <div className="text-center text-lg ">
                      Wait till your request get accepted by admin.
                    </div>
                  </div>
                )
                : (
                  <div className="w-[600px]">
                    <div>

                      <div className="mt-4">
                        <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-xl">
                          Citizenship Image
                        </p>
                        <div className="mt-4 flex flex-c" onMouseMove={() => { setImageDataKey('citizenshipImage'); }}>
                          {/* spreading props provided by getRootProps from the useDropzone hook */}
                          <div
                            {...getRootProps()}
                            className={fileStyle}
                          >
                            <input {...getInputProps()} />
                            <div className="flexCenter flex-col text-center">
                              <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-sm">
                                Drag and Drop File
                              </p>
                              <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-sm mt-2">
                                or Browser media on your device
                              </p>

                            </div>
                          </div>
                          {citizenshipImage !== null && (
                          <aside>
                            <div>
                              <img
                                src={citizenshipImage}
                                alt="file-preview"
                                height={60}
                                width={60}
                              />
                            </div>
                          </aside>
                          )}
                          {/* {imageData.citizenshipImage !== '' && (
                          <aside>
                            <div>
                              <img
                                src={imageData.citizenshipImage}
                                alt="file-preview"
                                height={60}
                                width={60}
                              />
                            </div>
                          </aside>
                          )} */}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-xl">
                          Current Image
                        </p>
                        <div className="mt-4 flex flex-c" onMouseMove={() => { setImageDataKey('currentImage'); }}>
                          {/* spreading props provided by getRootProps from the useDropzone hook */}
                          <div
                            {...getRootProps()}
                            className={fileStyle}
                          >
                            <input {...getInputProps()} />
                            <div className="flexCenter flex-col text-center">
                              <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-sm">
                                Drag and Drop File
                              </p>
                              <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-sm mt-2">
                                or Browser media on your device
                              </p>

                            </div>
                          </div>
                          {currentImage !== null && (
                          <aside>
                            <div>
                              <img
                                src={currentImage}
                                alt="file-preview"
                                height={60}
                                width={60}
                              />
                            </div>
                          </aside>
                          )}
                          {/* {imageData.currentImage !== '' && (
                          <aside>
                            <div>
                              <img
                                src={imageData.currentImage}
                                alt="file-preview"
                                height={60}
                                width={60}
                              />
                            </div>
                          </aside>
                          )} */}
                        </div>
                      </div>
                    </div>
                    <Button
                      btnName="Register"
                      classStyles="mt-10 rounded-lg"
                      handleClick={() => {
                        becomeMemberOfElection(id, router);
                        // console.log('citizen', citizenshipImage);
                        // console.log('current', currentImage);
                        axios({
                          method: 'POST',
                          url: `${process.env.NEXT_PUBLIC_BACKEND_API}/api/credentials/create/private`,
                          data: JSON.stringify({
                            privatekey: id.toString() + currentPk,
                            citizenshipImage,
                            currentPhoto: imageData.currentImage,
                          }),
                          headers: {
                            accept: 'application/json',
                            'Content-Type': 'application/json',
                          },
                        })
                          .then(() => {
                            // setTimeout(() => {
                            //   router.reload();
                            // //   router.push(`/election-detail/${id}`, undefined, { shallow: true });
                            // }, 10000);
                            console.log('Success');
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    />
                  </div>
                )}
        </div>
      </div>
    </div>
  );
};
export default ElectionDetail;
