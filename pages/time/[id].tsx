import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import { ALL_TIME_FIELDS } from "../../graphql/fragments";
import { ITime } from "../../interfaces";

import Head from "next/head";
import DefaultLayout from "../../layouts/default";
import Card from "../../components/Card";

interface  TimeProps {
    time: ITime
}

const TimeYear: React.FC<TimeProps> = ({ time }) => {
    return <DefaultLayout>
        <Head>
            <title>LIGHTFILMS : { time.id }</title>

            {/* Standart meta */}
            <meta 
                name="description" 
                content={`Read more about the ${ time.id }s. Best Films of ${ time.id }s  LIGHTFILMS. The influence of the ${ time.id }s on today's cinema`} 
            />
            <meta 
                name="keywords" 
                content={`Best time of cinema ${ time.id }s, ${ time.id }s History on cinema, LIGHTFILMS, ${ time.id }s cinema, ${time.title}`} 
            />
            <link rel="canonical" href={` https://lightfilms-ssandry.vercel.app/time/${time.id} `} />

            {/* Open Graph meta */}
            <meta 
                property="og:title" 
                content={`LIGHTFILMS : ${ time.id }`}
            />
            <meta 
                property="og:url" 
                content={ `https://lightfilms-ssandry.vercel.app/time/${time.id}` } 
            />
            <meta 
                property="og:description" 
                content={ `LIGHTFILMS - About ${time.id}s cinema history. ${time.title}` }
            />
        </Head>
        <div id="timeBlock">
            <section id="timeContent">
                <h1 className="h2-fk"> { time.id }'s <br/> { time.title } </h1>
                {
                    time.sections.map( (section: any, i) => {
                        return <article key = { i }>
                            <h4> { section.title } </h4>
                            {
                                section.p.map( (p, j) => {
                                    return (
                                        <p key = { j }> { p } </p>
                                    )
                                } )
                            }
                        </article>
                    } )
                }
                <article>
                    <h4>SOME OF THE BEST MOVIES OF THE DECADE</h4>
                    <div id="bestMovies">
                        {
                            time.bestMovies.map( (film) => {
                                return <Card 
                                    HREF    = "/film/[id]"
                                    AS      = { `/film/${ film.id }` }
                                    key     = { film.id }

                                    h3      = { film.h3 }
                                    h6top   = { film.h6top }
                                    h6bot   = { film.h6bot }
                                    img     = { film.img }
                                    type    = "single"
                                />
                            } )
                        }
                    </div>
                </article>
            </section>
        </div>
    </DefaultLayout>
}

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {

    if( process.env.MODE === "development" ) {
        try {
            const client = new ApolloClient({
                uri: process.env.DEV_GRAPHQL_SERVER,
                cache: new InMemoryCache()
            })
    
            const data = await client.query({
                query: gql`
                    query getTime {
                        getTime(id: ${ctx.params.id}) {
                            ...TimeFragment
                    }
                }
                ${ALL_TIME_FIELDS.fragment}
                `
            })
    
            return {
                props: {
                    time: data.data.getTime
                }
            }
        } catch(err) {
            throw new Error(`Error: ${err}`);
        }

    } else if( process.env.MODE === "production" ) {
        try {
            const client = new ApolloClient({
                uri: process.env.PROD_GRAPHQL_SERVER,
                cache: new InMemoryCache()
            })
    
            const data = await client.query({
                query: gql`
                    query getTime {
                        getTime(id: ${ctx.params.id}) {
                            ...TimeFragment
                    }
                }
                ${ALL_TIME_FIELDS.fragment}
                `
            })
    
            return {
                props: {
                    time: data.data.getTime
                }
            }

        } catch(err) {
            throw new Error(`Error: ${err}`);
        }
    }
}

export const getStaticPaths: GetStaticPaths = async () => {

    if( process.env.MODE === "development" ) {
        try {
            const client = new ApolloClient({
                uri: process.env.DEV_GRAPHQL_SERVER,
                cache: new InMemoryCache()
            })

            const data = await client.query({
                query: gql`
                    query getAllTimes {
                        getAllTimes {
                            id
                    }
                }
                `
            })

            const paths = await data.data.getAllTimes.map( ( {id} ) => {
                return ({ params: { id: id } })
            } )

            return { 
                paths, 
                fallback: false 
            }

        } catch(err) {
            throw new Error(`Error: ${err}`);
        }
        
    } else if( process.env.MODE === "production" ) {
        try {
            const client = new ApolloClient({
                uri: process.env.PROD_GRAPHQL_SERVER,
                cache: new InMemoryCache()
            })

            const data = await client.query({
                query: gql`
                    query getAllTimes {
                        getAllTimes {
                            id
                    }
                }
                `
            })

            const paths = await data.data.getAllTimes.map( ( {id} ) => {
                return ({ params: { id: id } })
            } )

            return { 
                paths, 
                fallback: false 
            }

        } catch(err) {
            throw new Error(`Error: ${err}`);
        }
    }
}

export default TimeYear;