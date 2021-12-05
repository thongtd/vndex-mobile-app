import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class ViewSpecial extends Component {
  render() {
    return (
      <View style={{
        flexDirection: "column", justifyContent: "flex-start",width:"100%"
      }}>
        {this.props.children}
      </View>
    )
  }
}
