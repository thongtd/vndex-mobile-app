import React from 'react';
import { Text, View,StyleSheet } from 'react-native';
import Icon from '../Icon';
import colors from '../../configs/styles/colors';
import TextFnx from './TextFnx';
import TextDot from './TextDot';
import { size } from '../../configs/utils';

const NoteImportant = ({
    arrNote = [],
    isTitle=true,
    space=10,
    hasDot,
    isRed
}) => (
        <View style={{marginVertical:space}}>
        {isTitle &&<View style={stylest.title}>
            <Icon name={"exclamation-triangle"} color={colors.yellow} size={16} />
            <TextFnx style={stylest.textTitle} value={`  ${"Important Note".t().toUpperCase()}`} />
        </View>}

        
        {(size(arrNote) === 1 && !hasDot) ?<TextFnx style={
            !isRed &&
            {
            textAlign:"center"
        }} color={isRed?colors.red:colors.text} value={arrNote[0]} />:arrNote.map((item, index) => {
                return (
                    <TextDot colorDot={colors.subText} key={`key-${index}`} value={item} color={colors.subText} />
                )
            })}
            
        </View>
    );
const stylest = StyleSheet.create({
    title:{
        flexDirection:"row",
        alignItems:"flex-end",
        marginBottom:8
    },
    textTitle:{
        marginBottom: -3,
        fontSize: 13,
        fontWeight:"bold"
    }
})
export default NoteImportant;
