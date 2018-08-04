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
    getTransactionHeadersFromJsonInfo, getChainIdFromJsonInfoOrConfig, PrivateKeyFormat,
    getPrivateKeyBySelectedPk
} from "../../utils/utils";
import { mainStyles } from "../../utils/style";
import I18n from "../../utils/I18n";
import {storage} from "../../utils/storage";

export default class CreateAccountPage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName CreateAccountPage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            OriginPrivateKeyOptions: [],
            PrivateKeyOptions: [],
            jsonInfo: "",
            CreateAccountName: "",
            NewAccountName: "",
            OwnerKey: "",
            ActiveKey: "",
            Bytes: "",
            StakeNet: "",
            StakeCpu: "",
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
                    <Select required={true} label={I18n.t("Public Select PrivateKey")} icon="lock" placeholder={I18n.t("Public Select PrivateKey")} title={I18n.t("Public Select PrivateKey Title")} backUrl="CreateAccountPage" isMultiSelect={false}  options={this.state.PrivateKeyOptions} selected={this.state.SelectPrivateKey} navigation={this.props.navigation} responseName="responseSelectedPk"/>
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
