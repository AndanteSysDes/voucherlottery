import React from 'react';
import { EmptyState, Layout, Page } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
import ResourceListWithProducts from '../components/ResourceList';

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
        <ResourceListWithProducts />
      </Page>
    );
  }

  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id );
    this.setState({ open: false });
    console.log(idsFromResources);
    store.set('ids', idsFromResources);
  };


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
