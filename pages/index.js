import React from 'react';
import { EmptyState, Layout, Page } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
// import { MongoClient } from "mongodb";

//以下未使用
  
  const MONGO_URL = process.env.NEXT_PUBLIC_MONGO_URL;
  const MONGO_DB_NAME = process.env.NEXT_PUBLIC_MONGO_DB_NAME;
  const MONGO_COLLECTION = 'shops';

  //DB接続設定
  const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component{

  state = { open: false };
  render() {
    return (
      <Page>
        <TitleBar
          title="サンプルアプリ"
          primaryAction={{
            content: '商品を選ぶ',
            onAction: () => this.setState({open: true}),
          }}
        />
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          open={this.state.open}
          onSelection={(resources) => this.handleSelection(resources)}
          onCancel={() => this.setState({ open: false })}
        />

        <Layout>
          <EmptyState
            heading="Select products to start"
            action={{
              content: 'Select products',
              onAction: () => this.setState({ open: true }),
            }}
            image={img}
          >
            <p>Select products and change their price temporarily</p>
          </EmptyState>
        </Layout>
      </Page>
    );
  }

  handleSelection = (resources) => {
    const idsFromResouces = resources.selection.map((product) => product.id );
    this.setState({ open: false });
    console.log(idsFromResouces);
    // this.mongoHandler();
    // this.myDBset('ids', idsFromResouces);
   
  };

  // mongoHandler = (req, res) => {
  //   const client = new MongoClient(MONGO_URL);
  //   client.connect(async (err) => {
  //     const collection = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTION);
  //     const shops = await collection.find().toArray();
  //     console.log(shops);
  //   });
  // };


}




// const Index = () => (
// //   <Page>
//     <TitleBar
//       title="サンプルアプリ"
//       primaryAction={{
//         content: '商品を選ぶ',
//       }}
//     />

//     <Heading>Shopify app with Node and React 🎉</Heading>
//   </Page>
// );

export default Index;
