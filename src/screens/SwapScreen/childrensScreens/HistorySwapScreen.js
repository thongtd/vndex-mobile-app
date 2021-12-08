import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import Container from '../../../components/Container';
import ItemHistorySwap from '../components/ItemHistorySwap';
import TitleHistory from '../components/TitleHistorySwap';
import FilterHistorySwapScreen from './FilterHistorySwapScreen';
import { useDispatch, useSelector } from "react-redux"
import { createAction, isArray, size, to_UTCDate, get, formatCurrency, getCurrentDate, getOneMonthAgoDate, listenerEventEmitter, jwtDecode, removeEventEmitter } from '../../../configs/utils';
import { constant, SELL } from '../../../configs/constant';
import Empty from '../../../components/Item/Empty';
import { GET_SWAP_ORDERS_BOOK } from '../../../redux/modules/market/actions';

const HistorySwapScreen = ({
    componentId,
}) => {
    const dispatcher = useDispatch();
    const orderBook = useSelector(state => state.market.orderBook);
    const currencyList = useSelector(state => state.market.currencyList);
    const [UserId, setUserId] = useState("");
    const [Disabled, setDisabled] = useState(false);
    const [Page, setPage] = useState(1);
    const [Loading, setLoading] = useState(false);
    const [FromDate, setFromDate] = useState(getOneMonthAgoDate());
    const [ToDate, setToDate] = useState(getCurrentDate());
    const [WalletCurrency, setWalletCurrency] = useState("");
    useEffect(() => {
        listenerEventEmitter("doneSwapOrderBook", () => {
            setLoading(false);
            setDisabled(false);
        })
        listenerEventEmitter('searchSwapOrderBook', (data) => {
            
            setFromDate(data.fromDate);
            setToDate(data.toDate);
            setWalletCurrency(data.currency)
        });
        jwtDecode().then(user => setUserId(get(user, "id") || ""))
        return ()=>{
            removeEventEmitter('searchSwapOrderBook')    
        }
    }, [])
    useEffect(() => {
        setPage(1);
        setDisabled(true);
        if (UserId) {
            dispatcher(createAction(GET_SWAP_ORDERS_BOOK, {
                UserId,
                pageIndex: 1,
                pageSize: 15,
                fromDate: FromDate,
                toDate: ToDate,
                walletCurrency: WalletCurrency,
            }))
        }
        return () => {
            
        };
    }, [UserId,WalletCurrency,FromDate,ToDate])
    const [HiddenShow, setHiddenShow] = useState(false);
    const renderItemHistory = ({ item, index }) => {
        return <ItemHistorySwap
            key={get(item, "orderId")}
            titleStart={to_UTCDate(get(item, "createdDate"), "DD-MM-YYYY")}
            titleCenter={get(item, "side") === SELL ? get(item, "symbol") : get(item, "paymentUnit")}
            titleEnd={get(item, "side") === SELL ? get(item, "paymentUnit") : get(item, "symbol")}
            valueStart={to_UTCDate(get(item, "createdDate"), "ss:mm:hh")}
            valueCenter={get(item, "side") === SELL ? formatCurrency(get(item, "orderQtty"), get(item, "symbol"), currencyList) : formatCurrency(get(item, "orderPrice"), get(item, "paymentUnit"), currencyList)}
            valueEnd={get(item, "side") === SELL ? formatCurrency(get(item, "orderPrice"), get(item, "paymentUnit"), currencyList) : formatCurrency(get(item, "orderQtty"), get(item, "symbol"), currencyList)}
        />
    }
    const onRefresh = () => {
        setPage(1);
        setDisabled(true);
        if (UserId) {
            dispatcher(createAction(GET_SWAP_ORDERS_BOOK, {
                UserId,
                pageIndex: 1,
                pageSize: 15,
                fromDate: FromDate,
                toDate: ToDate,
                walletCurrency: WalletCurrency,
            }))
        }

    }

    useEffect(() => {
        setLoading(true)
        if (UserId) {
            dispatcher(createAction(GET_SWAP_ORDERS_BOOK, {
                UserId,
                pageIndex: Page,
                pageSize: 15,
                fromDate: FromDate,
                toDate: ToDate,
                walletCurrency: WalletCurrency,
            }))
        }

    }, [UserId, Page])
    const handleLoadMore = () => {
        if (!Loading && !Disabled) {
            setPage(Page + 1)
        }
    }
    const renderFooter = () => {
        if (!Loading) return null;
        if(Disabled) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
            />
        );
    }
    return (
        <>
            <Container
                isFilter={HiddenShow}
                componentId={componentId}
                hasBack
                title={"Swap History".t()}
                nameRight="filter"
                onClickRight={() => setHiddenShow(!HiddenShow)}
            >
                <FilterHistorySwapScreen
                    HiddenShow={HiddenShow}
                    startDate={{ show: getOneMonthAgoDate(true), api: getOneMonthAgoDate() }}
                    endDate={{ show: getCurrentDate(true), api: getCurrentDate() }}
                    onHiddenShow={() => setHiddenShow(!HiddenShow)}
                />
                <TitleHistory />
                <FlatList
                    ListEmptyComponent={<Empty />}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={<RefreshControl refreshing={Disabled} onRefresh={onRefresh} />}
                    showsVerticalScrollIndicator={false}
                    data={isArray(orderBook) && orderBook}
                    renderItem={renderItemHistory}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMore}
                />


            </Container>
        </>

    );
}






const stylest = StyleSheet.create({



});
export default HistorySwapScreen;

