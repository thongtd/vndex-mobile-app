import React, { useState, useEffect } from 'react';
import {TouchableOpacity, Text, View, StyleSheet, RefreshControl, Clipboard, ActivityIndicator } from 'react-native';
import TopBarWallet from '../../../components/TopBarWallet';
import TextFnx from '../../../components/Text/TextFnx';
import { pop, showModal, dismissAllModal, pushSingleScreenApp } from '../../../navigation/Navigation';
import { constant } from '../../../configs/constant';
import Container from '../../../components/Container';
import HeaderWalletScreen from './HeaderWalletScreen';
import Layout from '../../../components/Layout/Layout';
import Image from '../../../components/Image/Image';
import { get, isIos, isArray, size, formatCurrency, to_UTCDate, jwtDecode, listenerEventEmitter, createAction, toast, set, formatTrunc, CheckStepStatus, checkLang, CheckDisableStatus, getOneMonthAgoDate, getCurrentDate, removeEventEmitter } from '../../../configs/utils';
import colors from '../../../configs/styles/colors';
import icons from '../../../configs/icons';
import ButtonTypeWallet from '../../../components/Button/ButtonTypeWallet';
import Button from '../../../components/Button/Button';
import Icon from '../../../components/Icon';
import { SwipeListView } from 'react-native-swipe-list-view';
import Empty from '../../../components/Item/Empty';
import ItemHistorySwap from '../../SwapScreen/components/ItemHistorySwap';
import { useDispatch, useSelector } from "react-redux"
import _, { isNaN, orderBy, uniqBy } from "lodash";
import { GET_WITHDRAW_FIAT_LOG, GET_WITHDRAW_COIN_LOG, GET_DEPOSIT_COIN_LOG, GET_DEPOSIT_FIAT_LOG, GET_BALANCE_BY_CURRENCY_SUCCESS } from '../../../redux/modules/wallet/actions';
import { ALERT_ACCOUNT_ACTIVE, MODAL_ALERT, PICKER_SEARCH, DEPOSIT_COIN_SCREEN, DEPOSIT_FIAT_SCREEN, HISTORY_DEPOSIT_COIN_SCREEN, HISTORY_DEPOSIT_FIAT_SCREEN, WITHDRAW_COIN_SCREEN, WITHDRAW_FIAT_SCREEN, TRANSACTION_HISTORY } from '../../../navigation';
import { authService } from '../../../services/authentication.service';
import { WalletService } from '../../../services/wallet.service';
import ItemList from '../../../components/Item/ItemList';
import FilterHistorySwapScreen from '../../SwapScreen/childrensScreens/FilterHistorySwapScreen';

