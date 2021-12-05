import React, { Component } from "react";
import { View, Text } from "react-native";
import Modal from "@kalwani/react-native-modal";
 
export default class ModalTester extends Component {
  state = {
    modal1: false,
    modal2: false,
    modal3: false,
    isFilter:false
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
         <HeaderFnx
                    title={'HISTORY'.t()}
                    hasBack
                    navigation={navigation}
                    colorStatus={style.bgHeader.backgroundColor}
                    backgroundHeader={style.bgHeader.backgroundColor}
                    hasRight={
                        <TouchableOpacity
                            onPress={() => this.setState({
                                isFilter: !this.state.isFilter
                            })}
                            style={{
                                padding: 10
                            }}
                        >
                            <Icon name={"filter"} size={14} color={this.state.isFilter ? style.colorHighLight : "#fff"} />
                        </TouchableOpacity>
                    }
                />
                <Modal
                    isVisible={modal3}
                    onModalHide={this.closeModalThree}
                    // style={{ backgroundColor: "blue" }}
                >
                    <View style={{ flex: 1, }}>
                            <TouchableWithoutFeedback
                                style={styles.ModalFilter}
                                onPress={
                                    () => this.setState({
                                        isFilter: false,
                                        isOff: true,
                                        isOff2: true
                                    })
                                }
                            >
                                <View style={styles.ModalFilter} />
                            </TouchableWithoutFeedback>
                            <HeaderFnx
                                title={'HISTORY'.t()}
                                colorStatus={style.bgHeader.backgroundColor}
                                backgroundHeader={style.bgHeader.backgroundColor}
                                hasRight={
                                    <TouchableOpacity
                                        onPress={() => this.setState({
                                            isFilter: !this.state.isFilter
                                        })}
                                        style={{
                                            padding: 10
                                        }}
                                    >
                                        <Icon name={"filter"} size={14} color={this.state.isFilter ? style.colorHighLight : "#fff"} />
                                    </TouchableOpacity>
                                }
                            />
                        </View>
                </Modal>
      </View>
    );
  }
}