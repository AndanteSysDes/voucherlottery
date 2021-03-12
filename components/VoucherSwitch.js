import React from 'react'
import { SettingToggle, TextStyle ,} from "@shopify/polaris";

class VoucherSwitch extends React.Component {
  state = {
    active: false,
  };

  render(){

    const active = this.state.active;
    const contentStatus = active ? 'Disable' : 'Enable';
    const textStatus = active ? '有効' : '無効';
  
    return(

      <SettingToggle
      action={{
        content: contentStatus,
        onAction: this.handleToggle,
      }}
      enabled={active}
    >
      この設定は <TextStyle variation="strong">{textStatus}</TextStyle>になっています。
    </SettingToggle>

    );
  };

  
  //functions below
  handleToggle = () => {
    this.setState(({ active }) => {
      return {active: !active};
    });
    

  };


  
}


export default VoucherSwitch;