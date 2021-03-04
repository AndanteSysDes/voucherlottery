import React from 'react';
import {Heading, Page } from "@shopify/polaris";
// import db from "../meddlewares/database";
// import { connectToDatabase } from '../server/mongodb'
// import  {myDBget, myDBinsert, myDBset} from './mongodb';


import  MyDBComponent from '../components/myDBComponent';

const Inserttest = () => (
  <Page>
    <Heading>Shopify app with Node and React 🎉</Heading>
    <MyDBComponent />
  </Page>
);


export default Inserttest;