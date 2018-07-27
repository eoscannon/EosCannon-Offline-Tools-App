// 引入公共组件
import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default class Button extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.BodyBox}>
                {this.props.Disable ? (
                    <TouchableOpacity style={styles.ButtonBox} onPress={() => {this.props.onPress();}}>
                        <Text style={styles.ButtonName}>{this.props.name}</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.ButtonDisableBox}>
                        <Text style={styles.ButtonDisableName}>{this.props.name}</Text>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    BodyBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    ButtonBox: {
        height: 40,
        paddingRight: 55,
        paddingLeft: 55,
        backgroundColor: "#1890ff",
        borderColor: "#1890ff",
        borderWidth: 1,
        borderRadius: 4,
    },
    ButtonName: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        lineHeight: 35,
        textAlign: "center",
    },
    ButtonDisableBox: {
        height: 40,
        paddingRight: 55,
        paddingLeft: 55,
        backgroundColor: "#f5f5f5",
        borderColor: "#d9d9d9",
        borderWidth: 1,
        borderRadius: 4,
    },
    ButtonDisableName: {
        color: "rgba(0,0,0,.25)",
        fontSize: 14,
        fontWeight: "bold",
        lineHeight: 35,
        textAlign: "center",
    },
});
