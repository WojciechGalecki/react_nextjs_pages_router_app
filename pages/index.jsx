import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

export default function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title key="title">React Meetups</title>
        <meta
          key="description"
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

//runs during build process
export async function getStaticProps() {
  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();
  const collection = db.collection("meetups");

  const meetupsData = await collection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetupsData.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, // refeching data every 10s
  };
}

//runs on the server for every request
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: M,
//     },
//   };
// }
