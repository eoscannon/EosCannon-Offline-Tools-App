// 引入公共组件
import React, { Component } from "react";
import {View, WebView, StyleSheet, Platform} from "react-native";

export default class WebViewComp extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        const WebViewSource = Platform.OS === "ios" ? require("./EOSJS.html") : {uri: "file:///android_asset/eos/EOSJS.html", baseUrl:"file:///android_asset/eos/"};
        return (
            <View style={styles.mainBox}>
                <WebView
                    ref="WebView"
                    style={styles.WebViewStyle}
                    source={WebViewSource}
                    onMessage={(e)=>{this.props.onMessage(e);}}
                    javaScriptEnabled={true}
                    mixedContentMode="always"
                    originWhitelist={["*"]}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainBox: {
        flex:1,
        height:0,
        zIndex:-999999,
        position:"absolute",
    },
    WebViewStyle: {
        height:0,
        width:0,
        backgroundColor:"transparent",
    },
});
