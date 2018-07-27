// 引入公共组件
import React, { Component } from "react";
import {View, Text, StyleSheet} from "react-native";

// 引入自定义组件
import Card from "../Card";
import Button from "../Button";
import TextInput from "../TextInput";
import EccWebView from "../EccWebView";
import I18n from "../../utils/I18n";

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
        };
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
        console.log(data);
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

    render() {
        return (
            <View>
                <EccWebView ref="Ecc" onMessage={this.onMessage}/>
                <Card title={I18n.t("UpdateAuthPage CreatePrivateKey CardTitle And ButtonName")}>
                    {this.state.isCreateResultShow ? (
                        <View style={styles.TextBox}>
                            <View style={styles.TextItemBox}><Text style={styles.TextItemText}>PublicKey(公钥)：{this.state.createPublicKey}</Text></View>
                            <View style={styles.TextItemBox}><Text style={styles.TextItemText}>PrivateKey(私钥)：{this.state.createPrivateKey}</Text></View>
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
});

