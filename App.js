// 引入公共组件
import React, { Component } from "react";
import {createStore } from "redux";
import {Provider} from "react-redux";
import { StackNavigator } from "react-navigation";

// 引入自定义组件
import reducers from "./src/utils/reducers";

// 引入自定义组件
import HomePage from "./src/pages/HomePage";
import CreateAccountPage from "./src/pages/CreateAccountPage";
import StakePage from "./src/pages/StakePage";
import BuyRamBytesPage from "./src/pages/BuyRamBytesPage";
import TransferPage from "./src/pages/TransferPage";
import VotePage from "./src/pages/VotePage";
import ProxyPage from "./src/pages/ProxyPage";
import Scanner from "./src/Components/Scanner";
import SelectPage from "./src/Components/SelectPage";
import RefundPage from "./src/pages/RefundPage";
import UpdateAuthPage from "./src/pages/UpdateAuthPage";

// 自定义变量
const Navigator = StackNavigator(
    {
        HomePage: { screen: HomePage },
        Scanner: { screen: Scanner },
        SelectPage: { screen: SelectPage },
        TransferPage: { screen: TransferPage },
        CreateAccountPage: { screen: CreateAccountPage },
        StakePage: { screen: StakePage },
        VotePage: { screen: VotePage },
        ProxyPage: { screen: ProxyPage },
        RefundPage: { screen: RefundPage },
        UpdateAuthPage: { screen: UpdateAuthPage },
        BuyRamBytesPage: { screen: BuyRamBytesPage },
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: "#fafafa",
                borderBottomWidth: 0,
                elevation: 0,
            },
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#222",
                lineHeight: 26,
                textAlign: "center",
            },
            headerTintColor: "#323232",
            headerBackTitle: null,
        },
    },
);

const myStore = createStore(
    reducers
);
export default class App extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Provider store={myStore}>
                <Navigator/>
            </Provider>
        );
    }
}
