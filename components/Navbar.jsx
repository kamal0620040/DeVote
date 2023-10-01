import React, { useContext, useState } from 'react';

import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import { VoteContext } from '../context/VotingContext';
import images from '../assets';
import Button from './Button';

const MenuItems = ({ isMobile, active, setActive, isAdminState }) => {
  const generateLink = (i) => {
    switch (i) {
      case 0:
        return '/';
      case 1:
        return '/my-election';
      default:
        return '/';
    }
  };

  return (
    <ul className={`list-none flexCenter flex-row ${isMobile && 'flex-col h-full'}`}>
      {['Home', 'My election'].map((item, idx) => {
        // eslint-disable-next-line no-empty
        if (item === 'My election' && isAdminState) {

        } else {
          return (
            <li key={idx} onClick={() => { setActive(item); }} className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-vote-dark mx-3 ${active === item ? 'dark:text-white text-vote-black-1' : 'dark:text-vote-gray-3 text-vote-gray-2'}`}>
              <Link href={generateLink(idx)}>{item}</Link>
            </li>
          );
        }
      })}
    </ul>
  );
};

const ButtonGroup = ({ setActive, router }) => {
  const { connectWallet, currentAccount, isAdminState } = useContext(VoteContext);

  return currentAccount
    ? isAdminState && (<Button btnName="Create Election" classStyles="mx-2 rounded-xl" handleClick={() => { setActive(''); router.push('/create-election'); }} />)
    : (<Button btnName="Connect" classStyles="mx-2 rounded-xl" handleClick={() => { connectWallet(); }} />);
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [active, setActive] = useState('Home');
  const [isOpen, setIsOpen] = useState(false);
  const { isAdminState } = useContext(VoteContext);

  return (
    <nav className="flexBetween w-full fixed z-10 p-4 px-20 flex-row border-b dark:bg-vote-dark bg-white dark:border-vote-black-1 border-vote-gray-1">
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div className="flexCenter md:hidden cursor-pointer" onClick={() => {}}>
            <Image src={images.logoMain} objectFit="contain" width={16} height={16} />
            <p className="dark:text-white text-vote-black-1 font-semibold text-lg ml-2 mt-1">DeVote</p>
          </div>
        </Link>
        <Link href="/">
          <div className="hidden md:flex" onClick={() => {}}>
            <Image src={images.logoMain} objectFit="contain" width={16} height={16} />
          </div>
        </Link>
      </div>
      <div className="flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2">
          <input type="checkbox" className="checkbox" id="checkbox" onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
          <label htmlFor="checkbox" className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div>
        <div className="md:hidden flex">
          <MenuItems active={active} setActive={setActive} isAdminState={isAdminState} />
          <div className="ml-4">
            <ButtonGroup setActive={setActive} router={router} />
          </div>
        </div>
      </div>
      <div className="hidden md:flex ml-2">
        {
          isOpen ? (
            <Image src={images.cross} objectFit="contain" width={20} height={20} alt="close" onClick={() => setIsOpen(false)} className={theme === 'light' && 'filter invert'} />
          ) : <Image src={images.menu} objectFit="contain" width={25} height={25} alt="menu" onClick={() => setIsOpen(true)} className={theme === 'light' && 'filter invert'} />
        }
        {
          isOpen && (
            <div className="fixed inset-0 top-65 dark:bg-vote-dark bg-white z-10 nav-h flex justify-between flex-col">
              <div className="flex-1 p-4">
                <MenuItems active={active} setActive={setActive} isMobile />
              </div>
              <div className="p-4 border-t dark:border-vote-black-1 border-vote-gray-1">
                <ButtonGroup setActive={setActive} router={router} />
              </div>
            </div>
          )
        }
      </div>
    </nav>
  );
};

export default Navbar;
