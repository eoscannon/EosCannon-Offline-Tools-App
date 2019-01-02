// 引入公共组件
import React, { Component } from "react";
import { View, TextInput, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CryptoJS from "crypto-js";

// 自定义组件
import I18n from "../../utils/I18n";
import Alert from "../../Components/Alert";
import Button from "../../Components/Button";
import TextArea from "../../Components/TextArea";

import Select from "../../Components/Select";
import EccWebView from "../../Components/EccWebView";
import QrCode from "../../Components/QrCode";
import { PrivateKeyFormat, getPrivateKeyBySelectedPk } from "../../utils/utils";
import { mainStyles } from "../../utils/style";
import { storage } from "../../utils/storage";

export default class LoginPage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName LoginPage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            UnSignedBuffer: '',
            OriginPrivateKeyOptions: [],
            PrivateKeyOptions: [],
            SelectPrivateKey: "",
            PrivateKey: "",
            GetTransactionButtonState: false,
            signature: "",
            account:''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params) {
            const { UnSignedBuffer, SelectedData } = nextProps.navigation.state.params;

            if (UnSignedBuffer) {
                this.setState({
                    UnSignedBuffer,
                }, () => {this.onChangeGetTransactionButtonState();});
            }

            if (SelectedData && SelectedData.responseSelectedPk) {
                const PrivateKey = getPrivateKeyBySelectedPk(SelectedData.responseSelectedPk, this.state.OriginPrivateKeyOptions);
                this.setState({
                    SelectPrivateKey: SelectedData.responseSelectedPk,
                    PrivateKey,
                }, () => {this.onChangeGetTransactionButtonState();});
            }
        }
    }

    componentWillMount() {
        this.getPrivateKeyFromStorage();
    };

    openCamera = () => {
        this.props.navigation.navigate("Scanner", {backUrl: "LoginPage"});
    };

    onChangeGetTransactionButtonState = () => {
        const { UnSignedBuffer, PrivateKey, account} = this.state;
        this.setState({
            GetTransactionButtonState: !!UnSignedBuffer && !!PrivateKey ,
        });
    };

    onGetTransaction = () => {
        const { UnSignedBuffer, PrivateKey, account } = this.state;
        const decryptPrivateKey = this.decryptPrivateKey(PrivateKey);
        const data = {
            method: "signLoginTransaction",
            data: {
                UnSignedBuffer:JSON.parse(UnSignedBuffer).uuID,
                PrivateKey: decryptPrivateKey,
                account:account.toLowerCase().trim()
            },
        };
        this.refs.Ecc.refs.WebView.postMessage(JSON.stringify(data));
    };

    onMessage = (e) => {
        const { UnSignedBuffer, account } = this.state;
        newUnSignedBuffer = JSON.parse(UnSignedBuffer)
        console.log(e.nativeEvent.data);
        const response = JSON.parse(e.nativeEvent.data);
        this.setState({
            signature: JSON.stringify({
                protocol:newUnSignedBuffer.protocol,
                version:newUnSignedBuffer.version,
                timestamp:response.data.time,
                sign:response.data.signature,
                uuID: newUnSignedBuffer.uuID,
                account: account.toLowerCase().trim(),
                loginUrl:newUnSignedBuffer.loginUrl,
                ref: 'wallet'
            })
        });
        console.log('newUnSignedBuffer',this.state.signature)
    };
    onChange = (value)=>{
        this.setState({
            account: value
        })
    }

    decryptPrivateKey = PrivateKey => CryptoJS.AES.decrypt(PrivateKey, global.OpenPasswordMd5).toString(CryptoJS.enc.Utf8);

    getPrivateKeyFromStorage = () => {
        storage.load({key: "PrivateKeyArr"}).then((ret) => {
            if (ret) {
                const PrivateKeyOptionsStrArr = ret.split("&&");
                PrivateKeyOptionsStrArr.forEach(item => {
                    const obj = JSON.parse(item);
                    const decryptPrivateKey = this.decryptPrivateKey(obj.PrivateKey);
                    this.state.OriginPrivateKeyOptions.push(obj);
                    this.state.PrivateKeyOptions.push(obj.Nick + "：" + PrivateKeyFormat(decryptPrivateKey));
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
                <EccWebView ref="Ecc" onMessage={this.onMessage}/>
                <View style={mainStyles.FromItem}>
                    <Alert title={I18n.t("SignPage BlockInfo Alert Title")} Description={I18n.t("SignPage BlockInfo Alert Description")}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Button name={I18n.t("SignPage BlockInfo Button ButtonName")} onPress={this.openCamera} Disable={true}/>
                </View>
                <View style={[mainStyles.FromItem, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
                    <TextInput
                        style={{width: "100%", height: 104, padding: 7, borderColor: "#ddd", borderWidth: 1, borderRadius: 4}}
                        onChangeText={(UnSignedBuffer) => this.setState({UnSignedBuffer})}
                        value={this.state.UnSignedBuffer}
                        placeholder={I18n.t("SignPage BlockInfo TextArea Placeholder")}
                        multiline={true}
                        contextMenuHidden={true}
                    />
                </View>
                <View style={mainStyles.FromItem}>
                    <Select label={I18n.t("SignPage Select PrivateKey Label")} icon="lock" placeholder={I18n.t("SignPage Select PrivateKey Placeholder")} title={I18n.t("SignPage Select PrivateKey Title")} backUrl="LoginPage" isMultiSelect={false}  options={this.state.PrivateKeyOptions} selected={this.state.SelectPrivateKey} navigation={this.props.navigation} responseName="responseSelectedPk"
                    style={{ padding: 7, borderColor: "#ddd", borderWidth: 1, borderRadius: 4}}
                    />
                </View>
                <View style={[mainStyles.FromItem, { justifyContent: "space-between", alignItems: "flex-start", verticalAlign:'middle'}]}>
                    <Text style={{alignItems: 'center',paddingTop:6}}>{I18n.t("LoginPage account Label")}:</Text>
                    <TextInput
                        style={{ width:'75%' ,padding: 7, borderColor: "#ddd", borderWidth: 1, borderRadius: 4}}
                        placeholder='input account'
                        placeholderTextColor="#aaa"
                        selectionColor="#111"
                        value={this.state.account}
                        onChangeText={(val) => this.setState({account: val})}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <View style={mainStyles.FromItem}>
                    <Button name={I18n.t("SignPage SignButton Name")} onPress={this.onGetTransaction} Disable={this.state.GetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Alert title={I18n.t("SignPage Signed Alert Title")} Description={I18n.t("SignPage Signed Alert Description")} />
                </View>
                <View style={mainStyles.FromItem}>
                    <TextArea text={this.state.signature} placeholder={I18n.t("SignPage Signed TextArea Placeholder")} 
                        style={{width: "100%", height: 104, padding: 7, borderColor: "#ddd", borderWidth: 1, borderRadius: 4}}
                    />
                </View>
                {!!this.state.signature ? (
                    <View style={mainStyles.FromItem}>
                        <QrCode value={this.state.signature}/>
                    </View>
                ) : null}
                <View style={{height: 100}}/>
            </KeyboardAwareScrollView>
        );
    }
}
