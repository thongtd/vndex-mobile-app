import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'
import { style } from '../../config/style';

export default class SliderCustomize extends PureComponent {
    constructor(props) {
        super(props)
    }
    componentDidMount() {

    }

    render() {
        const {activeIndex}=this.props;
        return (
            <View style={{width:"100%",alignItems:"center"}}>
                <View style={{ width: this.props.width, height: 50, flexDirection: 'column', zIndex: 30, }}>
                    <View style={{ width: this.props.width +4,marginLeft:-4, height: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        {[0, 1, 2, 3].map((index) => (
                            <Text key={index} style={{marginLeft:(index ===2 && index ===3)?4:0, color: this.props.activeIndex >= index ? '#4aae4f' : '#4F6D9F' }}>{index + 1}</Text>
                        ))}
                    </View>

                    <View style={{ width: this.props.width, height: 20, flexDirection: 'row', alignItems: 'center' }}>
                        {[0, 1, 2].map((index) => (
                            <View key={index} style={{width: (this.props.width) / 3, height: 1, backgroundColor: this.props.activeIndex >= index ? '#4aae4f' : style.colorBorderBox }} />
                        ))}
                        <View style={{left: this.props.width / 3 * (this.props.activeIndex + 1) - (activeIndex === 0?7:10), width: 15, height: 15, backgroundColor: '#56D053', borderRadius: 10, position: 'absolute' }} />
                    </View>
                     
                    <View style={{ width: this.props.width, height: 20, flexDirection: 'row', position: 'absolute', top: 20, justifyContent: 'space-between', alignItems: 'center' }}>
                        {[0, 1, 2, 3].map((index) => (
                            <View key={index} style={{ width: 1, height: 10, backgroundColor: this.props.activeIndex >= index - 1 ? '#56D053' : style.colorBorderBox, borderRadius: 4 }} />
                        ))}
                    </View>
                </View>
            </View>
        )
    }
}
