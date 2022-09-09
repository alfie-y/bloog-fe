import { useRouter } from "next/router"
import styles from '../styles/Toolbar.module.css'

export const Toolbar = () => {
    const router = useRouter();

    return (
        <div className={styles.main}>
            <div onClick={() => router.push('/category/stuff')}>Stuff</div>
            <div onClick={() => router.push('/category/sounds')}>Sounds</div>
            <div onClick={() => router.push('/authors')}>Authors</div>
            <div onClick={() => window.location.href='https://www.instagram.com/alfie.y/'}>Instagram</div>
            <div onClick={() => window.location.href='https://www.youtube.com/watch?v=vygKb4B7kkU'}>VotD</div>
        </div>
    );
}