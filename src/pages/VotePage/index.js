// 引入公共组件
import React, { Component } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CryptoJS from "crypto-js";

// 自定义组件
import Alert from "../../Components/Alert";
import Button from "../../Components/Button";
import TextArea from "../../Components/TextArea";
import TextInput from "../../Components/TextInput";
import Select from "../../Components/Select";
import WebView from "../../Components/WebView";
import QrCode from "../../Components/QrCode";
import {
    voteNodes, getTransactionHeadersFromJsonInfo, getChainIdFromJsonInfoOrConfig,
    PrivateKeyFormat, getPrivateKeyBySelectedPk
} from "../../utils/utils";
import { mainStyles } from "../../utils/style";
import I18n from "../../utils/I18n";
import {storage} from "../../utils/storage";

export default class VotePage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName VotePage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            OriginPrivateKeyOptions: [],
            PrivateKeyOptions: [],
            jsonInfo: "",
            VoterAccountName: "",
            Producers: ["eoscannonchn"],
            PrivateKey: "",
            SelectPrivateKey: "",
            GetTransactionButtonState: false,
            transaction: "",
            code: "",
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params) {
            const { jsonInfo, data } = nextProps.navigation.state.params;

            if (jsonInfo) {
                this.setState({
                    jsonInfo,
                }, () => {this.onChangeGetTransactionButtonState();});
            }

            if (data && data.responseSelectedPk) {
                const PrivateKey = getPrivateKeyBySelectedPk(data.responseSelectedPk, this.state.OriginPrivateKeyOptions);
                this.setState({
                    SelectPrivateKey: data.responseSelectedPk,
                    PrivateKey,
                }, () => {this.onChangeGetTransactionButtonState();});
            }

            if (data && data.responseSelectedProducers) {
                this.setState({
                    Producers: data.responseSelectedProducers.sort(),
                });
            }
        }
    }

    componentWillMount() {
        this.getPrivateKeyFromStorage();
    };

    componentDidMount() {
        // setTimeout(() => {
        //     this.onGetTransactionTest();
        // }, 2000);
    }

    onGetTransactionTest = () => {
        const actions = [
            {
                account: "eosio",
                name: "voteproducer",
                authorization: [
                    {
                        actor: "zhujingxinga",
                        permission: "active",
                    },
                ],
                data: {
                    voter: "zhujingxinga",
                    proxy: "",
                    producers: ["acryptolions"],
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
        this.props.navigation.navigate("Scanner", {backUrl: "VotePage"});
    };

    onChangeGetTransactionButtonState = () => {
        const { jsonInfo, VoterAccountName, Producers, PrivateKey} = this.state;
        this.setState({
            GetTransactionButtonState: jsonInfo && VoterAccountName && Producers && PrivateKey,
        });
    };

    onGetTransaction = () => {
        const { jsonInfo, VoterAccountName, Producers, PrivateKey } = this.state;
        const blockHeader = getTransactionHeadersFromJsonInfo(jsonInfo);
        const chainId = getChainIdFromJsonInfoOrConfig(jsonInfo);
        const actions = [
            {
                account: "eosio",
                name: "voteproducer",
                authorization: [
                    {
                        actor: VoterAccountName,
                        permission: "active",
                    },
                ],
                data: {
                    voter: VoterAccountName,
                    proxy: "",
                    producers: Producers,
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

    getPrivateKeyFromStorage = () => {
        storage.load({key: "PrivateKeyArr"}).then((ret) => {
            if (ret) {
                const PrivateKeyOptionsStrArr = CryptoJS.AES.decrypt(ret, "'secret key 123'").toString(CryptoJS.enc.Utf8).split("&&");
                PrivateKeyOptionsStrArr.forEach(item => {
                    const obj = JSON.parse(item);
                    this.state.OriginPrivateKeyOptions.push(obj);
                    this.state.PrivateKeyOptions.push(obj.Nick + "：" + PrivateKeyFormat(obj.PrivateKey));
                });
                this.setState({
                    OriginPrivateKeyOptions: this.state.OriginPrivateKeyOptions,
                    PrivateKeyOptions: this.state.PrivateKeyOptions,
                });
            }
        }).catch(err => {
            console.log(err);
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
                    <TextInput required={true} label={I18n.t("VotePage TextInput VoterAccountName label")} icon="user" placeholder={I18n.t("VotePage TextInput VoterAccountName Placeholder")} value={this.state.VoterAccountName} onChange={VoterAccountName => this.setState({VoterAccountName})} onBlur={this.onChangeGetTransactionButtonState}/>
                </View>
                <View style={[mainStyles.FromItem]}>
                    <Select required={true} label={I18n.t("VotePage Select Producers label")} icon="user" placeholder={I18n.t("VotePage Select Producers Placeholder")} title={I18n.t("VotePage Select Producers Title")} backUrl="VotePage" isMultiSelect={true}  options={voteNodes} selected={this.state.Producers} navigation={this.props.navigation} responseName="responseSelectedProducers"/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Select required={true} label={I18n.t("Public Select PrivateKey")} icon="lock" placeholder={I18n.t("Public Select PrivateKey")} title={I18n.t("Public Select PrivateKey Title")} backUrl="VotePage" isMultiSelect={false}  options={this.state.PrivateKeyOptions} selected={this.state.SelectPrivateKey} navigation={this.props.navigation} responseName="responseSelectedPk"/>
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
