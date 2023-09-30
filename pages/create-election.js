import { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
// import Image from 'next/image';
// import { useTheme } from 'next-themes';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { VoteContext } from '../context/VotingContext';
import { Button, Input } from '../components';
// import images from '../assets';

const CreateElection = () => {
  const [fromInput, setFromInput] = useState({ electionName: '' });
  //   const { theme } = useTheme();
  const router = useRouter();

  const [candidates, setCandidates] = useState([{ name: '', partyName: '', image: '' }, { name: '', partyName: '', image: '' }]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [candidateIndexForImage, setCandidateIndexForImage] = useState(null);
  //  getting uploadToIPFS function from voteContext
  const { uploadToIPFS, createElection, isAdminState } = useContext(VoteContext);

  // function to be used in dropzone when dropped
  const onDropFn = useCallback(async (acceptedFile, func) => {
    // upload image to blockchain aka IPFS
    const index = func();
    const url = await uploadToIPFS(acceptedFile[0]);
    console.log(index, url);
    const data = [...candidates];
    data[index].image = url;
    setCandidates(data);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop: (accepted) => { onDropFn(accepted, () => candidateIndexForImage); },
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

  const handleFeatureChange = (index, event) => {
    console.log(1);
    const data = [...candidates];
    data[index][event.target.name] = event.target.value;
    setCandidates(data);
  };

  const addCandidate = () => {
    const newfield = { name: '', partyName: '', image: '' };
    // candidates.push(newfield);
    setCandidates((prev) => [...prev, newfield]);
  };

  const removeCandidate = (index) => {
    const data = [...candidates];
    data.splice(index, 1);
    setCandidates(data);
  };

  if (!isAdminState) {
    return <div className="p-20">You are not allowded to create election.</div>;
  }

  return (
    <div className="flex justify-center sm:px-4 p-12 pt-24">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-vote-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
          Create Election
        </h1>
        <div className="mt-16">
          <Input
            inputType="input"
            title="Election Name"
            placeholder="Enter election name"
            // spreading the formInput object and replacing what is needed
            handleChange={(e) => {
              setFromInput({ ...fromInput, electionName: e.target.value });
            }}
          />
        </div>

        {/* <Input
          inputType="number"
          title="Number of candidate"
          placeholder="Enter number of candidates"
          // spreading the formInput object and replacing what is needed
          handleChange={(e) => setFromInput({ ...fromInput, name: e.target.value })}
        /> */}
        <div className="mt-8">
          <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-xl">
            Election End Date
          </p>
          <DatePicker
            className="mt-4 dark:bg-vote-black-1 bg-white text-vote-gray-1 p-3 rounded-md"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
          />
        </div>

        <div className="mt-8">
          <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-xl">
            Candidates
          </p>
          {candidates.map((val, index) => (
            <div key={index} className={`flex flex-col justify-center items-center border-vote-gray-2 border-2 border-dotted gap-3 py-4 mt-4 ${index > 0 && 'mt-12'}`}>
              <p className="relative -top-8 bg-vote-black-4 px-2">Candidate {index + 1}</p>
              <div className="flex -mt-8 justify-center items-center gap-3 sm:flex-col">
                <input
                  className="dark:bg-vote-black-1 bg-white border dark:border-vote-black-1 border-vote-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-vote-gray-2 text-base mt-4 px-4 py-3"
                  name="name"
                  placeholder="Name"
                  value={val.name}
                  onChange={(event) => handleFeatureChange(index, event)}
                />

                <input
                  className="dark:bg-vote-black-1 bg-white border dark:border-vote-black-1 border-vote-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-vote-gray-2 text-base mt-4 px-4 py-3"
                  name="partyName"
                  placeholder="Party"
                  value={val.partyName}
                  onChange={(event) => handleFeatureChange(index, event)}
                />

              </div>

              <div className="mt-4">
                <p className="font-poppins dark:text-white text-vote-black-1 font-semibold text-xl">
                  Image
                </p>
                <div
                  className="mt-4 flex flex-c"
                  onMouseMove={() => {
                    setCandidateIndexForImage(index);
                    console.log(index);
                  }}
                >
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
                  {val.image && (
                    <aside>
                      <div>
                        <img
                          src={val.image}
                          alt="file-preview"
                          height={120}
                          width={120}
                        />
                      </div>
                    </aside>
                  )}
                </div>
              </div>
              {/* {feature.length > 1
                        && <Image onClick={() => removeCandidate(index)} src={images.cross} className="hover:cursor-pointer hover:scale-110" />} */}
            </div>
          ))}

          <Button handleClick={addCandidate} btnName="Add more..." classStyles="mt-2 rounded-md py-3 xs:py-2" />
        </div>

        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="Create Election"
            classStyles="rounded-xl"
            handleClick={async () => {
              // create vote
            //   await createvote(fromInput, fileUrl, router);
              const newObj = {
                electionDetail: fromInput,
                candidates,
              };
              await createElection(JSON.stringify(newObj), selectedDate.getTime(), Object.keys(candidates).length, router);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateElection;
