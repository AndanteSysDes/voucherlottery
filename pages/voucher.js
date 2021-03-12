
import React from 'react';
import { Button, Card, Form, FormLayout,
   Layout, Page, SettingToggle, TextStyle ,TextField} from "@shopify/polaris";
import store from 'store-js';
import { Query, Mutation } from '@apollo/react-components';
import gql from 'graphql-tag';
import graphql from 'react-apollo';
// import VoucherSwitch from '../components/ResourceList';


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


const PUT_SCRIPT_TAG = gql`
mutation scriptTagCreate($input: ScriptTagInput!) {
  scriptTagCreate(input: $input) {
    scriptTag {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;

const DELETE_SCRIPT_TAG = gql`
mutation scriptTagDelete($id: ID!) {
  scriptTagDelete(id: $id) {
    deletedScriptTagId
    userErrors {
      field
      message
    }
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
    const contentStatus = active ? '無効にする' : '有効にする';
    const textStatus = active ? '有効' : '無効';
  
    // const [DiscountCode, setDiscountCode] = useState('test');

    // const handleTextFieldChange = useCallback(
      // (value) => setDiscountCode(value),
      // [],
    // );

    // const { DiscountCode } = this.state.DiscountCode;


    const variables ={
      input: {
        displayScope: "ONLINE_STORE",
        src: INPUT_JS_URL,
      }
    };

    const mutation = active ? DELETE_SCRIPT_TAG : PUT_SCRIPT_TAG;


    return(
      <Page>
        <Layout>
          <Layout.AnnotatedSection 
            title="クーポンガチャ"
            description="ストアにクーポンガチャ画面を表示します"
          >
            <Form>
            <Mutation mutation={mutation}>
              {(handleMutation, {error, data} ) => {

                //エラーハンドリング
                if(error) console.log(error.message);

                //正常終了通知
                if(data) {
                  console.log(data);

                  if(data.scriptTagCreate){
                    console.log("スクリプトタグを挿入");

                    const createdTags = store.get('scripttags') ? store.get('scripttags') : [];

                    // if(store.get('scripttags')){
                    //   createdTags = store.get('scripttags');
                    // }
                    createdTags.push(
                      data.scriptTagCreate.scriptTag
                    );


                    store.set('scripttags', createdTags );
                    console.log(store.get('scripttags'));
                  }

                  if(data.scriptTagDelete){

                    //createdTags = ["{id: gid/....}", "{id: gid/....}", ...]
                    const createdTags = store.get('scripttags');

                    const find = createdTags.filter((item, index) => {
                      if(item.id != data.scriptTagDelete.deletedScriptTagId) return true;
                    });


                    console.log('find:', find);
                    console.log("スクリプトタグを削除");


                    store.set('scripttags', find);


                  }

                }

                return(

                  <SettingToggle
                  action={{
                    content: contentStatus,
                    onAction: () => {
                      this.handleToggle();
                      const v = this.makeVariables();
                      console.log(v);
                      if(v){
                        handleMutation({
                          variables: v.variables,
                        });
                      }
                    }  
                  }}
                  enabled={active}
                >
                  この設定は <TextStyle variation="strong">{textStatus}</TextStyle>になっています。
                </SettingToggle>
    


                );
              }}
            </Mutation>





           



            </Form>




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
                  保存
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
  };
  
  makeVariables = () => {
    console.log(this.state.active);
    if(!this.state.active){
      console.log("有効にしました") ;
      return {
        // mutation: PUT_SCRIPT_TAG,
        variables: {
          input: {
            displayScope: "ONLINE_STORE",
            src: INPUT_JS_URL,
          }
        }
      };

    }else{
      console.log("無効にしました") ;

      const targetTags = store.get('scripttags') ? store.get('scripttags') : null;

      if (!targetTags) return; 
      
      

      console.log("保存済みスクリプトタグ",store.get('scripttags'));

      return {
        // mutation: DELETE_SCRIPT_TAG;
        variables: {
          id: targetTags[0].id
        }
      };
    }
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