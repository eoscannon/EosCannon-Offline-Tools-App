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

export default class BuyRamBytesPage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName BuyRamBytesPage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            isBuyRam: true,
            jsonInfo: "",
            PayerAccountName: "",
            ReceiverAccountName: "",
            BytesQuantity: "",
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
        const BuyRamAccountAction = {
            account: "eosio",
            name: "buyrambytes",
            authorization: [
                {
                    actor: "qwerasdfzxcv",
                    permission: "active",
                },
            ],
            data: {
                payer: "qwerasdfzxcv",
                receiver: "qwertyuiopas",
                bytes: 1024,
            },
        };
        const SellRamAccountAction = {
            account: "eosio",
            name: "sellram",
            authorization: [
                {
                    actor: "qwerasdfzxcv",
                    permission: "active",
                },
            ],
            data: {
                payer: "qwerasdfzxcv",
                bytes: 1024,
            },
        };
        const action = this.state.isBuyRam ? BuyRamAccountAction : SellRamAccountAction;
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
        this.props.navigation.navigate("Scanner", {backUrl: "BuyRamBytesPage"});
    };

    onChangeGetTransactionButtonState = () => {
        const { jsonInfo, PayerAccountName, ReceiverAccountName, BytesQuantity, PrivateKey} = this.state;
        this.setState({
            GetTransactionButtonState: jsonInfo && PayerAccountName && ReceiverAccountName && BytesQuantity && PrivateKey,
        });
    };

    onGetTransaction = () => {
        const { jsonInfo, PayerAccountName, ReceiverAccountName, BytesQuantity, PrivateKey} = this.state;
        const blockHeader = getTransactionHeadersFromJsonInfo(jsonInfo);
        const chainId = getChainIdFromJsonInfoOrConfig(jsonInfo);
        const actions = [];
        const BuyRamAccountAction = {
            account: "eosio",
            name: "buyrambytes",
            authorization: [
                {
                    actor: PayerAccountName,
                    permission: "active",
                },
            ],
            data: {
                payer: PayerAccountName,
                receiver: ReceiverAccountName || PayerAccountName,
                bytes: Number(BytesQuantity),
            },
        };
        const SellRamAccountAction = {
            account: "eosio",
            name: "sellram",
            authorization: [
                {
                    actor: PayerAccountName,
                    permission: "active",
                },
            ],
            data: {
                account: PayerAccountName,
                bytes: Number(BytesQuantity),
            },
        };
        const action = this.state.isBuyRam ? BuyRamAccountAction : SellRamAccountAction;
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
                    <Switch value={this.state.isBuyRam} options={{open: I18n.t("BuyRamBytesPage Switch OpenName"), close: I18n.t("BuyRamBytesPage Switch CloseName")}} onChange={isBuyRam => this.setState({isBuyRam})}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("BuyRamBytesPage TextInput PayerAccountName Label")} icon="user" placeholder={I18n.t("BuyRamBytesPage TextInput PayerAccountName Placeholder")} value={this.state.PayerAccountName} onChange={PayerAccountName => this.setState({PayerAccountName})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                {this.state.isBuyRam ? (
                    <View style={mainStyles.FromItem}>
                        <TextInput required={true} label={I18n.t("BuyRamBytesPage TextInput ReceiverAccountName Label")}  icon="user" placeholder={I18n.t("BuyRamBytesPage TextInput ReceiverAccountName Placeholder")}  value={this.state.ReceiverAccountName} onChange={ReceiverAccountName => this.setState({ReceiverAccountName})} onBlur={this.onChangeGetTransactionButtonState}/>
                    </View>
                ) : null}
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("BuyRamBytesPage TextInput BytesQuantity Label")}   icon="quantity" placeholder={I18n.t("BuyRamBytesPage TextInput BytesQuantity Placeholder")}   value={this.state.BytesQuantity} onChange={BytesQuantity => this.setState({BytesQuantity})} onBlur={this.onChangeGetTransactionButtonState}/>
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