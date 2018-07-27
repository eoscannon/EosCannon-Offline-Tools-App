// 引入公共组件
import React, { Component } from "react";
import { View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// 自定义组件
import Alert from "../../Components/Alert";
import Card from "../../Components/Card";
import Button from "../../Components/Button";
import TextArea from "../../Components/TextArea";
import TextInput from "../../Components/TextInput";
import WebView from "../../Components/WebView";
import QrCode from "../../Components/QrCode";
import PrivateKey from "../../Components/PrivateKey";
import { getTransactionHeadersFromJsonInfo, getChainIdFromJsonInfoOrConfig } from "../../utils/utils";
import { mainStyles } from "../../utils/style";
import I18n from "../../utils/I18n";

export default class UpdateAuthPage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName UpdateAuthPage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            jsonInfo: "",
            AccountName: "",
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
        const UpdateActiveKeyAction = {
            account: "eosio",
            name: "updateauth",
            authorization: [
                {
                    actor: "zhujingxinga",
                    permission: "owner",
                },
            ],
            data: {
                account: "zhujingxinga",
                permission: "active",
                parent: "owner",
                auth: "EOS6U5LBH1RyFvsUGXDE4VxUVb2ZgYiPFyz4vmve5G1agtxdTtii5",
            },
        };
        actions.push(UpdateActiveKeyAction);
        const UpdateOwnerKeyAction = {
            account: "eosio",
            name: "updateauth",
            authorization: [
                {
                    actor: "zhujingxinga",
                    permission: "owner",
                },
            ],
            data: {
                account: "zhujingxinga",
                permission: "owner",
                parent: "",
                auth: "EOS6U5LBH1RyFvsUGXDE4VxUVb2ZgYiPFyz4vmve5G1agtxdTtii5",
            },
        };
        actions.push(UpdateOwnerKeyAction);
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
        this.props.navigation.navigate("Scanner", {backUrl: "UpdateAuthPage"});
    };

    onChangeGetTransactionButtonState = () => {
        const { jsonInfo, AccountName, ActiveKey, PrivateKey} = this.state;
        this.setState({
            GetTransactionButtonState: jsonInfo && AccountName && ActiveKey && PrivateKey,
        });
    };

    onGetTransaction = () => {
        const { jsonInfo, AccountName, ActiveKey, OwnerKey, PrivateKey } = this.state;
        const blockHeader = getTransactionHeadersFromJsonInfo(jsonInfo);
        const chainId = getChainIdFromJsonInfoOrConfig(jsonInfo);
        const actions = [];
        if (ActiveKey) {
            const UpdateActiveKeyAction = {
                account: "eosio",
                name: "updateauth",
                authorization: [
                    {
                        actor: AccountName,
                        permission: "owner",
                    },
                ],
                data: {
                    account: AccountName,
                    permission: "active",
                    parent: "owner",
                    auth: ActiveKey,
                },
            };
            actions.push(UpdateActiveKeyAction);
        }
        if (OwnerKey) {
            const UpdateOwnerKeyAction = {
                account: "eosio",
                name: "updateauth",
                authorization: [
                    {
                        actor: AccountName,
                        permission: "owner",
                    },
                ],
                data: {
                    account: AccountName,
                    permission: "owner",
                    parent: "",
                    auth: OwnerKey,
                },
            };
            actions.push(UpdateOwnerKeyAction);
        }
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
                <PrivateKey/>
                <Card title={I18n.t("UpdateAuthPage UpdateAuth CardTitle")}>
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
                        <TextInput required={true} label={I18n.t("UpdateAuthPage UpdateAuth AccountName Label")} icon="user" placeholder={I18n.t("UpdateAuthPage UpdateAuth AccountName Placeholder")} value={this.state.AccountName} onChange={AccountName => this.setState({AccountName})} onBlur={this.onChangeGetTransactionButtonState}/>
                    </View>
                    <View style={mainStyles.FromItem}>
                        <TextInput required={true} label="ActiveKey" icon="lock" placeholder="ActiveKey" value={this.state.ActiveKey} onChange={ActiveKey => this.setState({ActiveKey})} onBlur={this.onChangeGetTransactionButtonState}/>
                    </View>
                    <View style={mainStyles.FromItem}>
                        <TextInput required={false} label="OwnerKey" icon="lock" placeholder="OwnerKey" value={this.state.OwnerKey} onChange={OwnerKey => this.setState({OwnerKey})} onBlur={this.onChangeGetTransactionButtonState}/>
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
                </Card>
                <View style={{height: 100}}/>
            </KeyboardAwareScrollView>
        );
    }
}
