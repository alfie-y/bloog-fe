import { Toolbar } from '../../components/toolbar';
import imageUrlBuilder from '@sanity/image-url';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PortableText } from '@portabletext/react';
import { Title } from '../../components/title';
import styles from '../../styles/Home.module.css'
import { Footer } from '../../components/footer';

export const Author = ({ author, posts }) => {
    const router = useRouter();
    const [mappedPosts, setMappedPosts] = useState([]);

    const builder = imageUrlBuilder({
        projectId: '0parre0g',
        dataset: 'production',
    });

    const icon = builder.image(author[0].image).width(150).height(150);

    useEffect(() => {
        if (posts.length) {
            setMappedPosts(
                posts.map(p => {
                if (p.mainImage) {
                    return {
                    ...p,
                    mainImage: builder.image(p.mainImage).width(500).height(250),
                    }
                }
                else {
                    return {
                    ...p,
                    mainImage: null,
                    }
                }
                })
            );
        } else {
        setMappedPosts([]);
        }

    }, [posts]) 

    return (
        <div>
            <Title />
            <Toolbar />
            <div className={styles.main}>
                <div className={styles.profile}>
                    <img className={styles.icon} src={icon} />
                    <h1>{author[0].name}</h1>  
                    <PortableText value={author[0].bio} />
                </div>
                <div className={styles.feed}>
                    {mappedPosts.length ? mappedPosts.map((p, index) => (
                    <div onClick={() => router.push(`/post/${p.slug.current}`)} key={index} className={styles.post} >
                        <h3>{p.title}</h3>
                        <div className={styles.box}>
                            {p.mainImage && <img className={styles.mainImage} src={p.mainImage} />}
                            <p>{p.description}</p>
                        </div>
                    </div>
                    )): <>No posts found</>}
                </div>
          </div>
          <Footer />
        </div>
    );
}


export const getServerSideProps = async pageContext =>  {
    const pageSlug = pageContext.query.slug;

    const postsQuery = encodeURIComponent(`*[ _type == "post" && '${pageSlug}' == lower(author->name)]`);
    const postsUrl = `https://0parre0g.api.sanity.io/v1/data/query/production?query=${postsQuery}`;
    const postsResult = await fetch(postsUrl).then(res => res.json()); 

    const authorQuery = encodeURIComponent(`*[ _type == "author" && '${pageSlug}' == lower(name)]`);
    const authorUrl = `https://0parre0g.api.sanity.io/v1/data/query/production?query=${authorQuery}`;
    const authorResult = await fetch(authorUrl).then(res => res.json()); 

    if (!postsResult.result || !postsResult.result.length) {
        return {
          props: {
            posts: [],
          }
        }
      } else {
        return {
          props: {
            author: authorResult.result,
            posts: postsResult.result,
          }
        }
      }
}

export default Author;