import AdminSpace from '../components/AdminSpace';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.scss';

const Home = () => {
  return (
    <div className={styles.container}>
     <Layout>
       <AdminSpace/>
     </Layout>
    </div>
  )
}

export default Home
