import React, { useState, useEffect } from 'react';
import RN, { Text, View, RefreshControl } from 'react-native';
import _ from "lodash"
import {ItemCoin} from './ItemCoin';
import { useDispatch, useSelector } from "react-redux"
import { get, listenerEventEmitter, createAction, removeEventEmitter, jwtDecode, size } from '../../../configs/utils';
import { GET_MARKET_WATCH, GET_CURRENCY_LIST, GET_CONVERSION } from '../../../redux/modules/market/actions';
import { GET_ASSET_SUMARY, GET_COIN_BY_TYPE } from '../../../redux/modules/wallet/actions';
import Empty from '../../../components/Item/Empty';
import TextFnx from '../../../components/Text/TextFnx';

const ListCoin = ({
    data,
    isCheck,
    componentId
}) => {
    const logged = useSelector(state=>state.authentication.logged);
    const coinsWalletType = useSelector(state => state.wallet.coinsWalletType);
    const cryptoWallet = useSelector(state => state.market.cryptoWallet);
    const [Source, setSource] = useState(logged?cryptoWallet: coinsWalletType);
    const [Disabled, setDisabled] = useState(false);
    const marketWatch = useSelector(state => state.market.marketWatch);
    const dispatcher = useDispatch();
    
    const searchFilterFunction = (text, ArrSrc,log) => {
        const newData = ArrSrc.filter(item => {
            const itemData = `${log?get(item, "symbol").toUpperCase():get(item, "symbol").toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setSource(newData);
    };
    useEffect(() => {
        if(logged){
            setSource(cryptoWallet);
            listenerEventEmitter('textSearch', (text) => searchFilterFunction(text, cryptoWallet,logged))
        }else{
            setSource(coinsWalletType)
            listenerEventEmitter('textSearch', (text) => searchFilterFunction(text,coinsWalletType,logged))
        }
       
        return () => removeEventEmitter('textSearch')
    }, [logged,isCheck, data, cryptoWallet,coinsWalletType]);
    const onRefresh = () => {
        
        setDisabled(true);
        // dispatcher(createAction(GET_MARKET_WATCH));
        dispatcher(createAction(GET_CURRENCY_LIST));
        // dispatcher(createAction(GET_CONVERSION));
        // dispatcher(createAction(GET_COIN_BY_TYPE,{
        //     walletType:1
        // }))
        // dispatcher(createAction(GET_COIN_BY_TYPE,{
        //     walletType:2
        // }))
        jwtDecode().then(user => {
            if (get(user, "UserId")) {
                dispatcher(createAction(GET_CRYPTO_WALLET, get(user, "UserId")))
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
        <RN.FlatList
            
            ListEmptyComponent={
                <Empty />
            }
            refreshControl={<RefreshControl refreshing={Disabled} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={Source}
            renderItem={({
                item,index
            }) => {
                return <ItemCoin key={index.toString()} componentId={componentId} item={item} />
            }}
        />
    );
}

export default ListCoin;
