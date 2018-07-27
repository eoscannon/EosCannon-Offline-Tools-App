// 引入公共组件
import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={menuStyles.menuBox}>
                <TouchableOpacity onPress={() => {this.props.goBack();}}>
                    <Image style={menuStyles.CloseIcon} source={require("./close.png")}/>
                </TouchableOpacity>
                <Text style={menuStyles.Title}>{this.props.title}</Text>
                <Text/>
            </View>
        );
    }
}

const menuStyles = StyleSheet.create({
    menuBox: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
        paddingTop: 30,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    CloseIcon: {
        width: 14,
        height: 14,
    },
    Title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#222",
    },
});
