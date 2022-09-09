import { useRouter } from "next/router";
import styles from '../styles/Footer.module.css'

export const Footer = () => {
    const router = useRouter();

    return (
        <div className={styles.main}>
            <ul>
                <li>About</li>
                <li>Contact</li>
                <li>© Alfie Yunnie 2022</li>
            </ul>
        </div>
    );
}