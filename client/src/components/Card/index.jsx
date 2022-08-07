import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Image from 'next/image';
import web3 from 'web3';

import styles from './Card.module.scss';
import ayalogo from '../../../public/ayalogo.png';
import { getAyaInstance, getStakingInstance, setAyaBalance, setAyaRewards5s, setAyaStaked5s, setAyaStakedAt5s, setAyaUnlock5s, setHasApproved, setInputQuantity5s } from '../../app/actions/staking';

const BN = web3.utils.BN;

const Card = () => {

  const dispatch = useDispatch();

  const address = useSelector((state) => state.web3.address);

  const mmConnected = useSelector((state) => state.web3.metamask.isConnected);
  const ayaInstance = useSelector((state) => state.staking.ayaInstance);
  const hasApproved = useSelector((state) => state.staking.hasApproved);
  const ayaBalance = useSelector((state) => state.staking.ayaBalance);
  const ayaStaked5s = useSelector((state) => state.staking.ayaStaked5s);
  const ayaRewards5s = useSelector((state) => state.staking.ayaRewards5s);
  const ayaUnlock5s = useSelector((state) => state.staking.ayaUnlock5s);
  const ayaStakedAt5s = useSelector((state) => state.staking.ayaStakedAt5s);

  const stakingInstance = useSelector((state) => state.staking.stakingInstance);

  const inputQuantity5s = useSelector((state) => state.staking.inputQuantity5s);


  useEffect(() => {

    if (mmConnected) {
      dispatch(getAyaInstance());
      dispatch(getStakingInstance());
    }

  }, [mmConnected]);

  useEffect(() => {
    const getAyaBalance = async () => {
     
      const balance = await ayaInstance.methods.balanceOf(address).call({ from: address });
      const stakedToken = await stakingInstance.methods.getCurrentStake(address, ayaInstance.options.address, 2).call({from: address});
      dispatch(setAyaStaked5s(stakedToken.amount));
      if(Number(stakedToken.amount) > 0) {
        const rewards = (15*3110400000/100)/(360*24*60*60)*Number(stakedToken.amount);
        dispatch(setAyaRewards5s(rewards));
        dispatch(setAyaStakedAt5s(Number(stakedToken.time)));
      }
      dispatch(setAyaBalance(balance));
    }
    if (ayaInstance) {
      getAyaBalance();
    }

  }, [ayaInstance, address]);

  useEffect(() => {

    if(ayaUnlock5s > 0 || ayaStakedAt5s > 0) {

      const intervalId = setInterval(() => {
          
        dispatch(setAyaUnlock5s(ayaStakedAt5s + 15 - Math.floor(Date.now() / 1000)));

        if (ayaStakedAt5s + 15 - Math.floor(Date.now() / 1000) <= 0) {
          clearInterval(intervalId);
          dispatch(setAyaUnlock5s('Collect now'));
        }
  
      }, 100);
    }
    
  }, [ayaUnlock5s, ayaStakedAt5s])

  const handleChangeInputQuantity = (e) => {
    const re = /^[0-9\b]+$/;
    if(e.target.value === '' || re.test(e.target.value)) dispatch(setInputQuantity5s(e.target.value));
  }

  const preventMinus = (e) => {
    if (e.code === 'NumpadSubtract') {
        e.preventDefault();
    }
};

  const handleClickUseMax = () => {
    if (ayaBalance > 0) dispatch(setInputQuantity5s(ayaBalance));
    
  }

  const handleClickApproveContract = async () => {
    const maxAmount = new BN("2").pow(new BN("256").sub(new BN("1")));
    await ayaInstance.methods.approve(stakingInstance.options.address, maxAmount.toString()).send({from: address});
    dispatch(setHasApproved(true));
  }

  const handleClickStakeNow = async (e) => {
    e.preventDefault();
    await stakingInstance.methods.stake(inputQuantity5s, ayaInstance.options.address, 2).send({from: address})
    .on('receipt', async (receipt) => {
      const stakedAt = await receipt.events.tokenStaked.returnValues.time;
      dispatch(setAyaBalance(ayaBalance - inputQuantity5s));
      dispatch(setAyaStaked5s(inputQuantity5s));
      const rewards = (15*3110400000/100)/(360*24*60*60)*inputQuantity5s;
      dispatch(setAyaRewards5s(rewards));
      dispatch(setAyaUnlock5s(15));
      dispatch(setAyaStakedAt5s(Number(stakedAt)));
      dispatch(setInputQuantity5s(''));
    });
  }

  const handleClickCollect = async() => {
    await stakingInstance.methods.claimRewards(2, ayaInstance.options.address).send({from: address})
    .on('receipt', (receipt) => {
      const returnToNumber = Number(receipt.events.rewardClaimed.returnValues.amount);
      const balanceToNumber = Number(ayaBalance);
      const newBalance = returnToNumber + balanceToNumber;
      const newBalanceString = newBalance;
      dispatch(setAyaRewards5s(0));
      dispatch(setAyaBalance(newBalanceString));
    });
  }

  const handleClickUnstake = async() => {
    await stakingInstance.methods.withdrawTokens(ayaInstance.options.address, 2).send({from: address})
    .on('receipt', (receipt) => {
      const returnToNumber = Number(receipt.events.tokenWithdraw.returnValues.amount);
      const balanceToNumber = Number(ayaBalance);
      const newBalance = returnToNumber + balanceToNumber;
      const newBalanceString = newBalance;
      dispatch(setAyaBalance(newBalanceString));
      dispatch(setAyaStaked5s('0'));
    });
  }
  return(
    <div className={styles.card}>
      <div className={styles.card__img}>
        <Image alt="AYA Token Logo" src={ayalogo} width='100' height='100'/>
      </div>
      <div className={styles.card__desc}>
        <h3 className={styles.card__desc__title}>AYA</h3>
        <p className={styles.card__desc__type}>Lock : 15 seconds</p>
        <p className={styles.card__desc__apr}>APR : 3110400000%</p>
        <p className={styles.card__desc__balance}>Balance : {ayaBalance} AYA</p>
      </div>
      <div className={styles.card__form}>
      
        <div className={styles.card__form__stake}>
          <input
            min="0"
            onKeyDown={preventMinus}
            className={styles.card__form__stake__input}
            placeholder='Quantity'
            value={inputQuantity5s}
            onChange={handleChangeInputQuantity}
          />
          <p className={styles.card__form__stake__usemax} onClick={handleClickUseMax}>use max</p>
        </div>
        
        {!hasApproved && 
          <button
            className={styles.card__form__btn}
            onClick={handleClickApproveContract}
            disabled={!mmConnected}
          >
            APPROVE CONTRACT
          </button>
        }
        {hasApproved && 
          <button
            className={styles.card__form__btn}
            onClick={handleClickStakeNow}
            disabled={!mmConnected || !inputQuantity5s}
          >
            STAKE NOW
          </button>
        }
      </div>
      <div className={styles.card__infos}>
        <p className={styles.card__infos__stacked}>Staked : {ayaStaked5s}</p>
        <p className={styles.card__infos__rewards}>Rewards : {ayaRewards5s}</p>
        <p className={styles.card__infos__unlock}>Unlock in : {`${ayaUnlock5s && ayaUnlock5s} ${typeof(ayaUnlock5s) === 'number' ? 'seconds': ''}`}</p>

      </div>
      <div className={styles.card__actions}>
        <button
          className={styles.card__actions__collect}
          onClick={handleClickCollect}
          disabled={!mmConnected}
        >
          Collect
        </button>
        <button
          className={styles.card__actions__unstake}
          onClick={handleClickUnstake}
          disabled={!mmConnected}
        >
          Unstake
        </button>
      </div>
      
    </div>
  )
};

export default Card;