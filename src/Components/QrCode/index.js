// 引入公共组件
import React, { Component } from "react";
import { Dimensions } from "react-native";
import QRCode from "react-native-qrcode";
import I18n from "../../utils/I18n";

export default class QrCode extends Component {
    constructor (props) {
        super(props);
        this.state = {
            QRCodeSize: Dimensions.get("window").width - 50,
        };
    }

    render() {
        return (
            <QRCode
                value={this.props.value}
                size={this.state.QRCodeSize}
                bgColor='#000'
                fgColor='#fff'/>
        );
    }
}
