import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import _ from "lodash"
import ItemFiat from "./ItemFiat"
import { useDispatch, useSelector } from "react-redux"
import { listenerEventEmitter, get, createAction, jwtDecode, removeEventEmitter, size } from '../../../configs/utils';
import { GET_MARKET_WATCH, GET_CURRENCY_LIST, GET_CONVERSION } from '../../../redux/modules/market/actions';
import { GET_ASSET_SUMARY, GET_COIN_BY_TYPE } from '../../../redux/modules/wallet/actions';
import Layout from '../../../components/Layout/Layout';
import Image from '../../../components/Image/Image';
import Icon from '../../../components/Icon';
import colors from '../../../configs/styles/colors';
import TextFnx from '../../../components/Text/TextFnx';
import Empty from '../../../components/Item/Empty';

const ListFiat = ({
    data,
    isCheck,
    componentId
}) => {
    const logged = useSelector(state=>state.authentication.logged);
    const fiatsWallet = useSelector(state => state.wallet.fiatsWallet);
    const fiatsWalletType = useSelector(state => state.wallet.fiatsWalletType);
    const [Source, setSource] = useState(isCheck ? data : fiatsWallet);
    const [Disabled, setDisabled] = useState(false);
    const marketWatch = useSelector(state => state.market.marketWatch);
    const dispatcher = useDispatch();
    const searchFilterFunction = (text, ArrSrc,log) => {
        const newData = ArrSrc.filter(item => {
            const itemData = `${log?get(item, "currency").toUpperCase():get(item, "symbol").toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setSource(newData);
    };
    useEffect(() => {
        if(logged){
            setSource(isCheck ? data : fiatsWallet);
            listenerEventEmitter('textSearch', (text) => searchFilterFunction(text, isCheck ? data : fiatsWallet,logged))
        }else{
            setSource(fiatsWalletType);
            listenerEventEmitter('textSearch', (text) => searchFilterFunction(text, fiatsWalletType,logged))
        }
       
    }, [isCheck, data, fiatsWallet,fiatsWalletType,logged]);
    const onRefresh = () => {
        setDisabled(true);
        dispatcher(createAction(GET_MARKET_WATCH));
        dispatcher(createAction(GET_CURRENCY_LIST));
        dispatcher(createAction(GET_CONVERSION));
        
        dispatcher(createAction(GET_COIN_BY_TYPE,{
            walletType:1
        }))
        dispatcher(createAction(GET_COIN_BY_TYPE,{
            walletType:2
        }))
        jwtDecode().then(user => {
            if (get(user, "id")) {
                dispatcher(createAction(GET_ASSET_SUMARY, {
                    UserId: get(user, "id"),
                    marketWatch
                }))
            }
        })
    }
    useEffect(() => {
        listenerEventEmitter("doneAssets", () => setDisabled(false))
        return () => {
            removeEventEmitter("doneAssets");
        }
    }, [])
    return (
        <FlatList
            ListEmptyComponent={
               <Empty />
                }
            refreshControl={<RefreshControl refreshing={Disabled} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={Source}
            renderItem={({
                item
            }) => {
                return <ItemFiat componentId={componentId} key={item.currency} item={item} />
            }}
        />
    );

}
export default ListFiat;
