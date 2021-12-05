import React from "react";
import {Text, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {connect} from 'react-redux';
import I18n from "../language/i18n";
import {commonService} from "../services/common.service";
import {getLanguage} from "../redux/action/common.action";

class TabBarIcon extends React.Component{
    constructor(props) {
        super(props);
        commonService.getLanguage().then(lang => {
            if(lang){
                I18n.locale = lang;
                this.props.getLanguage(lang);
            }
            else{
                commonService.setLanguage(I18n.locale == "en"?"en-US":"vi-VN")
            }
        })
    }
componentWillReceiveProps = (nextProps) => {
    if(nextProps){
        this.setState({
            test:true
        })
    }

};

    render() {
        const {tintColor, label, name} = this.props;
        return(
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Icon name={name} size={20} color={tintColor} />
                <Text style={{ color: tintColor, fontSize: 10 }}>{`${label}`.t()}</Text>
            </View>
        )
    }
}
const mapStateToProps = state => {
    return{
        language: state.commonReducer.language
    }
}
export default connect(mapStateToProps, {getLanguage})(TabBarIcon);
