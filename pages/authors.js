import ImageUrlBuilder from "@sanity/image-url";
import { useRouter } from "next/router";
import styles from '../styles/Authors.module.css'
import { Toolbar } from "../components/toolbar";
import { Title } from "../components/title";
import { Footer } from "../components/footer"
import { useEffect, useState } from "react";

export const Authors = ({ authors }) => {
    const router = useRouter();
    const [mappedAuthors, setMappedAuthors] = useState([]);

    useEffect(() => {
        if (authors.length) {
            const builder = ImageUrlBuilder({
                projectId: '0parre0g',
                dataset: 'production',
            });

            setMappedAuthors(
                authors.map(a => {
                    if (a.image) {
                        return {
                            ...a,
                            icon: builder.image(a.image).width(150).height(150),
                        }
                    }
                    else {
                        return {
                            ...a,
                            icon: null
                        }
                    }
                })
            );
        }
        else {
            setMappedAuthors([]);
        }
    }, [authors])

    return (
        <div>
            <Title />
            <Toolbar />
            <div className={styles.grid}>
                {mappedAuthors.length ? mappedAuthors.map((a, index) => (
                    <div onClick={() => router.push(`/author/${a.slug.current}`)} key={index} className={styles.author}>
                        {a.icon && <img className={styles.icon} src={a.icon} />}
                        <h3>{a.name}</h3>
                    </div>
                )): <>No authors found</>}
            </div>
            <Footer />
        </div>
    );
}

export const getServerSideProps = async pageContext => {
    const query = encodeURIComponent(`*[ _type == "author"]`);
    const url = `https://0parre0g.api.sanity.io/v1/data/query/production?query=${query}`;
    const result = await fetch(url).then(res => res.json()); 

    if (!result.result || !result.result.length) {
        return {
          props: {
            authors: [],
          }
        }
      } else {
        return {
          props: {
            authors: result.result,
          }
        }
      }

}

export default Authors;