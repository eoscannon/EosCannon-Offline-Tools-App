// 引入公共组件
import React, { Component } from "react";
import {View, Text, StyleSheet} from "react-native";
import CryptoJS from "crypto-js";

// 引入自定义组件
import Card from "../Card";
import Button from "../Button";
import TextInput from "../TextInput";
import EccWebView from "../EccWebView";
import I18n from "../../utils/I18n";
import {localSave, storage} from "../../utils/storage";
import { PrivateKeyFormat } from "../../utils/utils";

export default class PrivateKey extends Component {
    static navigationOptions = ( props ) => {
        return {
            header: null,
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            isCreateResultShow: false,
            createPublicKey: "",
            createPrivateKey: "",
            isCheckResultShow: false,
            checkPrivateKey: "",
            checkPublicKey: "",
            PrivateKeyFromStorage: [],
            addPrivateKey: "",
            addPrivateKeyNick: "",
            addPrivateKeyResult: "",
        };
    }

    componentWillMount() {
        this.getPrivateKeyFromStorage();
    }

    componentDidMount() {}

    createPrivateKey = () => {
        const data = {
            method: "createPrivateKey",
        };
        this.refs.Ecc.refs.WebView.postMessage(JSON.stringify(data));
    };

    createPrivateKeyResponse = (data) => {
        this.setState({
            isCreateResultShow: true,
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
            isCheckResultShow: true,
            checkPublicKey: data.PublicKey,
        });
    };

