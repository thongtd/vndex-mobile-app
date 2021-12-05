import {combineReducers} from 'redux'
import marketReducer from './market.reducer'
import tradeReducer from './trade.reducer'
import commonReducer from './common.reducer'
import walletReducer from './wallet.reducer'

export default rootReducer = combineReducers({
    tradeReducer,
    marketReducer,
    commonReducer,
    walletReducer
})
