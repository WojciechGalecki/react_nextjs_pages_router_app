import { Fragment } from "react";
import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

export default function MeetupDetailsPage(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetup.title}</title>
        <meta name="description" content={props.meetup.description} />
      </Head>
      <MeetupDetail
        image={props.meetup.image}
        title={props.meetup.title}
        address={props.meetup.address}
        description={props.meetup.description}
      />
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();
  const collection = db.collection("meetups");

  const meetup = await collection.findOne({ _id: new ObjectId(meetupId) });

  client.close();

  return {
    props: {
      meetup: {
        id: meetup._id.toString(),
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        description: meetup.description,
      },
    },
  };
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();
  const collection = db.collection("meetups");

  const meetupsIds = await collection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    paths: meetupsIds.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
    fallback: false,
  };
}
