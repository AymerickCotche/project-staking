import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Image from 'next/image';

import styles from './Card.module.scss';
import ayalogo from '../../../public/ayalogo.png';
import { getAyaInstance, setAyaBalance } from '../../app/actions/staking';



const Card = () => {

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

  useEffect(() => {
    const getAyaBalance = async () => {
     
      const balance = await ayaInstance.methods.balanceOf(address).call({from: address})
      dispatch(setAyaBalance(balance));
    }
    if (ayaInstance) {
      getAyaBalance();
    }

  }, [ayaInstance, address])

  return(
    <div className={styles.card}>
      <div className={styles.card__img}>
        <Image alt="AYA Token Logo" src={ayalogo} width='100' height='100'/>
      </div>
      <div className={styles.card__desc}>
        <h3 className={styles.card__desc__title}>AYA</h3>
        <p className={styles.card__desc__type}>Staking type : Lock</p>
        <p className={styles.card__desc__apr}>APR : 20%</p>
        <p className={styles.card__desc__balance}>Balance : {ayaBalance} AYA</p>
      </div>
      <form className={styles.card__form}>
      
        <div className={styles.card__form__stake}>
          <input type="text" className={styles.card__form__stake__input} placeholder='Quantity'/>
          <p className={styles.card__form__stake__usemax}>use max</p>
        </div>
        
        <button className={styles.card__form__btn}>STAKE NOW</button>
      </form>
      <div className={styles.card__infos}>
        <p className={styles.card__infos__stacked}>Staked : xx</p>
        <p className={styles.card__infos__rewards}>Rewards : xx</p>
        <p className={styles.card__infos__unlock}>Unlock in : xx days</p>

      </div>
      <div className={styles.card__actions}>
        <button className={styles.card__actions__unstake}>Unstake</button>
        <button className={styles.card__actions__collect}>Collect</button>
      </div>
      
    </div>
  )
};

export default Card;