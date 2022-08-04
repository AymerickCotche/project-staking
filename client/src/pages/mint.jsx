import Layout from '../components/Layout';
import Mint from '../components/Mint';
import styles from '../styles/Home.module.scss';

const Home = () => {
  return (
    <div className={styles.container}>
     <Layout>
       <Mint/>
     </Layout>
    </div>
  )
}

export default Home
