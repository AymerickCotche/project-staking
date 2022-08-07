import styles from './Main.module.scss';
import Card from '../Card';
import Card1d from '../Card1d';
import Card3m from '../Card3m';


const Main = () => {
  return (
    <div className={styles.main}>
      <h2 className={styles.main__title}>Stake your token to receive passive income</h2>
      <div className={styles.main__filter}>
        <button className={`${styles.main__filter__btn} ${styles.main__filter__btn__cinqs}`}>Lock : 15 seconds</button>
        <button className={`${styles.main__filter__btn} ${styles.main__filter__btn__oned}`}>Lock : 1 day</button>
        <button className={`${styles.main__filter__btn} ${styles.main__filter__btn__threem}`}>Lock : 3 months</button>

      </div>
      <Card/>
      <Card1d/>
      <Card3m/>
    </div>
  )
};

export default Main;