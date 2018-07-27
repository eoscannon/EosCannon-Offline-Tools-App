// 引入公共组件
import React, { Component } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// 自定义组件
import Alert from "../../Components/Alert";
import Button from "../../Components/Button";
import TextArea from "../../Components/TextArea";
import TextInput from "../../Components/TextInput";
import WebView from "../../Components/WebView";
import QrCode from "../../Components/QrCode";
import { getTransactionHeadersFromJsonInfo, getChainIdFromJsonInfoOrConfig } from "../../utils/utils";
import { mainStyles } from "../../utils/style";
import I18n from "../../utils/I18n";

export default class CreateAccountPage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName CreateAccountPage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            jsonInfo: "",
            CreateAccountName: "",
            NewAccountName: "",
            OwnerKey: "",
            ActiveKey: "",
            Bytes: "",
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
        const NewAccountAction = {
            account: "eosio",
            name: "newaccount",
            authorization: [
                {
                    actor: "qwerasdfzxcv",
                    permission: "active",
                },
            ],
            data: {
                creator: "qwerasdfzxcv",
                name: "qwertyuiopas",
                owner: "EOS6U5LBH1RyFvsUGXDE4VxUVb2ZgYiPFyz4vmve5G1agtxdTtii5",
                active: "EOS6U5LBH1RyFvsUGXDE4VxUVb2ZgYiPFyz4vmve5G1agtxdTtii5",
            },
        };
        actions.push(NewAccountAction);
        const BuyRamBytesAction = {
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
                bytes: 4096,
            },
        };
        actions.push(BuyRamBytesAction);
        const DelegateBwAction = {
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
                receiver: "qwertyuiopas",
                stake_net_quantity: "1.0000 EOS",
                stake_cpu_quantity: "1.0000 EOS",
                transfer: 0,
            },
        };
        actions.push(DelegateBwAction);
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
        this.props.navigation.navigate("Scanner", {backUrl: "CreateAccountPage"});
    };

    onChangeGetTransactionButtonState = () => {
        const { jsonInfo, CreateAccountName, NewAccountName, OwnerKey, ActiveKey, StakeNet, StakeCpu, Bytes, PrivateKey} = this.state;
        this.setState({
            GetTransactionButtonState: jsonInfo && CreateAccountName && NewAccountName && OwnerKey && ActiveKey && StakeNet && StakeCpu && Bytes && PrivateKey,
        });
    };

    onGetTransaction = () => {
        const { jsonInfo, CreateAccountName, NewAccountName, OwnerKey, ActiveKey, StakeNet, StakeCpu, Bytes, PrivateKey} = this.state;
        const blockHeader = getTransactionHeadersFromJsonInfo(jsonInfo);
        const chainId = getChainIdFromJsonInfoOrConfig(jsonInfo);
        const actions = [];
        const NewAccountAction = {
            account: "eosio",
            name: "newaccount",
            authorization: [
                {
                    actor: CreateAccountName,
                    permission: "active",
                },
            ],
            data: {
                creator: CreateAccountName,
                name: NewAccountName,
                owner: OwnerKey,
                active: ActiveKey,
            },
        };
        actions.push(NewAccountAction);
        const BuyRamBytesAction = {
            account: "eosio",
            name: "buyrambytes",
            authorization: [
                {
                    actor: CreateAccountName,
                    permission: "active",
                },
            ],
            data: {
                payer: CreateAccountName,
                receiver: NewAccountName,
                bytes: Number(Bytes),
            },
        };
        actions.push(BuyRamBytesAction);
        const DelegateBwAction = {
            account: "eosio",
            name: "delegatebw",
            authorization: [
                {
                    actor: CreateAccountName,
                    permission: "active",
                },
            ],
            data: {
                from: CreateAccountName,
                receiver: NewAccountName,
                stake_net_quantity: `${Number(StakeNet).toFixed(4).toString()} EOS`,
                stake_cpu_quantity: `${Number(StakeCpu).toFixed(4).toString()} EOS`,
                transfer: 0,
            },
        };
        actions.push(DelegateBwAction);
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
                    <TextInput required={true} label={I18n.t("CreateAccountPage TextInput CreateAccountName label")} icon="user" placeholder={I18n.t("CreateAccountPage TextInput CreateAccountName Placeholder")} value={this.state.CreateAccountName} onChange={CreateAccountName => this.setState({CreateAccountName})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("CreateAccountPage TextInput NewAccountName label")} icon="user" placeholder={I18n.t("CreateAccountPage TextInput NewAccountName Placeholder")} value={this.state.NewAccountName} onChange={NewAccountName => this.setState({NewAccountName})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={false} label="OwnerKey" icon="lock" placeholder="OwnerKey" value={this.state.OwnerKey} onChange={OwnerKey => this.setState({OwnerKey})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label="ActiveKey" icon="lock" placeholder="ActiveKey" value={this.state.ActiveKey} onChange={ActiveKey => this.setState({ActiveKey})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("CreateAccountPage TextInput BytesQuantity label")} icon="quantity" placeholder={I18n.t("CreateAccountPage TextInput BytesQuantity Placeholder")} value={this.state.Bytes} onChange={Bytes => this.setState({Bytes})} onBlur={this.onChangeGetTransactionButtonState}/>
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
