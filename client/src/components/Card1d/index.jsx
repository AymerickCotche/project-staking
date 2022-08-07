import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Image from 'next/image';
import web3 from 'web3';

import styles from './Card.module.scss';
import ayalogo from '../../../public/ayalogo.png';
import { getAyaInstance, getStakingInstance, setAyaBalance, setAyaRewards1d, setAyaStaked1d, setAyaStakedAt1d, setAyaUnlock1d, setHasApproved, setInputQuantity1d } from '../../app/actions/staking';

const BN = web3.utils.BN;

const Card1d = () => {

  const dispatch = useDispatch();

  const address = useSelector((state) => state.web3.address);

  const mmConnected = useSelector((state) => state.web3.metamask.isConnected);
  const ayaInstance = useSelector((state) => state.staking.ayaInstance);
  const hasApproved = useSelector((state) => state.staking.hasApproved);
  const ayaBalance = useSelector((state) => state.staking.ayaBalance);
  const ayaStaked1d = useSelector((state) => state.staking.ayaStaked1d);
  const ayaRewards1d = useSelector((state) => state.staking.ayaRewards1d);
  const ayaUnlock1d = useSelector((state) => state.staking.ayaUnlock1d);
  const ayaStakedAt1d = useSelector((state) => state.staking.ayaStakedAt1d);

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
      if(Number(stakedToken.amount) > 0) {
        const rewards = Math.round((86400*22/100)/(360*24*60*60)*Number(stakedToken.amount) * 100) / 100;
        dispatch(setAyaRewards1d(rewards));
        dispatch(setAyaStakedAt1d(Number(stakedToken.time)));
      }
      dispatch(setAyaBalance(balance));
      const approvedEvents = await ayaInstance.getPastEvents('approved',  { fromBlock: 33159719, toBlock: 'latest'});
      console.log(approvedEvents);
      const userEvent = approvedEvents.find((approvedEvent) => (
        approvedEvent.returnValues.owner.toLowerCase() === address
      ))
      if(userEvent) {
        dispatch(setHasApproved(true));
      }
    }
    if (ayaInstance) {
      getAyaBalance();
    }

  }, [ayaInstance, address]);

  useEffect(() => {

    if(ayaUnlock1d > 0 || ayaStakedAt1d > 0) {

      const interval1d = setInterval(() => {
          
        dispatch(setAyaUnlock1d(Math.round((ayaStakedAt1d + 86400 - Math.floor(Date.now() / 1000)) / 3600)));

        if (ayaStakedAt1d + 86400 - Math.floor(Date.now() / 1000) <= 0) {
          clearInterval(interval1d);
          dispatch(setAyaUnlock1d('Collect now'));
        }
  
      }, 100);
    }
    
  }, [ayaUnlock1d, ayaStakedAt1d])

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

  const handleClickApproveContract = async () => {
    const maxAmount = new BN("2").pow(new BN("256").sub(new BN("1")));
    await ayaInstance.methods.approve(stakingInstance.options.address, maxAmount.toString()).send({from: address});
    dispatch(setHasApproved(true));
  }
  
  const handleClickStakeNow = async (e) => {
    e.preventDefault();
    await stakingInstance.methods.stake(inputQuantity1d, ayaInstance.options.address, 0).send({from: address})
    .on('receipt', async (receipt) => {
      const stakedAt = await receipt.events.tokenStaked.returnValues.time;
      dispatch(setAyaBalance(ayaBalance-inputQuantity1d));
      dispatch(setAyaStaked1d(inputQuantity1d));
      const rewards = Math.round((86400*22/100)/(360*24*60*60)*inputQuantity1d *100) / 100;
      dispatch(setAyaRewards1d(rewards));
      dispatch(setAyaUnlock1d(24));
      dispatch(setAyaStakedAt1d(Number(stakedAt)));
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
      dispatch(setAyaRewards1d('0'));
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
      <div className={styles.card__form}>
      
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
            disabled={!mmConnected || !inputQuantity1d}
          >
            STAKE NOW
          </button>
        }
      </div>
      <div className={styles.card__infos}>
        <p className={styles.card__infos__stacked}>Staked : {ayaStaked1d}</p>
        <p className={styles.card__infos__rewards}>Rewards : {ayaRewards1d}</p>
        <p className={styles.card__infos__unlock}>Unlock in : {`${ayaUnlock1d && ayaUnlock1d} ${typeof(ayaUnlock1d) === 'number' ? 'hours': ''}`}</p>

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

export default Card1d;