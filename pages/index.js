import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Toolbar } from '../components/toolbar';
import imageUrlBuilder from '@sanity/image-url';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Title } from '../components/title';
import { Footer } from '../components/footer';

export default function Home({ posts }) {
  const router = useRouter();
  const [mappedPosts, setMappedPosts] = useState([]);

  useEffect(() => {
      if (posts.length) {
      const builder = imageUrlBuilder({
          projectId: '0parre0g',
          dataset: 'production',
      });

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
        <h1>Recent Posts</h1>

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
  const query = encodeURIComponent('*[ _type == "post" ]');
  const url = `https://0parre0g.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then(res => res.json()); 

  if (!result.result || !result.result.length) {
    return {
      props: {
        posts: [],
      }
    }
  } else {
    return {
      props: {
        posts: result.result,
      }
    }
  }
}