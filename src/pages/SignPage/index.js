// 引入公共组件
import React, { Component } from "react";
import { View, TextInput , Switch ,Text} from "react-native";
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
import { Api  ,JsonRpc} from './../../utils/eosjs/dist/index.js';
const { TextDecoder, TextEncoder } = require('text-encoding'); 


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
            swicthStatus: false,
            deserializeActionsData: "",
            switchvalue:true
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params) {
            const { UnSignedBuffer, SelectedData } = nextProps.navigation.state.params;

            if (UnSignedBuffer) {
                this.setState({
                    UnSignedBuffer,
                }, () => {
                    this.onChangeGetTransactionButtonState();
                });
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
        const decryptPrivateKey = this.decryptPrivateKey(PrivateKey);
        var newUnSignedBuffer,UnSignedBufferParse
        if(UnSignedBuffer.match('{')){
            UnSignedBufferParse = JSON.parse(UnSignedBuffer)
            newUnSignedBuffer = UnSignedBufferParse.sign
        }else{
            UnSignedBufferParse = UnSignedBuffer
            newUnSignedBuffer = UnSignedBuffer
        }
        const data = {
            method: "signTransaction",
            data: {
                UnSignedBuffer: newUnSignedBuffer,
                PrivateKey: decryptPrivateKey,
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

    getData = async(hexStr) => {
        // alert("1")
        var rpc
        if(!rpc) rpc = new JsonRpc(null, {fetch});  
        var api = new Api(
            { rpc: rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(), chainId: null}
            );

        // let hexStr = "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e9061f5cb45c73c9ef7ef189000000000100a6823403ea3055000000572d3ccdcd011042c62a4f3aa74100000000a8ed3232281042c62a4f3aa7412042c62a4f3aa741102700000000000004454f530000000007796f756b6e6f77000000000000000000000000000000000000000000000000000000000000000000"
        let testHex = hexStr.slice(64,-64)
        var view = new Uint8Array(testHex.length / 2)
        for (var i = 0; i < testHex.length; i += 2) {
          view[i / 2] = parseInt(testHex.substring(i, i + 2), 16)
        }

        let data = await api.deserializeTransaction(view)
        let actionData = await api.deserializeActions(data.actions) 
        this.setState({deserializeActionsData: JSON.stringify(actionData, null , 2)})
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
            }[]
        }).catch(err => {
            console.log(err);
        });
    };

    getSwitchData =()=>{

        if(this.state.UnSignedBuffer){
            const data = {
                method: "deserializeTransaction",
                data: this.state.UnSignedBuffer 
            };
            this.setState({deserializeActionsData: '仅能解析eos系统功能的交易'})
            this.getData(this.state.UnSignedBuffer )

            // console.log('deserializeTransaction ', this.state.UnSignedBuffer )
            // this.refs.Ecc.refs.WebView.postMessage(JSON.stringify(data));     
        }
    }

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
               
                <View style={{flexDirection:'row',paddingLeft:10}}>
                    <View style={{paddingTop:8}}>
                        {this.state.switchvalue?(
                            <Text>查看原始数据</Text>
                        ):(
                            <Text>查看未签名报文</Text>
                        )}
                    </View>
                    
                    <Switch style={{marginLeft: 5,marginBottom: 5}}
                        value={this.state.swicthStatus}
                        onValueChange={(value)=> {
                            this.setState({
                                swicthStatus: value,
                                switchvalue:!this.state.switchvalue
                            }),
                            this.getSwitchData()
                        }}/>
                </View>
                        
                {!this.state.swicthStatus ? (
                    <View style={[mainStyles.FromItem, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
                        <TextInput
                            style={{width: "100%", height: 110, padding: 7, borderColor: "#ddd", borderWidth: 1, borderRadius: 4}}
                            onChangeText={(UnSignedBuffer) => this.setState({UnSignedBuffer})}
                            value={this.state.UnSignedBuffer}
                            placeholder={I18n.t("SignPage BlockInfo TextArea Placeholder")}
                            multiline={true}
                            contextMenuHidden={true}
                        />
                    </View>
                ):(
                    <View style={[mainStyles.FromItem, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
                        <TextInput
                            style={{width: "100%", height: 120, padding: 7, borderColor: "#ddd", borderWidth: 1, borderRadius: 4}}
                            onChangeText={(deserializeActionsData) => this.setState({deserializeActionsData})}
                            value={this.state.deserializeActionsData}
                            placeholder={I18n.t("SignPage BlockInfo TextArea Placeholder")}
                            multiline={true}
                            contextMenuHidden={true}
                        />
                    </View>
                )}

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
