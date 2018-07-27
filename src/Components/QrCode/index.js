// 引入公共组件
import React, { Component } from "react";
import QRCode from "react-native-qrcode";
import I18n from "../../utils/I18n";

export default class QrCode extends Component {
    constructor (props) {
        super(props);
        this.state = {
            QRCodeSize: 256,
        };
    }

    render() {
        return (
            <QRCode
                value={this.props.value || I18n.t("Homepage title")}
                size={this.state.QRCodeSize}
                bgColor='#000'
                fgColor='#fff'/>
        );
    }
}
