// 引入公共组件
import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default class Alert extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isShow: true,
        };
    }

    render() {
        return (
            <View style={this.state.isShow ? (this.props.type == "error" ? styles.ErrorBodyBox : styles.BodyBox) : {display: "none"}}>
                <Text style={styles.Title}>{this.props.title}</Text>
                <Text style={styles.Description}>{this.props.Description}</Text>
                <TouchableOpacity style={styles.CloseBox} onPress={() => {this.setState({isShow: false});}}>
                    <Image style={styles.CloseIcon} source={require("./close.png")}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    BodyBox: {
        position: "relative",
        width: "100%",
        height: "auto",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#e6f7ff",
        borderColor: "#91d5ff",
        borderWidth: 1,
        borderRadius: 4,
    },
    ErrorBodyBox: {
        position: "relative",
        width: "100%",
        height: "auto",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#fff1f0",
        borderColor: "#ffa39e",
        borderWidth: 1,
        borderRadius: 4,
    },
    Title: {
        fontSize: 16,
        color: "rgba(0,0,0,.85)",
        marginBottom: 4,
    },
    Description: {
        fontSize: 14,
        color: "rgba(0,0,0,.65)",
        lineHeight: 22,
    },
    CloseBox: {
        position: "absolute",
        top: 16,
        right: 16,
    },
    CloseIcon: {
        width: 12,
        height: 12,
    },
});
