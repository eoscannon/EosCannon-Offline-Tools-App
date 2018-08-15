// 引入公共组件
import React, { Component } from "react";
import { View, Text, Modal, Clipboard, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Ionicons";
import CryptoJS from "crypto-js";

// 自定义组件
import I18n from "../../utils/I18n";
import Card from "../../Components/Card";
import Button from "../../Components/Button";
import TextInput from "../../Components/TextInput";
import QrCode from "../../Components/QrCode";
import EccWebView from "../../Components/EccWebView";
import { mainStyles, PrivatePageStyles } from "../../utils/style";
import {localSave, storage} from "../../utils/storage";
import { PrivateKeyFormat } from "../../utils/utils";

export default class PrivatePage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName PrivatePage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            createPublicKey: "",
            createPrivateKey: "",
            checkPrivateKey: "",
            checkPublicKey: "",
            PrivateKeyFromStorage: [],
            addPrivateKey: "",
            addPrivateKeyNick: "",
            addPrivateKeyResult: "",
            addPrivateKeyButtonState: false,
            ModalPrivateKey: "",
            ModalCopyPrivateKeyState: false,
            isShowModal: false,
        };
    }

    componentWillMount() {
        this.getPrivateKeyFromStorage();
    };

    createPrivateKey = () => {
        const data = {
            method: "createPrivateKey",
        };
        this.refs.Ecc.refs.WebView.postMessage(JSON.stringify(data));
    };

    createPrivateKeyResponse = (data) => {
        this.setState({
            createPublicKey: data.PublicKey,
            createPrivateKey: data.PrivateKey,
        });
    };

    checkPrivateKey = () => {
        const data = {
            method: "checkPrivateKey",
            data: {
                privateKey: this.state.checkPrivateKey,
            },
        };
        this.refs.Ecc.refs.WebView.postMessage(JSON.stringify(data));
    };

    checkPrivateKeyResponse = (data) => {
        this.setState({
            checkPublicKey: data.PublicKey,
        });
    };

    checkPrivateKeyForAdd = () => {
        const data = {
            method: "checkPrivateKeyForAdd",
            data: {
                privateKey: this.state.addPrivateKey,
            },
        };
        this.refs.Ecc.refs.WebView.postMessage(JSON.stringify(data));
    };

    checkPrivateKeyForAddResponse = (data) => {
        if (data.IsPrivateKeyValid) {
            this.addPrivateKey();
        } else {
            this.setState({
                addPrivateKeyResult: I18n.t("PrivatePage AddPrivateKey addPrivateKeyResult CheckFail"),
            });
        }
    };

    onMessage = (e) => {
        console.log(e.nativeEvent.data);
        const response = JSON.parse(e.nativeEvent.data);
        switch (response.method) {
        case "createPrivateKey" :
            this.createPrivateKeyResponse(response.data);
            break;
        case "checkPrivateKey" :
            this.checkPrivateKeyResponse(response.data);
            break;
        case "checkPrivateKeyForAdd" :
            this.checkPrivateKeyForAddResponse(response.data);
            break;
        case "responseTestMsg" :
            console.log(response.data.msg);
            break;
        default:
            return;
        }
    };

    getPrivateKeyFromStorage = () => {
        storage.load({key: "PrivateKeyArr"}).then((ret) => {
            if (ret) {
                const PrivateKeyFromStorage = CryptoJS.AES.decrypt(ret, global.OpenPassword).toString(CryptoJS.enc.Utf8).split("&&");
                this.setState({
                    PrivateKeyFromStorage: PrivateKeyFromStorage || [],
                });
            }
        }).catch(err => {
            console.log("err === ", err);
        });
    };

    isHadAddPrivateKey = (PrivateKey, Nick) => {
        if (!PrivateKey || !Nick) {
            return true;
        }
        for (var i = 0; i < this.state.PrivateKeyFromStorage.length; i++) {
            if (this.state.PrivateKeyFromStorage[i].PrivateKey == PrivateKey) {
                return true;
            }
        }
    };


    addPrivateKey = () => {
        // 已存在/未输入
        if (this.isHadAddPrivateKey(this.state.addPrivateKey, this.state.addPrivateKeyNick)) {
            this.setState({
                addPrivateKeyResult: I18n.t("PrivatePage AddPrivateKey addPrivateKeyResult Fail"),
            });
            return;
        }
        // 加密存储
        const PrivateKeyData = {
            PrivateKey: this.state.addPrivateKey,
            Nick: this.state.addPrivateKeyNick,
        };
        this.state.PrivateKeyFromStorage.push(JSON.stringify(PrivateKeyData));
        const PrivateKeyArr = CryptoJS.AES.encrypt(this.state.PrivateKeyFromStorage.join("&&"), global.OpenPassword).toString();
        localSave.setPrivateKeyArr(PrivateKeyArr);
        this.setState({
            addPrivateKeyResult: I18n.t("PrivatePage AddPrivateKey addPrivateKeyResult Success"),
            addPrivateKey: "",
            addPrivateKeyNick: "",
        });
    };

    deletePrivateKey = (item) => {
        const PrivateKeyFromStorage = this.state.PrivateKeyFromStorage.filter(i => i != item);
        const PrivateKeyArr = PrivateKeyFromStorage.length === 0 ? "" : CryptoJS.AES.encrypt(PrivateKeyFromStorage.join("&&"), global.OpenPassword).toString();
        localSave.setPrivateKeyArr(PrivateKeyArr);
        this.setState({PrivateKeyFromStorage});
    };

    SeePrivateKey = (itemObj) => {
        this.setState({
            isShowModal: true,
            ModalPrivateKey: itemObj.PrivateKey,
        });
    };

    CopyPrivateKey = () => {
        Clipboard.setString(this.state.ModalPrivateKey);
        this.setState({
            ModalCopyPrivateKeyState: true,
        });
    };

    onChangeAddPrivateKeyButtonState = () => {
        this.setState({
            addPrivateKeyButtonState: !!this.state.addPrivateKey && !!this.state.addPrivateKeyNick,
        });
    };

    render() {
        return (
            <KeyboardAwareScrollView style={mainStyles.BodyBox}>
                <EccWebView ref="Ecc" onMessage={this.onMessage}/>
                <Modal
                    transparent={true}
                    visible={this.state.isShowModal}
                    onRequestClose={() => {}}
                >
                    <View style={PrivatePageStyles.ModalBox}>
                        <View style={PrivatePageStyles.ModalBodyBox}>
                            <Icon onPress={() => this.setState({isShowModal: false})} style={PrivatePageStyles.CloseIcon} name="ios-close-circle-outline" color="#222" size={24}/>
                            <Text style={PrivatePageStyles.ModalBodyText} selectable={true}>{this.state.ModalPrivateKey}</Text>
                            <Button name={I18n.t("PrivatePage AddPrivateKey CopyPrivateKey ButtonName")} onPress={this.CopyPrivateKey} Disable={true}/>
                            <Text style={PrivatePageStyles.ModalBodyCopyText}>{this.state.ModalCopyPrivateKeyState ? "已复制" : ""}</Text>
                        </View>
                    </View>
                </Modal>
                <Card title={I18n.t("PrivatePage AddPrivateKey CardTitle And ButtonName")} >
                    {this.state.addPrivateKeyResult ? (
                        <View style={PrivatePageStyles.TextBox}>
                            <View style={PrivatePageStyles.TextItemBox}><Text style={PrivatePageStyles.TextItemText}>{this.state.addPrivateKeyResult}</Text></View>
                        </View>
                    ) : null}
                    <View style={PrivatePageStyles.FromItem}>
                        <TextInput required={true} label={I18n.t("PrivatePage AddPrivateKey TextInput PrivateKey")} icon="lock" placeholder={I18n.t("PrivatePage AddPrivateKey TextInput PrivateKey")} value={this.state.addPrivateKey} onChange={addPrivateKey => this.setState({addPrivateKey}, this.onChangeAddPrivateKeyButtonState)} onBlur={() => {}}/>
                    </View>
                    <View style={PrivatePageStyles.FromItem}>
                        <TextInput required={true} label={I18n.t("PrivatePage AddPrivateKey TextInput PrivateKey Nick")} icon="user" placeholder={I18n.t("PrivatePage AddPrivateKey TextInput PrivateKey Nick")} value={this.state.addPrivateKeyNick} onChange={addPrivateKeyNick => this.setState({addPrivateKeyNick}, this.onChangeAddPrivateKeyButtonState)} onBlur={() => {}}/>
                    </View>
                    <View style={PrivatePageStyles.FromItem}>
                        <Button name={I18n.t("PrivatePage AddPrivateKey CardTitle And ButtonName")} onPress={this.checkPrivateKeyForAdd} Disable={this.state.addPrivateKeyButtonState}/>
                    </View>
                    {this.state.PrivateKeyFromStorage.length > 0 ? (
                        <View style={PrivatePageStyles.PrivateKeyList}>
                            <Text style={PrivatePageStyles.listTitle}>{I18n.t("PrivatePage AddPrivateKey HadAddPrivateKey Title")}</Text>
                            <View style={PrivatePageStyles.listItemBox}>
                                {this.state.PrivateKeyFromStorage.map(item => {
                                    const itemObj = JSON.parse(item);
                                    return (
                                        <View style={PrivatePageStyles.listItem} key={itemObj.PrivateKey}>
                                            <Text style={PrivatePageStyles.listItemCon}>{itemObj.Nick} : {PrivateKeyFormat(itemObj.PrivateKey)}</Text>
                                            <View style={PrivatePageStyles.listItemActions}>
                                                <Text style={PrivatePageStyles.listItemDelete} onPress={() => this.deletePrivateKey(item)}>{I18n.t("PrivatePage AddPrivateKey HadAddPrivateKey Delete")}</Text>
                                                <Text style={PrivatePageStyles.listItemDelete} onPress={() => this.SeePrivateKey(itemObj)}>{I18n.t("PrivatePage AddPrivateKey HadAddPrivateKey Details")}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    ) : null}
                </Card>
                <Card title={I18n.t("PrivatePage CreatePrivateKey CardTitle And ButtonName")}>
                    <View style={PrivatePageStyles.FromItem}>
                        <Button name={I18n.t("PrivatePage CreatePrivateKey CardTitle And ButtonName")} onPress={this.createPrivateKey} Disable={true}/>
                    </View>
                    {this.state.createPrivateKey ? (
                        <View style={PrivatePageStyles.TextBox}>
                            <View style={PrivatePageStyles.TextItemBox}>
                                <Text style={PrivatePageStyles.TextItemText}>PrivateKey(私钥)：{this.state.createPrivateKey}</Text>
                                <TouchableOpacity onPress={() => Clipboard.setString(this.state.createPrivateKey)} style={{position: "absolute", top: 0, right: 6}}>
                                    <Icon name="md-copy" color="#222" size={22}/>
                                </TouchableOpacity>
                            </View>
                            <View style={PrivatePageStyles.TextItemBox}>
                                <Text style={PrivatePageStyles.TextItemText}>PublicKey(公钥，扫描二维码即可获得）：{this.state.createPublicKey}</Text>
                                <TouchableOpacity onPress={() => Clipboard.setString(this.state.createPublicKey)} style={{position: "absolute", top: 0, right: 6}}>
                                    <Icon name="md-copy" color="#222" size={22}/>
                                </TouchableOpacity>
                            </View>
                            <View style={PrivatePageStyles.FromItem}>
                                <QrCode value={this.state.createPublicKey}/>
                            </View>
                        </View>
                    ) : null}
                </Card>
                <Card title={I18n.t("PrivatePage CheckPrivateKey CardTitle And ButtonName")} >
                    <View style={PrivatePageStyles.FromItem}>
                        <TextInput required={true} label={I18n.t("PrivatePage CheckPrivateKey TextInput PrivateKey")} icon="lock" placeholder={I18n.t("PrivatePage CheckPrivateKey TextInput PrivateKey")} value={this.state.checkPrivateKey} onChange={checkPrivateKey => this.setState({checkPrivateKey})} onBlur={() => {}}/>
                        <TouchableOpacity onPress={() => Clipboard.getString().then(checkPrivateKey => {this.setState({checkPrivateKey});})} style={{position: "absolute", top: 2, right: 6, padding: 5}}>
                            <Icon name="md-copy" color="#222" size={22}/>
                        </TouchableOpacity>
                    </View>
                    <View style={PrivatePageStyles.FromItem}>
                        <Button name={I18n.t("PrivatePage CheckPrivateKey CardTitle And ButtonName")} onPress={this.checkPrivateKey} Disable={true}/>
                    </View>
                    {this.state.checkPublicKey ? (
                        <View style={PrivatePageStyles.TextBox}>
                            <View style={PrivatePageStyles.TextItemBox}><Text style={PrivatePageStyles.TextItemText}>{I18n.t("PrivatePage CheckPrivateKey CheckResultLabel")}{this.state.checkPublicKey}</Text></View>
                            <View style={PrivatePageStyles.FromItem}>
                                <QrCode value={this.state.checkPublicKey}/>
                            </View>
                        </View>
                    ) : null}
                </Card>
                <View style={{height: 100}}/>
            </KeyboardAwareScrollView>
        );
    }
}
