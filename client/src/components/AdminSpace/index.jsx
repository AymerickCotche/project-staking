import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import web3 from 'web3';


import styles from './AdminSpace.module.scss';
import { getAyaInstance, setInputContractOwner } from '../../app/actions/staking';

const BN = web3.utils.BN;

const AdminSpace = () => {

  const dispatch = useDispatch();

  const address = useSelector((state) => state.web3.address);

  const mmConnected = useSelector((state) => state.web3.metamask.isConnected);
  const ayaInstance = useSelector((state) => state.staking.ayaInstance);
  const stakingInstance = useSelector((state) => state.staking.stakingInstance);



  const inputContractOwner = useSelector((state) => state.staking.inputContractOwner);

  useEffect(() => {

    if (mmConnected) {
      dispatch(getAyaInstance());
    }

  }, [mmConnected]);

  const handleChangeInputOwnerAddress = (e) => {
    dispatch(setInputContractOwner(e.target.value));
  }

  const handleClickSetContractOwner = async () => {
    await ayaInstance.methods.addContractOwner(inputContractOwner).send({from: address});
  }

  const handleClickSetApprove = async () => {
    const maxAmount = new BN("2").pow(new BN("256").sub(new BN("1")));
    await ayaInstance.methods.approve(stakingInstance.options.address, maxAmount.toString()).send({from: address});
  }
  return(
    <div className={styles.card}>
      <div className={styles.card__form}>
        <input
          className={styles.card__form__input}
          type="text"
          placeholder='address'
          value={inputContractOwner}
          onChange={handleChangeInputOwnerAddress}
        />
      <button
        className={styles.card__form__btn}
        onClick={handleClickSetContractOwner}
      >
        Set Contract Owner
      </button>
      </div>
      
      <button
        className={styles.card__form__btn}
        onClick={handleClickSetApprove}
      >
        Approve Staking Contract to spend Alyra Token
      </button>
      
    </div>
  )
};

export default AdminSpace;