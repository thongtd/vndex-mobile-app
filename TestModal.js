import React, { Component } from "react";
import { View, Text } from "react-native";
import Modal from "@kalwani/react-native-modal";
 
export default class ModalTester extends Component {
  state = {
    modal1: false,
    modal2: false,
    modal3: false
  };
 
  style = {
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20
  }
 
  componentWillMount() {
    setTimeout(() => {
      this.setState({ modal1: true });
    }, 2000);
 
    setTimeout(() => {
      this.setState({ modal2: true });
    }, 4000);
 
    setTimeout(() => {
      this.setState({ modal3: true });
    }, 6000);
  }
 
  closeModalOne = () => {
    this.setState({ modal1: false });
  };
  closeModalTwo = () => {
    this.setState({ modal2: false });
  };
  closeModalThree = () => {
    this.setState({ modal3: false });
  };
 
  render() {
    const { modal1, modal2, modal3 } = this.state;
    return (
      <View>
        <Modal
          isVisible={modal1}
          onModalHide={this.closeModalOne}
          style={{ backgroundColor: "red" }}
        >
          <View>
            <Text style={this.style}>
              This is modal 1
            </Text>
          </View>
        </Modal>
 
        <Modal
          isVisible={modal2}
          onModalHide={this.closeModalTwo}
          style={{ backgroundColor: "green" }}
        >
          <View>
            <Text style={this.style}>
              This is modal 2
            </Text>
          </View>
        </Modal>
 
        <Modal
          isVisible={modal3}
          onModalHide={this.closeModalThree}
          style={{ backgroundColor: "blue" }}
        >
          <View>
            <Text style={this.style}>
              This is modal 3
            </Text>
          </View>
        </Modal>
      </View>
    );
  }
}