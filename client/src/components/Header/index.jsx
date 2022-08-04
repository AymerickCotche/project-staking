
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { connectMetamask, checkMetamaskInstall, checkMetamaskInit, saveChainId, saveAccountAddress, saveWeb3, saveInstance } from '../../app/actions/web3';
import Link from 'next/link';
import Web3 from 'web3';

import Staking from '../../contracts/Staking.json';
import styles from './Header.module.scss';


const Header = () => {

  const dispatch = useDispatch();

  const mmInstalled = useSelector((state) => state.web3.metamask.isInstalled);
  const mmIninitialized = useSelector((state) => state.web3.metamask.isInitialized);
  const errorMessage = useSelector((state) => state.web3.metamask.errorMessage);
  const userAddress = useSelector((state) => state.web3.address);
  const mmConnected = useSelector((state) => state.web3.metamask.isConnected);

  useEffect(() => {
    dispatch(checkMetamaskInstall());
  }, [])

  useEffect(() => {
    if (mmConnected) {
      window.ethereum.on("accountsChanged", () => {
        dispatch(saveAccountAddress());
      });
      window.ethereum.on("chainChanged", () => {
        dispatch(saveChainId(window.ethereum.chainId));
        dispatch(saveAccountAddress());
      });
    }
  }, [mmConnected]);

  const handleClick = () => {
    dispatch(checkMetamaskInit());
    dispatch(connectMetamask());
    dispatch(saveChainId(window.ethereum.chainId));
    const web3 = new Web3(window.ethereum);
    const instance = new web3.eth.Contract(Staking.abi, Staking.networks[42].address);
    dispatch(saveWeb3(web3));
    dispatch(saveInstance(instance));
};

  return (
    <div className={styles.header__container}>
      <header className={styles.header}>
        <h1 className={styles.header__title}>Staking</h1>
        <Link href="/mint">
          <a>Mint Alyra Token</a>
        </Link>
        <div>
        {mmInstalled && !mmConnected &&
          <button
            className={styles.header__btn}
            onClick={handleClick}
          >
            Connect Wallet
          </button>
        }
        {!mmInstalled &&
          <Link  href="https://metamask.io/download/">
            <a className={styles.header__btn}>Click here to install Metamask</a>
          </Link>
        }
        {mmInstalled && mmConnected &&
          <div>
            <p className={styles.header__btn}>{`Address : ${userAddress.slice(0,6)}...${userAddress.slice(-5)}`}</p>
          </div>
          
        }
        {!mmIninitialized && <p>{errorMessage}</p>}
        </div>
      </header>
    </div>
    
  )
};

export default Header;