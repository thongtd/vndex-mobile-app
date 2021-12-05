import React from 'react';
import {
    ListView,
    StatusBar
} from 'react-native';
import {
    Container,
} from 'native-base';
import { style } from "../../../config/style";
import { jwtDecode, } from "../../../config/utilities";
import { authService } from "../../../services/authenticate.service";
import connect from "react-redux/es/connect/connect";
import { getConversion } from "../../../redux/action/trade.action";
import { storageService } from "../../../services/storage.service";
import { constant } from "../../../config/constants";
import { HeaderFnx, Spiner } from "../../Shared"
import {
    CheckboxHistory,
    Fiat,
    ItemHistory
} from "./components"
import {setStatusBar} from "../../../redux/action/common.action"; 
import {styles} from "react-native-theme";
class HistoryCash extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            historyDeposit: false,
            historyWithdraw: false,
            depositLog: [],
            withdrawLog: [],
            openTab: 'O',
            pageIndex: 1,
            loading: false,
            symbol: null,
            fiatList: [],
            isReady:true
        }
        this.depositLog = [];
        this.withdrawLog = [];
    }

    async componentDidMount() {
        let user = await jwtDecode();
        this.getDepositLog(user.id, 15);
        this.getWithdrawLog(user.id, 15);
        let fiatList = await storageService.getItem(constant.STORAGEKEY.FIAT_LIST);
        this.setState({ fiatList })
    }

    async getDepositLog(id, pageSize) {
        let depositLog = await authService.getDepositFiatLog(id, this.state.pageIndex, pageSize);
        this.setState({ depositLog: depositLog.source, loading: false,isReady:false })
        this.depositLog = depositLog.source;
    }

    async getWithdrawLog(id, pageSize) {
        let withdrawLog = await authService.getWithdrawFiatLog(id, this.state.pageIndex, pageSize);
        this.setState({ withdrawLog: withdrawLog.source, loading: false,isReady:false })
        this.withdrawLog = withdrawLog.source;
    }

    async loadMoreDepositeLog() {
        let depositLog = await authService.getDepositFiatLog(id, this.state.pageIndex, pageSize);
        this.depositLog = depositLog.source;
        this.setState({ depositLog: this.state.depositLog.concat(depositLog), pageIndex: pageIndex + 1 })

    }

    async loadWithdrawlog() {
        let withdrawLog = await authService.getWithdrawFiatLog(id, this.state.pageIndex, pageSize);
        this.withdrawLog = withdrawLog.source;
        this.setState({ withdrawLog: this.state.withdrawLog.concat(withdrawLog), pageIndex: pageIndex + 1 })
    }

    onSelectWallet = (data,name) => {
        console.log(data,name,"data name")
        if(name === "all"){
            this.setState({ symbol:"",
                labelSelected:"ALL".t(),
                isSearchList:false
             });
            const symbol = null;
                if (this.state.openTab === 'O') {
                    if (symbol) {
                        let depositLog = this.depositLog.filter(e => e.walletCurrency == symbol);
                        this.setState({ depositLog })
                    } else {
                        this.setState({ depositLog: this.depositLog })
                    }
                } else {
                    if (symbol) {
                        let withdrawLog = this.withdrawLog.filter(e => e.walletCurrency == symbol);
                        this.setState({ withdrawLog })
                    } else {
                        this.setState({ withdrawLog: this.withdrawLog })
                    }
                }
        }else{
            this.setState({ symbol:data.currency,
                labelSelected:`${data.currency} - ${data.name}`,
                isSearchList:false
             });
            const symbol = data.currency;
                if (this.state.openTab === 'O') {
                    if (symbol) {
                        let depositLog = this.depositLog.filter(e => e.walletCurrency == symbol);
                        this.setState({ depositLog })
                    } else {
                        this.setState({ depositLog: this.depositLog })
                    }
                } else {
                    if (symbol) {
                        let withdrawLog = this.withdrawLog.filter(e => e.walletCurrency == symbol);
                        this.setState({ withdrawLog })
                    } else {
                        this.setState({ withdrawLog: this.withdrawLog })
                    }
                }
        }
       
        
    }
    render() {
        const { currencyList } = this.props;
        const { depositLog, withdrawLog, openTab, loading, symbol, fiatList,isReady } = this.state;
        // this.props.setStatusBar(style.colorHistory)
        return (
            
            <Container style={[style.container, { backgroundColor: styles.bgInfoWlWhite.color }]}>
                    <Spiner isVisible={isReady} /> 
                        <HeaderFnx
                            title={'HISTORY'.t()}
                            hasBack
                            {...this.props} 
                            colorStatus={'#162a4f'}
                            backgroundHeader={styles.bgInfoWlWhite.color}
                        />
                        <CheckboxHistory
                            onDeposit={
                                () => this.setState({
                                    openTab: 'O',
                                    symbol: '',
                                    labelSelected:'',
                                    depositLog: this.depositLog
                                })
                            }
                            onWithdraw={
                                () => this.setState({
                                    openTab: 'W',
                                    symbol: '',
                                    labelSelected:'',
                                    withdrawLog: this.withdrawLog
                                })
                            }
                            openTab={openTab}
                        />
                        <Fiat
                        hasFirst
                            fiatList={fiatList}
                            symbol={symbol}
                            onSelectWallet={this.onSelectWallet}
                            {...this.props}
                            isSearchList={this.state.isSearchList}
                            handleBack={()=>{
                                this.setState({
                                    isSearchList:false
                                })
                            }}
                            onPress={()=>{
                                this.setState({
                                    fiatList: fiatList,
                                    isSearchList: true,
                                    itemObj: ["currency","name"],
                                    name:"cash",
                                })
                            }}
                            name={this.state.name}
                            itemObj={this.state.itemObj}
                            labelSelected={this.state.labelSelected}
                        />
                        {
                            openTab === "O" ?
                                (<ItemHistory
                                    openTab ="O"
                                    onMomentScrollEnd={() => {
                                        this.loadMoreDepositeLog()
                                        this.loadWithdrawlog()
                                    }}
                                    extraData={this.state}
                                    onRefresh={this.getDepositLog}
                                    loading={loading}
                                    dataSource={this.ds.cloneWithRows(depositLog)}
                                    itemLog={depositLog}
                                    currencyList={currencyList}
                                    {...this.props}
                                />)
                                :
                                (<ItemHistory
                                    openTab ="R"
                                    onMomentScrollEnd={() => {
                                        this.loadMoreDepositeLog()
                                        this.loadWithdrawlog()
                                    }}
                                    extraData={this.state}
                                    onRefresh={this.getWithdrawLog}
                                    loading={loading}
                                    dataSource={this.ds.cloneWithRows(withdrawLog)}
                                    itemLog={withdrawLog}
                                    currencyList={currencyList}
                                    {...this.props}
                                />)
                        }
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        currencyList: state.commonReducer.currencyList,
        statusBar:state.commonReducer.statusBar
    }
}
export default connect(mapStateToProps, { setStatusBar,getConversion })(HistoryCash);