    onMessage = (e) => {
        const response = JSON.parse(e.nativeEvent.data);
        switch (response.method) {
        case "createPrivateKey" :
            this.createPrivateKeyResponse(response.data);
            break;
        case "checkPrivateKey" :
            this.checkPrivateKeyResponse(response.data);
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
                const PrivateKeyFromStorage = CryptoJS.AES.decrypt(ret, "'secret key 123'").toString(CryptoJS.enc.Utf8).split("&&");
                this.setState({
                    PrivateKeyFromStorage: PrivateKeyFromStorage || [],
                });
            }
        }).catch(err => {
            console.log(err);
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
                addPrivateKeyResult: I18n.t("UpdateAuthPage AddPrivateKey addPrivateKeyResult Fail"),
            });
            return;
        }
        // 加密存储
        const PrivateKeyData = {
            PrivateKey: this.state.addPrivateKey,
            Nick: this.state.addPrivateKeyNick,
        };
        this.state.PrivateKeyFromStorage.push(JSON.stringify(PrivateKeyData));
        const PrivateKeyArr = CryptoJS.AES.encrypt(this.state.PrivateKeyFromStorage.join("&&"), "'secret key 123'").toString();
        localSave.setPrivateKeyArr(PrivateKeyArr);
        this.setState({
            addPrivateKeyResult: I18n.t("UpdateAuthPage AddPrivateKey addPrivateKeyResult Success"),
            addPrivateKey: "",
            addPrivateKeyNick: "",
        });
    };

    deletePrivateKey = (item) => {
        const PrivateKeyFromStorage = this.state.PrivateKeyFromStorage.filter(i => i != item);
        this.setState({
            PrivateKeyFromStorage,
        }, () => {
            const PrivateKeyArr = CryptoJS.AES.encrypt(this.state.PrivateKeyFromStorage.join("&&"), "'secret key 123'").toString();
            localSave.setPrivateKeyArr(PrivateKeyArr);
        });
    };

    render() {
        return (
            <View>
                <EccWebView ref="Ecc" onMessage={this.onMessage}/>
                <Card title={I18n.t("UpdateAuthPage AddPrivateKey CardTitle And ButtonName")} >
                    {this.state.addPrivateKeyResult ? (
                        <View style={styles.TextBox}>
                            <View style={styles.TextItemBox}><Text style={styles.TextItemText}>{this.state.addPrivateKeyResult}</Text></View>
                        </View>
                    ) : null}
                    <View style={styles.FromItem}>
                        <TextInput required={true} label={I18n.t("Public TextInput PrivateKey")} icon="lock" placeholder={I18n.t("Public TextInput PrivateKey")} value={this.state.addPrivateKey} onChange={addPrivateKey => this.setState({addPrivateKey})} onBlur={() => {}}/>
                    </View>
                    <View style={styles.FromItem}>
                        <TextInput required={true} label={I18n.t("UpdateAuthPage AddPrivateKey TextInput PrivateKey Nick")} icon="user" placeholder={I18n.t("UpdateAuthPage AddPrivateKey TextInput PrivateKey Nick")} value={this.state.addPrivateKeyNick} onChange={addPrivateKeyNick => this.setState({addPrivateKeyNick})} onBlur={() => {}}/>
                    </View>
                    <View style={styles.FromItem}>
                        <Button name={I18n.t("UpdateAuthPage AddPrivateKey CardTitle And ButtonName")} onPress={this.addPrivateKey} Disable={true}/>
                    </View>
                    {this.state.PrivateKeyFromStorage.length > 0 ? (
                        <View style={styles.PrivateKeyList}>
                            <Text style={styles.listTitle}>已添加私钥：</Text>
                            <View style={styles.listItemBox}>
                                {this.state.PrivateKeyFromStorage.map(item => {
                                    const itemObj = JSON.parse(item);
                                    return (
                                        <View style={styles.listItem} key={itemObj.PrivateKey}>
                                            <Text style={styles.listItemCon}>{itemObj.Nick} : {PrivateKeyFormat(itemObj.PrivateKey)}</Text>
                                            <Text style={styles.listItemDelete} onPress={() => this.deletePrivateKey(item)}>删除</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    ) : null}
                </Card>
                <Card title={I18n.t("UpdateAuthPage CreatePrivateKey CardTitle And ButtonName")}>
                    {this.state.isCreateResultShow ? (
                        <View style={styles.TextBox}>
                            <View style={styles.TextItemBox}><Text style={styles.TextItemText}>PublicKey(公钥)：{this.state.createPublicKey}</Text></View>
                            <View style={styles.TextItemBox}><Text style={styles.TextItemText} selectable={true}>PrivateKey(私钥)：{this.state.createPrivateKey}</Text></View>
                        </View>
                    ) : null}
                    <View style={styles.FromItem}>
                        <Button name={I18n.t("UpdateAuthPage CreatePrivateKey CardTitle And ButtonName")} onPress={this.createPrivateKey} Disable={true}/>
                    </View>
                </Card>
                <Card title={I18n.t("UpdateAuthPage CheckPrivateKey CardTitle And ButtonName")} >
                    {this.state.isCheckResultShow ? (
                        <View style={styles.TextBox}>
                            <View style={styles.TextItemBox}><Text style={styles.TextItemText}>{I18n.t("UpdateAuthPage CheckPrivateKey CheckResultLabel")}{this.state.checkPublicKey}</Text></View>
                        </View>
                    ) : null}
                    <View style={styles.FromItem}>
                        <TextInput required={true} label={I18n.t("Public TextInput PrivateKey")} icon="lock" placeholder={I18n.t("Public TextInput PrivateKey")} value={this.state.checkPrivateKey} onChange={checkPrivateKey => this.setState({checkPrivateKey})} onBlur={() => {}}/>
                    </View>
                    <View style={styles.FromItem}>
                        <Button name={I18n.t("UpdateAuthPage CheckPrivateKey CardTitle And ButtonName")} onPress={this.checkPrivateKey} Disable={true}/>
                    </View>
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    TextBox: {
        position: "relative",
        width: "94%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
    },
    TextItemBox: {
        marginBottom: 10,
    },
    TextItemText: {
        fontSize: 14,
        color: "#222",
        lineHeight: 28,
    },
    FromItem: {
        position: "relative",
        width: "94%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    PrivateKeyList: {
        position: "relative",
        width: "94%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
        lineHeight: 28,
    },
    listItemBox: {},
    listItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#efefef"
    },
    listItemCon: {
        fontSize: 14,
        color: "#555",
        lineHeight: 60,
    },
    listItemDelete: {
        fontSize: 14,
        color: "#CC0066",
    },
});

