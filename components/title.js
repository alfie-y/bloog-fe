import { useRouter } from "next/router";
import SplashText from '../splashText.json'
import styles from '../styles/Title.module.css'

export const Title = () => {
    const router = useRouter();

    return (
        <div className={styles.main}>
            <h1 onClick={() => router.push('/')}>bloog</h1>
            <h3 suppressHydrationWarning>{SplashText.SplashText[Math.floor(Math.random() * SplashText.SplashText.length)].text}</h3>
        </div>
        
    )
}
