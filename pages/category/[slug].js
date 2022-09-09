import { Toolbar } from '../../components/toolbar';
import imageUrlBuilder from '@sanity/image-url';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Title } from '../../components/title';
import styles from '../../styles/Home.module.css'
import { Footer } from '../../components/footer';

export const Category = ({ category, posts }) => {
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
            <h1>{category[0].title}</h1>    
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

    const postsQuery = encodeURIComponent(`*[ _type == "post" && '${pageSlug}' in categories[]->title]`);
    const postsUrl = `https://0parre0g.api.sanity.io/v1/data/query/production?query=${postsQuery}`;
    const postsResult = await fetch(postsUrl).then(res => res.json()); 

    const catQuery = encodeURIComponent(`*[_type == "category" && title == '${pageSlug}']`)
    const catUrl = `https://0parre0g.api.sanity.io/v1/data/query/production?query=${catQuery}`;
    const catResult = await fetch(catUrl).then(res => res.json()); 
  
    if (!postsResult.result || !postsResult.result.length) {
      return {
        props: {
          posts: [],
        }
      }
    } else {
      return {
        props: {
          category: catResult.result,
          posts: postsResult.result,
        }
      }
    }
  }

  export default Category;