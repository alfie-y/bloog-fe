import imageUrlBuilder from '@sanity/image-url';
import styles from '../../styles/Post.module.css'
import { PortableText } from '@portabletext/react';
import { getImageDimensions } from '@sanity/asset-utils';
import { Toolbar } from '../../components/toolbar';
import { Title } from '../../components/title';
import { Footer } from '../../components/footer'




export const Post = ({ title, body, image, embedContent }) => {

    const builder = imageUrlBuilder({
        projectId: '0parre0g',
        dataset: 'production',
    });

    // const portableTextComponents = {
    //     types: {
    //         'image': ({ asset }) => {
    //             console.log(asset);
    //             return (<img src={builder.image(asset)} />)
    //         },
    //     }
    // }

    const imageComponent = ({ value }) => {
        const {width, height} = getImageDimensions(value)
        return (
        <img
            src={builder.image(value).width(650).fit('max').auto('format').url()}
            alt={value.alt || ' '}
            loading="lazy"
            style={{
            // Avoid jumping around with aspect-ratio CSS property
            aspectRatio: width / height,
            }}
        />
        )
    }

    const components = {
        types: {
            image: imageComponent
        }
    }

    return (
        <div>
            <Title />
            <Toolbar />
            <div className={styles.main}>
                <h1>{title}</h1>
                {image && <img className={styles.mainImage} src={builder.image(image)} />}
                <div className={styles.body}>
                    <PortableText 
                        value={body}
                        components={components}
                        // components={portableTextComponents}
                        // imageOptions={{w: 320, h: 240, fit: 'max'}}
                        // projectId={"0parre0g"} 
                        // datatset={"production"} 
                    />
                </div>
                <div className={styles.embedContainer} dangerouslySetInnerHTML={{ __html: embedContent }} />

            </div>
            <Footer />
        </div>
    );
};

export const getServerSideProps = async pageContext => {
    const pageSlug = pageContext.query.slug;

    if (!pageSlug) {
        return {
            notFound: true
        }
    }

    const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${pageSlug}" ]`);
    const url = `https://0parre0g.api.sanity.io/v1/data/query/production?query=${query}`;

    const result = await fetch(url).then(res => res.json());
    const post = result.result[0];

    if (!post.embedContent) {
        post.embedContent = null;
    }


    if (!post.mainImage) {
        post.mainImage = null;
    }

    if (!post) {
        return {
            notFound: true
        }
    } else {
        return {
            props: {
                body: post.body,
                title: post.title,
                image: post.mainImage,
                embedContent: post.embedContent
            }
        }
    }
};

export default Post;