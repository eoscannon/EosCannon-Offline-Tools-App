// 引入公共组件
import React, { Component } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// 自定义组件
import Alert from "../../Components/Alert";
import Button from "../../Components/Button";
import TextArea from "../../Components/TextArea";
import TextInput from "../../Components/TextInput";
import Select from "../../Components/Select";
import WebView from "../../Components/WebView";
import QrCode from "../../Components/QrCode";
import { getTransactionHeadersFromJsonInfo, getChainIdFromJsonInfoOrConfig } from "../../utils/utils";
import { mainStyles } from "../../utils/style";
import I18n from "../../utils/I18n";

export default class TransferPage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName TransferPage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            DigitOptions: {"0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5"},
            jsonInfo: "",
            FromAccountName: "",
            ToAccountName: "",
            transferContract: "eosio.token",
            transferQuantity: "",
            transferDigit: "4",
            transferSymbol: "EOS",
            transferMemo: "",
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
            const { responseSelected } = nextProps.navigation.state.params;
            if (responseSelected) {
                this.setState({
                    transferDigit: responseSelected,
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
        const actions = [
            {
                account: "eosio.token",
                name: "transfer",
                authorization: [
                    {
                        actor: "zhujingxinga",
                        permission: "active",
                    },
                ],
                data: {
                    from: "zhujingxinga",
                    to: "qwerasdfzxcv",
                    quantity: "1.0000 EOS",
                    memo :"",
                },
            },
        ];
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
        this.props.navigation.navigate("Scanner", {backUrl: "TransferPage"});
    };

    onChangeGetTransactionButtonState = () => {
        const { jsonInfo, FromAccountName, ToAccountName, transferContract, transferQuantity, transferDigit, transferSymbol, PrivateKey} = this.state;
        this.setState({
            GetTransactionButtonState: jsonInfo && FromAccountName && ToAccountName && transferContract && transferQuantity && transferDigit && transferSymbol && PrivateKey,
        });
    };

    onGetTransaction = () => {
        const { jsonInfo, transferContract, FromAccountName, ToAccountName, transferQuantity, transferDigit, transferSymbol, transferMemo, PrivateKey } = this.state;
        const blockHeader = getTransactionHeadersFromJsonInfo(jsonInfo);
        const chainId = getChainIdFromJsonInfoOrConfig(jsonInfo);
        const quantity = `${Number(transferQuantity).toFixed(Number(transferDigit))} ${transferSymbol.toUpperCase()}`;
        const actions = [
            {
                account: transferContract,
                name: "transfer",
                authorization: [
                    {
                        actor: FromAccountName,
                        permission: "active",
                    },
                ],
                data: {
                    from: FromAccountName,
                    to: ToAccountName,
                    quantity,
                    memo: transferMemo,
                },
            },
        ];
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
                    <TextInput required={true} label={I18n.t("TransferPage TextInput FromAccountName label")} icon="user" placeholder={I18n.t("TransferPage TextInput FromAccountName Placeholder")} value={this.state.FromAccountName} onChange={FromAccountName => this.setState({FromAccountName})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("TransferPage TextInput ToAccountName label")} icon="user" placeholder={I18n.t("TransferPage TextInput ToAccountName Placeholder")} value={this.state.ToAccountName} onChange={ToAccountName => this.setState({ToAccountName})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("TransferPage TextInput transferContract label")} icon="contract" placeholder={I18n.t("TransferPage TextInput transferContract Placeholder")} value={this.state.transferContract} onChange={transferContract => this.setState({transferContract})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("TransferPage TextInput transferQuantity label")} icon="quantity" placeholder={I18n.t("TransferPage TextInput transferQuantity Placeholder")} value={this.state.transferQuantity} onChange={transferQuantity => this.setState({transferQuantity})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("TransferPage TextInput transferSymbol label")} icon="unit" placeholder={I18n.t("TransferPage TextInput transferSymbol Placeholder")} value={this.state.transferSymbol} onChange={transferSymbol => this.setState({transferSymbol})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={[mainStyles.FromItem, {zIndex: 1000}]}>
                    <Select required={true} label={I18n.t("TransferPage Select transferDigit label")} icon="digit" placeholder={I18n.t("TransferPage Select transferDigit Placeholder")} title={I18n.t("TransferPage Select transferDigit Title")} backUrl="TransferPage" isMultiSelect={false}  options={this.state.DigitOptions} selected={this.state.transferDigit} navigation={this.props.navigation}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label="Memo" icon="unit" placeholder="Memo" value={this.state.transferMemo} onChange={transferMemo => this.setState({transferMemo})} onBlur={this.onChangeGetTransactionButtonState}/>
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
