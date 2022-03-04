import type { NextPage } from 'next'
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {

  


  return (
    <div className={styles.container}>
      Welcome to Basic Chat!
      <Link href={"/login"}>Login</Link>
    </div>
  )
}

export default Home