const LayoutInfoWallet = ({
    componentId,
    item,
    isCoinData,
    isHistoryTransaction
}) => {
    const lang = useSelector(state => state.authentication.lang);
    const logged = useSelector(state => state.authentication.logged);
    const [IsActive, setIsActive] = useState("C");
    const cryptoWallet = useSelector(state => state.market.cryptoWallet);
    const fiatsWallet = useSelector(state => state.wallet.fiatsWallet);
    const [InfoCoin, setInfoCoin] = useState(item);
    const currencyList = useSelector(state => state.market.currencyList)
    const coinWithdrawLog = useSelector(state => state.wallet.coinWithdrawLog);
    const coinDepositLog = useSelector(state => state.wallet.coinDepositLog);
    const coinDepositLogLoadMore = useSelector(state => state.wallet.coinDepositLogLoadMore);
    const fiatDepositLogLoadMore = useSelector(state => state.wallet.fiatDepositLogLoadMore);
    const coinWithdrawLogLoadMore = useSelector(state => state.wallet.coinWithdrawLogLoadMore);
    const fiatWithdrawLogLoadMore = useSelector(state => state.wallet.fiatWithdrawLogLoadMore);
    const [isCoin, setIsCoin] = useState(isCoinData);
    const fiatDepositLog = useSelector(state => state.wallet.fiatDepositLog);
    const fiatWithdrawLog = useSelector(state => state.wallet.fiatWithdrawLog);
    const [Source, setSource] = useState([]);
    const [Disabled, setDisabled] = useState(false);
    const [CurrencyActive, setCurrencyActive] = useState("BTC");
    const [UserId, setUserId] = useState("");
    const dispatcher = useDispatch();
    const UserInfo = useSelector(state => state.authentication.userInfo)
    const twoFactorySerice = get(UserInfo, "twoFactorService");
    const twoFactorEnable = get(UserInfo, "twoFactorEnabled");
    const [UserSub, setUserSub] = useState("");
    const [InfoCurrency, setInfoCurrency] = useState("");
    const [HiddenShow, setHiddenShow] = useState(false);
    const [Page, setPage] = useState(0);
    const [Loading, setLoading] = useState(false);
    const [InfoDataSearch, setInfoDataSearch] = useState("");
    // var Page = 1;
    // const [Item, setItem] = useState(item)
    useEffect(() => {
        console.log(fiatWithdrawLog,"fiatWithdrawLog");
       
            if (isCoin && IsActive === "C") {
                setSource(coinDepositLog)
            } else if (isCoin && IsActive === "F") {
                setSource(coinWithdrawLog)
            } else if (!isCoin && IsActive === "C") {
                setSource(fiatDepositLog)
            } else if (!isCoin && IsActive === "F") {
                setSource(fiatWithdrawLog)
            }
        
        
    }, [isHistoryTransaction,coinDepositLogLoadMore,coinWithdrawLog, coinDepositLog, fiatDepositLog, fiatWithdrawLog, IsActive, isCoin])
    
    useEffect(() => {
        dispatcher(createAction(GET_BALANCE_BY_CURRENCY_SUCCESS, {}));
        WalletService.getWalletBalanceByCurrency(get(UserInfo, "id"), CurrencyActive).then(res => {
            setInfoCurrency(res);

        })
    }, [CurrencyActive])
    useEffect(() => {
        
        onRefresh();
        setPage(1);
        setInfoDataSearch("");
    }, [IsActive])
    useEffect(() => {
        if (isArray(cryptoWallet) && size(cryptoWallet) > 0) {
            let cryptoFilter = cryptoWallet.filter((crypto, index) => get(crypto, "symbol") == get(InfoCoin, "symbol"))
            if (isArray(cryptoFilter) && size(cryptoFilter) > 0) {
                setInfoCoin(cryptoFilter[0])
                setCurrencyActive(get(cryptoFilter[0], "symbol"))
            }
        }
        if (isArray(fiatsWallet) && size(fiatsWallet) > 0) {
            let cryptoFilter = fiatsWallet.filter((crypto, index) => get(crypto, "symbol") == get(InfoCoin, "symbol"))
            if (isArray(cryptoFilter) && size(cryptoFilter) > 0) {
                setInfoCoin(cryptoFilter[0]);
                setCurrencyActive(get(cryptoFilter[0], "symbol"))
            }
        }
    }, [cryptoWallet, fiatsWallet]);

    const onRefresh = (loadMore=false) => {
        // setDisabled(true);
        dispatcher(createAction(GET_WITHDRAW_COIN_LOG, {
            UserId,
            pageIndex: 1,
            loadMore:loadMore
        }))
        dispatcher(createAction(GET_WITHDRAW_FIAT_LOG, {
            UserId,
            pageIndex: 1,
            loadMore:loadMore
        }))
        dispatcher(createAction(GET_DEPOSIT_COIN_LOG, {
            UserId,
            pageIndex: 1,
            loadMore:loadMore
        }))
        dispatcher(createAction(GET_DEPOSIT_FIAT_LOG, {
            UserId,
            pageIndex: 1,
            loadMore:loadMore
        }))
    }

    useEffect(() => {
        jwtDecode().then(user => {
            if (get(user, "id")) {
                setUserId(get(user, "id"));
                setUserSub(get(user, "sub"));
            }

        })
        
        listenerEventEmitter('doneWCoinLog', () => {
            setDisabled(false)
            setLoading(false)
        })
        listenerEventEmitter('doneDFiatLog', () => {
            setLoading(false)
            setDisabled(false)
        })
        listenerEventEmitter('doneDCoinLog',()=>{
            setLoading(false)
            setDisabled(false)
        })
        listenerEventEmitter('doneWFiatLog',()=>{
            setLoading(false)
            setDisabled(false)
        })
    }, [])
    useEffect(() => {
        // listenerEventEmitter('pushData', (data) => {
            
        //     let SourceData = [...Source,...data]
        //     console.log(SourceData,"dataPush");
        //     setLoading(false);
        //     setSource(SourceData)
        // })
        return () => {
            removeEventEmitter('pushData');
        };
    }, [Source])
    const onCancel = (data, rowMap) => {
        var passProps;
        var sessionId;
        var verifyCode;
        if (!isCoin && IsActive === "C") {
            WalletService.cancelDepositFiat(get(data, "item.id")).then(res => {
                if (get(res, "result.status")) {
                    dispatcher(createAction(GET_DEPOSIT_FIAT_LOG, {
                        UserId,
                        pageIndex: 1
                    }))
                }
            })
        } else {
            var dataSubmit = {
                sessionId,
                verifyCode,
                accId: UserId,
                requestId: ""
            };
            if (twoFactorEnable && twoFactorySerice === constant.TWO_FACTOR_TYPE.GG2FA) {
                passProps = {
                    placeholder: "2FA_CODE".t(),
                    isResend: false,
                    isIconLeft: false,
                    title: "Cancel",
                    textFirst: "Please enter 2FA code".t()
                }
            } else if (twoFactorEnable && twoFactorySerice === constant.TWO_FACTOR_TYPE.EMAIL_2FA) {
                passProps = {
                    onChangeText: (text) => {
                        verifyCode = text;
                    },
                    onSubmit: () => {
                        set(dataSubmit, "verifyCode", verifyCode);
                        set(dataSubmit, "sessionId", sessionId);
                        set(dataSubmit, "requestId", get(data, "item.id"))
                        WalletService.cancelWithdrawCoin(dataSubmit).then(res => {
                            console.log(dataSubmit, res, "reas")
                            if (res) {
                                if (get(res, "status")) {
                                    return toast(get(res, "message"));
                                } else {
                                    return toast(get(res, "message"));
                                }
                            } else {
                                return toast(get(res, "message"));
                            }
                        })
                        // console.log(dataSubmit,"dataSubmit");
                    },
                    placeholder: "2FA_CODE".t(),
                    isResend: true,
                    isIconLeft: true,
                    onResend: () => {
                        authService.getTwoFactorEmailCode(UserSub).then(res => {
                            sessionId = get(res, "data.sessionId");
                            // console.log(res,"val ka")
                        })
                    },
                    title: "Cancel",
                    textFirst: `${"The 2fa code has been sent to email".t()} ${UserSub}`
                }
            } else {
                rowMap[data.index].closeRow();
                return toast("Please enable 2FA code".t())
            }
            showModal(MODAL_ALERT, passProps, true)
        }

        rowMap[data.index].closeRow();
    }
    const onSelectCoin = () => {
        if (isCoin) {
            let data = orderBy(uniqBy(cryptoWallet, 'currency'), ['currency'], ['asc']);
            let propsData = getPropData(data, "image", "symbol", CurrencyActive, (item) => handleActive(item))
            showModal(PICKER_SEARCH, propsData)
        } else {
            let data = orderBy(uniqBy(fiatsWallet, 'currency'), ['currency'], ['asc']);
            let propsData = getPropData(data, "image", "symbol", CurrencyActive, (item) => handleActive(item))
            showModal(PICKER_SEARCH, propsData)
        }

    }
    const handleActive = (item) => {
        setCurrencyActive(get(item, "symbol"));
        setInfoCoin(item);
        dismissAllModal()
    }
    const onDeposit = (InfoCoin) => {
        if (isCoin) {
            pushSingleScreenApp(componentId, DEPOSIT_COIN_SCREEN, {
                data: InfoCoin
            });
        } else {
            pushSingleScreenApp(componentId, DEPOSIT_FIAT_SCREEN, {
                data: InfoCoin
            });
        }
    }
    const onWithdraw = () => {
        if (isCoin) {
            pushSingleScreenApp(componentId, WITHDRAW_COIN_SCREEN, {
                data: InfoCoin
            });
        } else {
            pushSingleScreenApp(componentId, WITHDRAW_FIAT_SCREEN, {
                data: InfoCoin
            });
        }
    }
    const onHistory = (item) => {
        if (isCoin && IsActive === "C") {
            pushSingleScreenApp(componentId, HISTORY_DEPOSIT_COIN_SCREEN, {
                data: item
            })
        } else if (!isCoin && IsActive === "C") {
            pushSingleScreenApp(componentId, HISTORY_DEPOSIT_FIAT_SCREEN, {
                InfoBank: item
            })
        } else if (isCoin && IsActive === "F") {
            var extraData = {};

            if (isArray(get(item, "toExtraFields")) && size(get(item, "toExtraFields"))) {
                get(item, "toExtraFields").map((extra, index) => {
                    if (get(extra, "value")) {
                        let fieldName = get(extra, `localizations.${checkLang(lang)}.FieldName`);
                        set(extraData, fieldName, {
                            title: fieldName,
                            value: get(extra, "value")
                        })
                    }
                })
            }
            pushSingleScreenApp(componentId, WITHDRAW_COIN_SCREEN, {
                step: CheckStepStatus(get(item, "statusLable")),
                data: item,
                dataInfo: {
                    amount: {
                        title: "AMOUNT".t(),
                        value: formatTrunc(currencyList, get(item, "amount"), get(item, "symbol"))
                    },
                    address: {
                        title: "RECEIVED_ADDRESS".t(),
                        value: get(item, "toAddress")
                    },
                    ...extraData
                },
                isHistory: true,
                requestId: get(item, "id")
            })
        } else {
            pushSingleScreenApp(componentId, WITHDRAW_FIAT_SCREEN, {
                step: CheckStepStatus(get(item, "statusLable")),
                data: { ...item, currency: get(item, "walletCurrency") },
                dataInfo: {
                    amount: {
                        title: "AMOUNT".t(),
                        value: formatTrunc(currencyList, get(item, "amount"), get(item, "symbol"))
                    },
                    bank: {
                        title: "BANK_NAME".t(),
                        value: get(item, "bankName")
                    },
                    branch: {
                        title: "BRACH_NAME".t(),
                        value: get(item, "bankBranchName")
                    },
                    nameBankAccount: {
                        title: "RECEIVING_BANK_ACCOUNT_NAME".t(),
                        value: get(item, "bankAccountName")
                    },
                    numberBankAccount: {
                        title: "RECEIVING_BANK_ACCOUNT_NO".t(),
                        value: get(item, "bankAccountNo")
                    },
                    amount: {
                        title: "AMOUNT".t(),
                        value: formatTrunc(currencyList, get(item, "amount"), get(item, "symbol"))
                    },
                },
                isHistory: true,
                requestId: get(item, "id")
            })
        }
    }
    const renderFooter = () => {
        if (!Loading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
            />
        );
    }
    const handleLoadMore = () => {
        console.log(Page,"cuoi");
        
        if (!Loading) {
            setPage(Page+1)       
             // method for API call 
        }
    }
    useEffect(() => {
        fetchData(Page,InfoDataSearch);
        return () => {
        
      };
    }, [Page,InfoDataSearch])
    const fetchData = (page = 1,data={
        fromDate:"",
        toDate:"",
        walletCurrency:"",
        status:""
    }) => {
        setLoading(true);
        if (isCoin && IsActive === "C") {
            dispatcher(createAction(GET_DEPOSIT_COIN_LOG, {
                UserId,
                pageIndex: page,
                loadMore:true,
                fromDate:data.startDate,
                toDate:data.endDate,
                walletCurrency:data.symbol,
                status:data.status
            }))
            
            
        } else if (isCoin && IsActive === "F") {
            dispatcher(createAction(GET_WITHDRAW_COIN_LOG, {
                UserId,
                pageIndex: page,
                loadMore:true,
                fromDate:data.startDate,
                toDate:data.endDate,
                walletCurrency:data.symbol,
                status:data.status
            }))
            
        } else if (!isCoin && IsActive === "C") {
            dispatcher(createAction(GET_DEPOSIT_FIAT_LOG, {
                UserId,
                pageIndex: page,
                loadMore:true,
                fromDate:data.startDate,
                toDate:data.endDate,
                walletCurrency:data.symbol,
                status:data.status
            }))
            
        } else if (!isCoin && IsActive === "F") {
            dispatcher(createAction(GET_WITHDRAW_FIAT_LOG, {
                UserId,
                pageIndex: page,
                loadMore:true,
                fromDate:data.startDate,
                toDate:data.endDate,
                walletCurrency:data.symbol,
                status:data.status
            }))
            
        }
    }
    const onSubmitSearch =(data)=>{
        fetchData(1,data)
        setInfoDataSearch(data)
        setHiddenShow(false);
    }
    const onActiveWalletType = (active)=>{
        if(get(active,"value") == 1){
            setIsCoin(false)
        }else{
            setIsCoin(true)
        }
    }
    return (
        <Container
            onClickRight={() => setHiddenShow(!HiddenShow)}
            hasBack
            componentId={componentId}
            isFilter={HiddenShow}
            title={"Transaction History".t()}
            nameRight="filter"
            isTopBar={isHistoryTransaction ? true : false}
            customTopBar={
                !isHistoryTransaction ? <TopBarWallet
                    nameRight={"bars"}
                    typeRight={constant.TYPE_ICON.AntDesign}
                    onClickLeft={() => pop(componentId)}
                    sizeIconRight={19}
                    onClickRight={onSelectCoin}
                    styleCenter={{
                        justifyContent: 'flex-start',
                    }}
                    renderItem={
                        <Layout
                            isCenter
                            type={"column"}
                            space={10}
                        >
                            <View style={stylest.icons}>
                                <Image style={{
                                    width: 23,
                                    height: 23
                                }} source={{
                                    uri: get(InfoCoin, "image")
                                }} />
                            </View>

                            <TextFnx weight={"bold"} space={7} value={`${get(InfoCoin, "symbol")} - ${get(InfoCoin, "name")}`} />
                            <TextFnx value={formatCurrency(get(InfoCoin, "available"), get(InfoCoin, "symbol"), currencyList)} color={colors.green} weight={"500"} size={20} />
                        </Layout>
                    }
                >
                </TopBarWallet>
    :null
            }
        >
            {isHistoryTransaction && <FilterHistorySwapScreen
                onSubmitSearch={onSubmitSearch}
                isHistoryTransaction
                HiddenShow={HiddenShow}
                startDate={{ show: getOneMonthAgoDate(true), api: getOneMonthAgoDate() }}
                endDate={{ show: getCurrentDate(true), api: getCurrentDate() }}
                onHiddenShow={() => setHiddenShow(!HiddenShow)}
                
                onActiveWalletType={onActiveWalletType}
            />}
            {!isHistoryTransaction && <Layout style={stylest.layoutBtn}>
                <ButtonWithdraw
                    onPress={() => onDeposit(InfoCoin)}
                    value={"Deposits".t()}
                />
                <ButtonWithdraw
                    onPress={() => onWithdraw(InfoCoin)}
                    image={icons.deposit}
                    value={"Withdrawal".t()} />
                {isCoin && <ButtonWithdraw
                    onPress={() => {
                        Clipboard.setString(get(InfoCurrency, "cryptoAddress"));
                        toast("COPY_TO_CLIPBOARD".t());
                    }}
                    image={icons.copy}
                    value={"COPY".t()} />}

            </Layout>}
            <Layout
                isSpaceBetween
            >
                <ButtonTypeWallet
                    title1={"Deposits".t()}
                    title2={"Withdrawal".t()}
                    style={[!isHistoryTransaction && {
                        marginTop: 40,

                    }, { marginBottom: 10 }]}
                    IsActive={IsActive}
                    onIsActive={(active) => {
                        setIsActive(active)
                    }}
                />
                {!isHistoryTransaction && <Button
                    onTitle={()=>pushSingleScreenApp(componentId,TRANSACTION_HISTORY)}
                    isTitle
                    title={
                        <>
                            <TextFnx isDart value={`${"More".t()} `} />
                            <Icon name="chevron-right" />
                        </>
                    }
                    color={colors.text}
                    style={[{
                        marginTop: 55,
                        marginBottom: 10
                    }]}
                />}

            </Layout>
            <SwipeListView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={Disabled} onRefresh={onRefresh} />
                }
                // contentContainerStyle={(!logged || size(Source) == 0) && {
                //     flex: 1
                // }}
                ListEmptyComponent={<Empty />}
                data={eval(checkDataShowLoadMore(isCoin,IsActive))}
                renderItem={(data, rowMap) => {
                    return (
                        <View style={{
                            paddingVertical: 5
                        }}>
                            <TouchableOpacity
                                onPress={() => onHistory(get(data, "item"), rowMap)}
                            >
                                <ItemHistorySwap
                                    titleStart={to_UTCDate(get(data, "item.createdDate"), "DD/MM/YYYY")}
                                    titleCenter={"Status".t()}
                                    valueStart={to_UTCDate(get(data, "item.createdDate"), "hh:mm:ss")}
                                    valueCenter={get(data, "item.statusLable") && get(data, "item.statusLable").t()}
                                    titleEnd={get(data, "item.currency") || get(data, "item.walletCurrency")}
                                    valueEnd={formatCurrency(get(data, "item.amount"), get(data, "item.currency"), currencyList)}
                                    style={{
                                        backgroundColor: colors.btnBlur,
                                        paddingHorizontal: 15,
                                    }}
                                    isWallet
                                />
                            </TouchableOpacity>

                        </View>
                    )
                }}
                renderHiddenItem={(data, rowMap) => {
                    if (!CheckDisableStatus(get(data, "item.status"))) {
                        return (
                            <TouchableOpacity
                                onPress={() => onCancel(data, rowMap)}
                            >
                                <View style={[stylest.rowBack]}>
                                    <Icon color={colors.background} size={19} name={"trash-alt"} />
                                </View>
                            </TouchableOpacity>
                        )
                    } else {
                        return null;
                    }

                }}
                stopRightSwipe={-100}
                disableRightSwipe
                disableLeftSwipe={isCoin && IsActive === "C" ? true : false}
                rightOpenValue={-60}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={isHistoryTransaction?renderFooter:null}
                onEndReachedThreshold={0.4}
                onEndReached={()=>{
                    console.log("cuoi roi");
                    if(isHistoryTransaction){
                        handleLoadMore();
                    }
                    
                }}
            />
        </Container>

    );
}

