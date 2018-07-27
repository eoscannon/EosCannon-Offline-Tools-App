// 引入公共组件
import React, { Component } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// 自定义组件
import Alert from "../../Components/Alert";
import Button from "../../Components/Button";
import TextArea from "../../Components/TextArea";
import TextInput from "../../Components/TextInput";
import Switch from "../../Components/Switch";
import WebView from "../../Components/WebView";
import QrCode from "../../Components/QrCode";
import { getTransactionHeadersFromJsonInfo, getChainIdFromJsonInfoOrConfig } from "../../utils/utils";
import { mainStyles } from "../../utils/style";
import I18n from "../../utils/I18n";

export default class StakePage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName StakePage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            isDelegate: true,
            jsonInfo: "",
            FromAccountName: "",
            ReceiverAccountName: "",
            StakeNet: "",
            StakeCpu: "",
            PrivateKey: "",
            GetTransactionButtonState: false,
            transaction: "",
            code: "",
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params) {
            const { jsonInfo } = nextProps.navigation.state.params;
            if (jsonInfo) {
                this.setState({
                    jsonInfo,
                });
            }
        }
    }

    componentDidMount() {
        // setTimeout(() => {
        //     this.onGetTransactionTest();
        // }, 2000);
    }

    onGetTransactionTest = () => {
        const actions = [];
        const DelegateAccountAction = {
            account: "eosio",
            name: "delegatebw",
            authorization: [
                {
                    actor: "qwerasdfzxcv",
                    permission: "active",
                },
            ],
            data: {
                from: "qwerasdfzxcv",
                receiver: "qwertyuiopas" || "qwerasdfzxcv",
                stake_net_quantity: "1.0000 EOS",
                stake_cpu_quantity: "1.0000 EOS",
                transfer: 0,
            },
        };
        const UnDelegateAccountAction = {
            account: "eosio",
            name: "undelegatebw",
            authorization: [
                {
                    actor: "qwerasdfzxcv",
                    permission: "active",
                },
            ],
            data: {
                from: "qwerasdfzxcv",
                receiver: "qwertyuiopas"  || "qwerasdfzxcv",
                unstake_net_quantity: "1.0000 EOS",
                unstake_cpu_quantity: "1.0000 EOS",
            },
        };
        const action = this.state.isDelegate ? DelegateAccountAction : UnDelegateAccountAction;
        actions.push(action);
        const data = {
            blockHeader: {
                expiration: "2018-07-21T15:31:38",
                ref_block_num: 64400,
                ref_block_prefix: 3802453534
            },
            chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca",
            PrivateKey: "5J6vMf4P6Hn4GP5CdanmpZyEV3XcGvQ4CCqhfD7khwkjeS5hNgq",
            actions,
        };
        this.refs.WebViewComp.refs.WebView.postMessage(JSON.stringify(data));
    };

    openCamera = () => {
        this.props.navigation.navigate("Scanner", {backUrl: "StakePage"});
    };

    onChangeGetTransactionButtonState = () => {
        const { jsonInfo, FromAccountName, ReceiverAccountName, StakeNet, StakeCpu, PrivateKey} = this.state;
        this.setState({
            GetTransactionButtonState: jsonInfo && FromAccountName && ReceiverAccountName && StakeNet && StakeCpu && PrivateKey,
        });
    };

    onGetTransaction = () => {
        const { jsonInfo, FromAccountName, ReceiverAccountName, StakeNet, StakeCpu, PrivateKey} = this.state;
        const blockHeader = getTransactionHeadersFromJsonInfo(jsonInfo);
        const chainId = getChainIdFromJsonInfoOrConfig(jsonInfo);
        const actions = [];
        const DelegateAccountAction = {
            account: "eosio",
            name: "delegatebw",
            authorization: [
                {
                    actor: FromAccountName,
                    permission: "active",
                },
            ],
            data: {
                from: FromAccountName,
                receiver: ReceiverAccountName || FromAccountName,
                stake_net_quantity: `${Number(StakeNet).toFixed(4)} EOS`,
                stake_cpu_quantity: `${Number(StakeCpu).toFixed(4)} EOS`,
                transfer: 0,
            },
        };
        const UnDelegateAccountAction = {
            account: "eosio",
            name: "undelegatebw",
            authorization: [
                {
                    actor: FromAccountName,
                    permission: "active",
                },
            ],
            data: {
                from: FromAccountName,
                receiver: ReceiverAccountName  || FromAccountName,
                unstake_net_quantity: `${Number(StakeNet).toFixed(4)} EOS`,
                unstake_cpu_quantity: `${Number(StakeCpu).toFixed(4)} EOS`,
            },
        };
        const action = this.state.isDelegate ? DelegateAccountAction : UnDelegateAccountAction;
        actions.push(action);
        const data = {
            blockHeader,
            chainId,
            actions,
            PrivateKey,
        };
        this.refs.WebViewComp.refs.WebView.postMessage(JSON.stringify(data));
    };

    onMessage = (e) => {
        console.log(e.nativeEvent.data);
        this.setState({
            transaction: e.nativeEvent.data,
            code: e.nativeEvent.data,
        });
    };

    render() {
        return (
            <KeyboardAwareScrollView style={mainStyles.BodyBox}>
                <WebView ref="WebViewComp" onMessage={this.onMessage}/>
                <View style={mainStyles.FromItem}>
                    <Alert title={I18n.t("Public BlockInfo Title")} Description={I18n.t("Public BlockInfo Description")}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Button name={I18n.t("Public BlockInfo ButtonName")} onPress={this.openCamera} Disable={true}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextArea text={this.state.jsonInfo} placeholder={I18n.t("Public BlockInfo Placeholder")}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Alert title={I18n.t("Public SignAlter Title")} Description={I18n.t("Public SignAlter Description")} />
                </View>
                <View style={mainStyles.FromItem}>
                    <Switch value={this.state.isDelegate} options={{open: I18n.t("StakePage Switch OpenName"), close: I18n.t("StakePage Switch CloseName")}} onChange={isDelegate => this.setState({isDelegate})}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("StakePage TextInput FromAccountName label")} icon="user" placeholder={I18n.t("StakePage TextInput FromAccountName Placeholder")} value={this.state.FromAccountName}  onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("StakePage TextInput ReceiverAccountName label")} icon="user" placeholder={I18n.t("StakePage TextInput ReceiverAccountName Placeholder")} value={this.state.ReceiverAccountName} onChange={ReceiverAccountName => this.setState({ReceiverAccountName})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label="StakeNet" icon="quantity" placeholder="StakeNet" value={this.state.StakeNet} onChange={StakeNet => this.setState({StakeNet})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label="StakeCpu" icon="quantity" placeholder="StakeCpu" value={this.state.StakeCpu} onChange={StakeCpu => this.setState({StakeCpu})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("Public TextInput PrivateKey")} icon="lock" placeholder={I18n.t("Public TextInput PrivateKey")} value={this.state.PrivateKey} onChange={PrivateKey => this.setState({PrivateKey})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Button name={I18n.t("Public SignButton Name")} onPress={this.onGetTransaction} Disable={this.state.GetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Alert title={I18n.t("Public SignedAlert Title")} Description={I18n.t("Public SignedAlert Description")} />
                </View>
                <View style={mainStyles.FromItem}>
                    <TextArea text={this.state.transaction} placeholder={I18n.t("Public SignedTextArea Placeholder")} />
                </View>
                <View style={mainStyles.FromItem}>
                    <QrCode value={this.state.code}/>
                </View>
                <View style={{height: 100}}/>
            </KeyboardAwareScrollView>
        );
    }
}
