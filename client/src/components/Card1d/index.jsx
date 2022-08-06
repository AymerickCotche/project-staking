import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Image from 'next/image';

import styles from './Card.module.scss';
import ayalogo from '../../../public/ayalogo.png';
import { getAyaInstance, getStakingInstance, setAyaBalance, setAyaStaked1d, setInputQuantity1d } from '../../app/actions/staking';



const Card = () => {

  const dispatch = useDispatch();

  const address = useSelector((state) => state.web3.address);

  const mmConnected = useSelector((state) => state.web3.metamask.isConnected);
  const ayaInstance = useSelector((state) => state.staking.ayaInstance);
  const ayaBalance = useSelector((state) => state.staking.ayaBalance);
  const ayaStaked1d = useSelector((state) => state.staking.ayaStaked1d);
  const ayaRewards1d = useSelector((state) => state.staking.ayaRewards1d);

  const stakingInstance = useSelector((state) => state.staking.stakingInstance);

  const inputQuantity1d = useSelector((state) => state.staking.inputQuantity1d);


  useEffect(() => {

    if (mmConnected) {
      dispatch(getAyaInstance());
      dispatch(getStakingInstance());
    }

  }, [mmConnected]);

  useEffect(() => {
    const getAyaBalance = async () => {
     
      const balance = await ayaInstance.methods.balanceOf(address).call({from: address});
      const stakedToken = await stakingInstance.methods.getCurrentStake(address, ayaInstance.options.address, 0).call({from: address});
      dispatch(setAyaStaked1d(stakedToken.amount));
      dispatch(setAyaBalance(balance));
    }
    if (ayaInstance) {
      getAyaBalance();
    }

  }, [ayaInstance, address])

  const handleChangeInputQuantity = (e) => {
    const re = /^[0-9\b]+$/;
    if(e.target.value === '' || re.test(e.target.value)) dispatch(setInputQuantity1d(e.target.value));
  }

  const preventMinus = (e) => {
    if (e.code === 'NumpadSubtract') {
        e.preventDefault();
    }
};

  const handleClickUseMax = () => {
    if (ayaBalance > 0) dispatch(setInputQuantity1d(ayaBalance));
    
  }
  const handleClickStakeNow = async (e) => {
    e.preventDefault();
    await stakingInstance.methods.stake(inputQuantity1d, ayaInstance.options.address, 0).send({from: address})
    .on('receipt', () => {
      dispatch(setAyaBalance(ayaBalance-inputQuantity1d));
      dispatch(setAyaStaked1d(inputQuantity1d));
      const rewards = (5*22/100)/(360*24*60*60)*inputQuantity1d;
      dispatch(setAyaRewards5s(rewards));
      dispatch(setInputQuantity1d(''));
    });
  }

  const handleClickCollect = async() => {
    await stakingInstance.methods.claimRewards(0, ayaInstance.options.address).send({from: address})
    .on('receipt', (receipt) => {
      const returnToNumber = Number(receipt.events.rewardClaimed.returnValues.amount);
      const balanceToNumber = Number(ayaBalance);
      const newBalance = returnToNumber + balanceToNumber;
      const newBalanceString = newBalance;
      dispatch(setAyaRewards5s('0'));
      dispatch(setAyaBalance(newBalanceString));
    });
  }

  const handleClickUnstake = async() => {
    await stakingInstance.methods.withdrawTokens(ayaInstance.options.address, 0).send({from: address})
    .on('receipt', (receipt) => {
      const returnToNumber = Number(receipt.events.tokenWithdraw.returnValues.amount);
      const balanceToNumber = Number(ayaBalance);
      const newBalance = returnToNumber + balanceToNumber;
      const newBalanceString = newBalance;
      dispatch(setAyaBalance(newBalanceString));
      dispatch(setAyaStaked1d('0'));
    });
  }

  return(
    <div className={styles.card}>
      <div className={styles.card__img}>
        <Image alt="AYA Token Logo" src={ayalogo} width='100' height='100'/>
      </div>
      <div className={styles.card__desc}>
        <h3 className={styles.card__desc__title}>AYA</h3>
        <p className={styles.card__desc__type}>Lock : 1 day</p>
        <p className={styles.card__desc__apr}>APR : 22%</p>
        <p className={styles.card__desc__balance}>Balance : {ayaBalance} AYA</p>
      </div>
      <form className={styles.card__form}>
      
        <div className={styles.card__form__stake}>
          <input
            min="0"
            onKeyDown={preventMinus}
            className={styles.card__form__stake__input}
            placeholder='Quantity'
            value={inputQuantity1d}
            onChange={handleChangeInputQuantity}
          />
          <p className={styles.card__form__stake__usemax} onClick={handleClickUseMax}>use max</p>
        </div>
        
        <button
          className={styles.card__form__btn}
          onClick={handleClickStakeNow}
        >
          STAKE NOW
        </button>
      </form>
      <div className={styles.card__infos}>
        <p className={styles.card__infos__stacked}>Staked : {ayaStaked1d}</p>
        <p className={styles.card__infos__rewards}>Rewards : {ayaRewards1d}</p>
        <p className={styles.card__infos__unlock}>Unlock in : xx days</p>

      </div>
      <div className={styles.card__actions}>
        <button className={styles.card__actions__unstake} onClick={handleClickUnstake}>Unstake</button>
        <button className={styles.card__actions__collect} onClick={handleClickCollect}>Collect</button>
      </div>
      
    </div>
  )
};

export default Card;