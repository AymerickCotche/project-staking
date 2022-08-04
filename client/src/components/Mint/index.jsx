import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Image from 'next/image';

import styles from './Mint.module.scss';
import ayalogo from '../../../public/ayalogo.png';
import { getAyaInstance, setAyaBalance } from '../../app/actions/staking';



const Mint = () => {

  const dispatch = useDispatch();

  const address = useSelector((state) => state.web3.address);

  const mmConnected = useSelector((state) => state.web3.metamask.isConnected);
  const ayaInstance = useSelector((state) => state.staking.ayaInstance);
  const ayaBalance = useSelector((state) => state.staking.ayaBalance);

  useEffect(() => {

    if (mmConnected) {
      dispatch(getAyaInstance());
    }

  }, [mmConnected]);

  const mintToken = async () => {
    await ayaInstance.methods.mint(address, 5000).send({from: address});
  }
  return(
    <div>
      <button onClick={mintToken}>mint</button>
    </div>
  )
};

export default Mint;