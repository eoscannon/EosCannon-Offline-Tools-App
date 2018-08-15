// 引入公共组件
import React, { Component } from "react";
import { View, TextInput } from "react-native";
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

export default class SignPage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName SignPage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            UnSignedBuffer: "",
            OriginPrivateKeyOptions: [],
            PrivateKeyOptions: [],
            SelectPrivateKey: "",
            PrivateKey: "",
            GetTransactionButtonState: false,
            signature: "",
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

    componentDidMount() {
        // setTimeout(() => {
        //     this.onGetTransactionTest();
        // }, 2000);
    }

    onGetTransactionTest = () => {
        const data = {
            method: "signTransaction",
            data: {
                UnSignedBuffer: "303338663462306663386666313861346630383432613866303536343631316636653936653835333539303164643435653433616338363931613163346463610cbd6a5bdf03442ba67900000000010000000000ea305500003f2a1ba6a24a0160d8749d4df774fb00000000a8ed32323160d8749d4df774fb60d8749d4df774fb102700000000000004454f5300000000204e00000000000004454f530000000000000000000000000000000000000000000000000000000000000000000000000000",
                PrivateKey: "5J9ebToVxUZKDzdyWLEjvYfuzkzV87hqTtoBVq28Wu8JNFRS7fx",
            },
        };
        this.refs.Ecc.refs.WebView.postMessage(JSON.stringify(data));
    };

    openCamera = () => {
        this.props.navigation.navigate("Scanner", {backUrl: "SignPage"});
    };

    onChangeGetTransactionButtonState = () => {
        const { UnSignedBuffer, PrivateKey} = this.state;
        this.setState({
            GetTransactionButtonState: !!UnSignedBuffer && !!PrivateKey,
        });
    };

    onGetTransaction = () => {
        const { UnSignedBuffer, PrivateKey } = this.state;
        const data = {
            method: "signTransaction",
            data: {
                UnSignedBuffer,
                PrivateKey,
            },
        };
        this.refs.Ecc.refs.WebView.postMessage(JSON.stringify(data));
    };

    onMessage = (e) => {
        console.log(e.nativeEvent.data);
        const response = JSON.parse(e.nativeEvent.data);
        this.setState({
            signature: response.data.signature,
        });
    };

    getPrivateKeyFromStorage = () => {
        storage.load({key: "PrivateKeyArr"}).then((ret) => {
            if (ret) {
                const PrivateKeyOptionsStrArr = CryptoJS.AES.decrypt(ret, global.OpenPassword).toString(CryptoJS.enc.Utf8).split("&&");
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
                <EccWebView ref="Ecc" onMessage={this.onMessage}/>
                <View style={mainStyles.FromItem}>
                    <Alert title={I18n.t("SignPage BlockInfo Alert Title")} Description={I18n.t("SignPage BlockInfo Alert Description")}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Button name={I18n.t("SignPage BlockInfo Button ButtonName")} onPress={this.openCamera} Disable={true}/>
                </View>
                {/*<View style={mainStyles.FromItem}>*/}
                {/*<TextArea text={this.state.UnSignedBuffer} placeholder={I18n.t("SignPage BlockInfo TextArea Placeholder")}/>*/}
                {/*</View>*/}
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
                    <Select required={true} label={I18n.t("SignPage Select PrivateKey Label")} icon="lock" placeholder={I18n.t("SignPage Select PrivateKey Placeholder")} title={I18n.t("SignPage Select PrivateKey Title")} backUrl="SignPage" isMultiSelect={false}  options={this.state.PrivateKeyOptions} selected={this.state.SelectPrivateKey} navigation={this.props.navigation} responseName="responseSelectedPk"/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Button name={I18n.t("SignPage SignButton Name")} onPress={this.onGetTransaction} Disable={this.state.GetTransactionButtonState}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Alert title={I18n.t("SignPage Signed Alert Title")} Description={I18n.t("SignPage Signed Alert Description")} />
                </View>
                <View style={mainStyles.FromItem}>
                    <TextArea text={this.state.signature} placeholder={I18n.t("SignPage Signed TextArea Placeholder")} />
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
