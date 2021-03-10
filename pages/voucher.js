
import React from 'react';
import { Button, Card, Form, FormLayout,
   Layout, Page, SettingToggle, TextStyle ,TextField} from "@shopify/polaris";
import store from 'store-js';
import { Query } from '@apollo/react-components';
import gql from 'graphql-tag';
import graphql from 'graphql';


  // レイアウト１
  //スイッチをONにすると、ストアフロントにスクリプトタグが挿入される、タグのＩＤが保存される
  //スイッチをOFFにすると、ストアフロントからスクリプトタグが除去される、タグのＩＤが消去される
  
  // レイアウト２
  //事前に登録されたディスカウントコードを取得して表示
  // 当選確率欄に数値を入力し、コードと確率が保存される

const INPUT_JS_URL = process.env.NEXT_PUBLIC_JS_URL;


const CHECK_DISCOUNT_CODE = gql`
  query{
    codeDiscountNodeByCode(code: "TEST-VOUCHER4") {
      id
    }
  }
`;

class Voucher extends React.Component{

  state = {
    active: false,
    DiscountCode: 'TEST-VOUCHER',
    CodeError: false,
  };
  

  render(){

    const active = this.state.active;
    const contentStatus = active ? 'Disable' : 'Enable';
    const textStatus = active ? '有効' : '無効';
  
    // const [DiscountCode, setDiscountCode] = useState('test');

    // const handleTextFieldChange = useCallback(
      // (value) => setDiscountCode(value),
      // [],
    // );

    // const { DiscountCode } = this.state.DiscountCode;

    return(
      <Page>
        <Layout>
          <Layout.AnnotatedSection 
            title="クーポンガチャ"
            description="ストアにクーポンガチャ画面を表示します"
          >
            <SettingToggle
              action={{
                content: contentStatus,
                onAction: this.handleToggle,
              }}
              enabled={active}
            >
              この設定は <TextStyle variation="strong">{textStatus}</TextStyle>になっています。
            </SettingToggle>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title="ガチャ対象クーポン"
            description="クーポンガチャで当たるクーポンコードを入力してください。確率は50%です。"
          >


          {/* <Query query={CHECK_DISCOUNT_CODE}>
          { ({ data, loading, error }) => {
          if (loading) return <div>Loading…</div>;
          if (error) return <div>{error.message}</div>;
          
          
          if (!data.codeDiscountNodeByCode) this.checkCodeError;


          return ( */}

            <Card sectioned>
              <Form onSubmit={this.handleTextFieldSubmit}>
              <FormLayout>
                <TextField
                  label="ディスカウントコード"
                  value= {this.state.DiscountCode}
                  onChange= {this.handleTextFieldChange('DiscountCode')}
                  error={ this.state.CodeError && "クーポンの登録がありません" }
                />
                
                <Button primary submit>
                  Save
                </Button>

                </FormLayout>
              </Form>
            </Card>


             {/* ); }}
            </Query>  */}




          </Layout.AnnotatedSection>

        </Layout>



      </Page>
    );
  }

  //functions below
  handleToggle = () => {
    this.setState(({ active }) => {
      return {active: !active};
    });
    
    // console.log(INPUT_JS_URL);

  };
  
  handleTextFieldChange = (field) => {
    return (value) => {this.setState( {[field]: value} )};
  };

  handleTextFieldBlur = () => {
    // ディスカウントコードの存在チェック
    // エラーの場合は、CodeError: true にする
    

  };


  handleTextFieldSubmit = () => {
    //エラーチェック

    
    this.setState({
      DiscountCode: this.state.DiscountCode,
    });
    console.log('submission', this.state);

    const voucherLot = {
      DiscountCode: this.state.DiscountCode,
      rate:0.5,
    };
    // データ保存
    store.set('VoucherLot', voucherLot);
    
    console.log('store set :', store.get('VoucherLot'));
  };
  

  checkCodeError = () => {
    this.setState({ isCorrectCode: false });
    console.log(this.state);
  }

}

export default Voucher;