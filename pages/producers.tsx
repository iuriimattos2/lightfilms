import { GetStaticProps } from "next";
import { ApolloClient, InMemoryCache } from "@apollo/client";

import { GET_PRODUCERS } from "../graphql/queries";

import Head from "next/head";
import Header from "../components/Header/header";
import Footer from "../components/Footer/index";
import Card from "../components/Card/card";

import { __QLPersons } from "../utils/__ql";
import { IPersonCard } from "../interfaces/interfaces";

interface ProducersPageProps {
    producers: IPersonCard[]
}

const ProducersPage: React.FC<ProducersPageProps> = ( { producers } ) => {
    return <>
        <Head>
            <title>LIGHTFILMS : Producers</title>
        </Head>
        <Header />
        <section id="header-choose">
            <h1>PRODUCERS</h1>
            <div id="chooser">
                <ul id = "countrys">
                    <li>JAPAN</li>
                    <li>FRANCE</li>
                    <li>RUSSIA</li>
                    <li>USA</li>
                    <li>BRITISH</li>
                    <li>GERMANY</li>
                    <li>ITALIAN</li>
                </ul>
                <ul id = "years">
                    <li>50’s</li>
                    <li>60’s</li>
                    <li>70’s</li>
                    <li>80’s</li>
                    <li>90’s</li>
                </ul>
            </div>
        </section>
        <section id="grid-posts">
            {
                producers.map( (producer) => {
                    return (
                        <Card 
                            key = {producer.id} 
                            HREF = {`/person/[id]`}
                            AS = {`/person/${producer.id}`}
                            h3 = { producer.name }
                            h6bot = { producer.countries[0] }
                            h6top = { producer.title }
                            img = { producer.imgs[0] }
                            img2 = { producer.imgs[1] }
                            type = "double"
                        />
                    )
                } )
            }
        </section>
        <Footer />
    </>
}

export const getStaticProps: GetStaticProps = async ctx => {

    if( process.env.MODE === "development" ) {

        try {

            const client = new ApolloClient({
                uri: process.env.DEV_GRAPHQL_SERVER,
                cache: new InMemoryCache()
            })

            const { data } = await client.query({ query: GET_PRODUCERS })

            return {
                props: {
                    producers: data.getProducers
                }
            }

        } catch(err) {
            console.log( `Err: ${err}` )
        }

    } else if ( process.env.MODE === "production" ) {

        try {
            const res: Response = await fetch(`${process.env.PROD_JSON_SERVER}`);
            const data = await res.json()

            const producers = __QLPersons( data.persons.filter( (person) => {
                return person.type == "producer"
            } ) )

            return {
                props: {
                    producers
                }
            }
        } catch(err) {
            console.log( `Err: ${err}` )
        }

    }
}

export default ProducersPage;