import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Image from 'next/image';

import styles from './Card.module.scss';
import ayalogo from '../../../public/ayalogo.png';
import { getAyaInstance, getStakingInstance, setAyaBalance, setAyaRewards3m, setAyaStaked3m, setInputQuantity3m } from '../../app/actions/staking';



const Card = () => {

  const dispatch = useDispatch();

  const address = useSelector((state) => state.web3.address);

  const mmConnected = useSelector((state) => state.web3.metamask.isConnected);
  const ayaInstance = useSelector((state) => state.staking.ayaInstance);
  const ayaBalance = useSelector((state) => state.staking.ayaBalance);
  const ayaStaked3m = useSelector((state) => state.staking.ayaStaked3m);
  const ayaRewards3m = useSelector((state) => state.staking.ayaRewards3m);
  
  const stakingInstance = useSelector((state) => state.staking.stakingInstance);

  const inputQuantity3m = useSelector((state) => state.staking.inputQuantity3m);


  useEffect(() => {

    if (mmConnected) {
      dispatch(getAyaInstance());
      dispatch(getStakingInstance());
    }

  }, [mmConnected]);

  useEffect(() => {
    const getAyaBalance = async () => {
     
      const balance = await ayaInstance.methods.balanceOf(address).call({from: address})
      const stakedToken = await stakingInstance.methods.getCurrentStake(address, ayaInstance.options.address, 1).call({from: address});
      dispatch(setAyaStaked3m(stakedToken.amount));
      dispatch(setAyaBalance(balance));
    }
    if (ayaInstance) {
      getAyaBalance();
    }

  }, [ayaInstance, address])

  const handleChangeInputQuantity = (e) => {
    const re = /^[0-9\b]+$/;
    if(e.target.value === '' || re.test(e.target.value)) dispatch(setInputQuantity3m(e.target.value));
  }

  const preventMinus = (e) => {
    if (e.code === 'NumpadSubtract') {
        e.preventDefault();
    }
};

  const handleClickUseMax = () => {
    if (ayaBalance > 0) dispatch(setInputQuantity3m(ayaBalance));
    
  }

  const handleClickStakeNow = async (e) => {
    e.preventDefault();
    await stakingInstance.methods.stake(inputQuantity3m, ayaInstance.options.address, 1).send({from: address})
    .on('receipt', () => {
      dispatch(setAyaBalance(ayaBalance-inputQuantity3m));
      dispatch(setAyaStaked3m(inputQuantity3m));
      const rewards = (5*50/100)/(360*24*60*60)*inputQuantity3m;
      dispatch(setAyaRewards3m(rewards));
      dispatch(setInputQuantity3m(''));
    });
  }

  const handleClickCollect = async() => {
    await stakingInstance.methods.claimRewards(1, ayaInstance.options.address).send({from: address})
    .on('receipt', (receipt) => {
      const returnToNumber = Number(receipt.events.rewardClaimed.returnValues.amount);
      const balanceToNumber = Number(ayaBalance);
      const newBalance = returnToNumber + balanceToNumber;
      const newBalanceString = newBalance;
      dispatch(setAyaRewards3m('0'));
      dispatch(setAyaBalance(newBalanceString));
    });
  }

  const handleClickUnstake = async() => {
    await stakingInstance.methods.withdrawTokens(ayaInstance.options.address, 1).send({from: address})
    .on('receipt', (receipt) => {
      const returnToNumber = Number(receipt.events.tokenWithdraw.returnValues.amount);
      const balanceToNumber = Number(ayaBalance);
      const newBalance = returnToNumber + balanceToNumber;
      const newBalanceString = newBalance;
      dispatch(setAyaBalance(newBalanceString));
      dispatch(setAyaStaked3m('0'));
    });
  }

  return(
    <div className={styles.card}>
      <div className={styles.card__img}>
        <Image alt="AYA Token Logo" src={ayalogo} width='100' height='100'/>
      </div>
      <div className={styles.card__desc}>
        <h3 className={styles.card__desc__title}>AYA</h3>
        <p className={styles.card__desc__type}>Lock : 3 months</p>
        <p className={styles.card__desc__apr}>APR : 50%</p>
        <p className={styles.card__desc__balance}>Balance : {ayaBalance} AYA</p>
      </div>
      <form className={styles.card__form}>
      
        <div className={styles.card__form__stake}>
          <input
            min="0"
            onKeyDown={preventMinus}
            className={styles.card__form__stake__input}
            placeholder='Quantity'
            value={inputQuantity3m}
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
        <p className={styles.card__infos__stacked}>Staked : {ayaStaked3m}</p>
        <p className={styles.card__infos__rewards}>Rewards : {ayaRewards3m}</p>
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