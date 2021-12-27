import React,{useState,useEffect} from 'react';
import { Text, View, TextInput, StyleSheet,Platform } from 'react-native';
import colors from '../../../configs/styles/colors';
import Icon from '../../../components/Icon';
import { emitEventEmitter, listenerEventEmitter } from '../../../configs/utils';

const SearchInput = ({
    
}) => {
    const [Search, setSearch] = useState("");
    useEffect(() => {
        listenerEventEmitter("textSearch",(text)=>setSearch(text))
    }, [])
    return (
        <View style={stylest.widthBlock}>
            <View style={stylest.blockInputSearch}>
                <TextInput
                    value={Search}
                    onChangeText={(text)=>{setSearch(text)}}
                    style={stylest.inputSearch}
                />
            </View>
            <Icon style={stylest.iconSearch} name="search" color={colors.iconButton} />
        </View>
    );
}
const stylest = StyleSheet.create({
    blockInputSearch:{
        height: 25,
        borderWidth: 0.5,
        borderColor: "#486db5",
        borderRadius:15,
        overflow: "hidden"
    },
    inputSearch: {
        marginRight: 3,
        paddingLeft: 20,
        height: 35,
        position: "absolute",
        top: -4,
        width: "100%",
        color:colors.text
    },
    widthBlock: {
        width: "33%"
    },
    iconSearch: { position: "absolute", top:Platform.OS==="ios"? 8:6, left: 7 }
})
export default SearchInput;
