import React, { Component, Fragment } from 'react';
import { Text, View, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import HeaderFnx from '../../Shared/Header';
import ContainerApp from '../../Shared/ContainerApp';
import { convertUTC, formatTrunc, to_UTCDate, jwtDecode,formatSCurrency } from '../../../config/utilities';
import { Item, Left, Right, Body, Container } from 'native-base';
import { style } from '../../../config/style';
import Empty from '../../Shared/Empty';
import { authService } from '../../../services/authenticate.service';
import StatusBarFnx from '../../Shared/StatusBar';
import {styles} from "react-native-theme";
class Commission extends Component {
  constructor(props) {
    super(props);
    this.page = 1;
    this.state = {
      userCommission: [],
      loading: false, // user list loading
      isRefreshing: false, //for pull to refresh,
      isDataEmpty: false
    };
  }
  componentDidMount = () => {
    this.getCommission(this.page)
  };
  getCommission = async (page) => {
    this.setState({ loading: true })
    let content = await jwtDecode();
    let userCommission = await authService.getUserCommission(content.sub, content.id, page, 15);
    if (userCommission && userCommission.data.source.length !== 0) {
      let listData = this.state.userCommission;
      let data = listData.concat(userCommission.data.source)
      this.setState({ loading: false, userCommission: data, isDataEmpty: false })
    } else {
      this.setState({ loading: false, isDataEmpty: true })
    }

  }
  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.loading) return null;
    return (
      <ActivityIndicator
        style={{ color: styles.textMain.color }}
      />
    );
  };
  handleLoadMore = () => {
    console.log("da cuoi roi")
    if (!this.state.loading && !this.state.isDataEmpty) {
      this.page = this.page + 1; // increase page by 1
      this.getCommission(this.page); // method for API call 
    }
  };
  async onRefresh() {
    this.page = 1;
    this.setState({ isRefreshing: true }); // true isRefreshing flag for enable pull to refresh indicator
    let content = await jwtDecode();
    let userCommission = await authService.getUserCommission(content.sub, content.id, 1, 15);

    this.setState({ isRefreshing: false, userCommission: userCommission.data.source, isDataEmpty: false })
  }
  render() {
    const { navigation } = this.props;
    const { userCommission } = this.state;
    if (this.state.loading && this.page === 1) {
      return <ContainerApp><ActivityIndicator style={{ color: styles.textMain.color }} /></ContainerApp>;
    }
    return (
      // <ContainerApp>
      <Fragment>
        <HeaderFnx
          title={'COMMISSION_DETAILS'.t()}
          hasBack
          style={{
            backgroundColor:styles.backgroundSub.color
          }}
          navigation={navigation}
          colorStatus={style.colorWithdraw}
        />
        <Container style={{
        paddingHorizontal: 10,
        backgroundColor: styles.backgroundMain.color
      }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Empty style={{ paddingTop: '50%' }} />}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          renderItem={({ item, index }) => (
            <Item style={[stylest.item,{borderBottomColor: styles.borderBottomItem.color}]}>
              <Left style={{ flex: 1 }}>
                <Text style={[styles.textMain, { paddingBottom: 3 }]}>
                  {to_UTCDate(item.createdDate, "DD-MM-YYYY")}
                </Text>
                <Text style={[styles.textMain]}>{to_UTCDate(item.createdDate, "HH:mm:ss")}</Text>

              </Left>
              <Body style={{
                flex: 1,
                alignItems:"flex-start"
              }}>
                <Text style={[styles.textMain, { paddingBottom: 3}]}>
                  {"Email"}
                </Text>
                <Text style={[styles.textWhite,]}>
                  {item.email}
                </Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Text style={[styles.textWhite, { paddingBottom: 3 }]}>
                  {item.paymentUnit}
                </Text>
                <Text
                  style={[styles.textWhite]}>
                  {formatSCurrency(navigation.state.params.currencyList, item.commissionAmount, item.paymentUnit)}
                </Text>

              </Right>
            </Item>
          )}
          data={userCommission}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={this.renderFooter.bind(this)}
          onEndReached={this.handleLoadMore.bind(this)}
          onEndReachedThreshold={0.05}
        />
      </Container>
      </Fragment>
      

    );
  }
}

export default Commission;

const stylest = StyleSheet.create({
  item: {
    borderBottomWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: style.bgHeader.backgroundColor,
    justifyContent: "center",
    height: 60
  },
})