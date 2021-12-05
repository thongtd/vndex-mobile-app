import React, { Fragment } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import HeaderFnx from '../../Shared/Header';
import ContainerApp from '../../Shared/ContainerApp';
import { convertUTC, to_UTCDate } from '../../../config/utilities';
import { Item, Left, Right, Container } from 'native-base';
import { style } from '../../../config/style';
import Empty from '../../Shared/Empty';
import { styles } from "react-native-theme";
const ReferralFriends = ({
    navigation,
}) => (
        <Fragment>
            <HeaderFnx
                title={'REFERRAL_FRIENDS'.t()}
                hasBack
                style={{
                    backgroundColor: styles.backgroundMain.color
                }}
                navigation={navigation}
                colorStatus={style.colorWithdraw}
            />
            <Container style={{
                paddingHorizontal: 10,
                backgroundColor: styles.backgroundMain.color
            }}>
                <FlatList
                    ListEmptyComponent={<Empty style={{ paddingTop: '50%' }} />}
                    renderItem={({ item, index }) => {
                        return (
                            <Item style={[stylest.item,{borderBottomColor: styles.borderBottomItem.color}]}>
                                <Left><Text style={styles.textWhite}>{item.email}</Text></Left>

                                <Right><Text
                                    style={styles.textWhite}>{to_UTCDate(item.createdDate, "DD-MM-YYYY HH:mm:ss")}</Text></Right>
                            </Item>
                        )
                    }}
                    data={navigation.state.params.data}
                    keyExtractor={(item, index) => index.toString()}
                />
            </Container>
        </Fragment>
    );

export default ReferralFriends;

const stylest = StyleSheet.create({
    item: {
        borderBottomWidth: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: style.bgHeader.backgroundColor,
        justifyContent: "center",
        height: 40
    }
})