const ButtonWithdraw = ({
    image = icons.withdraw,
    value = "Withdrawal".t(),
    onPress
}) => (
        <TouchableOpacity
            onPress={onPress}
        >
            <View style={stylest.btn}>
                <Image source={image} style={{ width: 30, height: 30 }} />
                <TextFnx spaceTop={5} value={value} color={colors.statusBar} />
            </View>
        </TouchableOpacity>

    );
const stylest = StyleSheet.create({
    layoutBtn: {
        position: "absolute",
        top: -35,
        justifyContent: 'center',
        width: "100%"
    },
    btn: {
        width: 100,
        height: 70,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
        backgroundColor: "#fff",
        borderRadius: 4,
        alignItems: "center",
        paddingVertical: 10,
        marginHorizontal: 5
    },
    icons: {
        backgroundColor: "#fff",
        borderRadius: 20,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: "center"
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: colors.red,
        // flex: 1,
        width: 57,
        flexDirection: 'row',
        alignSelf: "flex-end",
        justifyContent: "center",
        height: "100%",
        marginBottom: -15,
        marginTop: 5
    },
});

const getPropData = (data, image, value, Active, cb) => {
    return {
        data: [...data],
        renderItem: ({ item, key }) => {
            return (

                <ItemList
                    customView={
                        <Layout>
                            <Image source={{
                                uri: get(item, image)
                            }} style={{ width: 17, height: 17 }} />
                            <TextFnx isDart weight={"500"} value={`  ${get(item, value)}`} />
                        </Layout>}
                    onPress={() => cb(item)
                    }
                    value={get(item, value)}
                    checked={get(item, value) === Active}
                />
            )
        },
        keywords: [value]
    }
}
const checkDataShowLoadMore =(isCoin,IsActive)=>{
    if (isCoin && IsActive === "C") {
        return "coinDepositLogLoadMore"
    } else if (isCoin && IsActive === "F") {
        return "coinWithdrawLogLoadMore"
    } else if (!isCoin && IsActive === "C") {
        return "fiatDepositLogLoadMore"
    } else if (!isCoin && IsActive === "F") {
        return "fiatWithdrawLogLoadMore"
    }
}
export default LayoutInfoWallet;
