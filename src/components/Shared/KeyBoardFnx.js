import React, {Component} from 'react';
import {Keyboard, TextInput} from 'react-native';

class KeyBoardFnx extends Component {
    constructor(props){
        super(props)
        this.state={
            status:false
        }
    }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
      console.log("show keyboard");
    //   this.props.data("show")
    var self=this;
    self.setState({
        status:true
    })
  }

  _keyboardDidHide() {
    console.log("hide keyboard")
    // this.props.data("hide")

    var self=this;
    self.setState({
        status:false
    })
  }
componentDidUpdate = (prevProps, prevState) => {
  if(prevState.status !== this.state.status && this.state.status ===true){
      this.props.keyboard("show");
  }else{
   if( prevState.status !== this.state.status && this.state.status ===false){
    this.props.keyboard("hide");
   }
  }
};

  render() {
    return <TextInput onSubmitEditing={Keyboard.dismiss} />;
  }
}
export default KeyBoardFnx;