// 引入公共组件
import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default class TextArea extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.BodyBox}>
                <View style={styles.TextInput}>
                    {this.props.text ? (
                        <Text style={styles.text}>{this.props.text}</Text>
                    ) : (
                        <Text style={styles.placeholder}>{this.props.placeholder}</Text>
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    BodyBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    TextInput: {
        width: "100%",
        height: 104,
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#eee",
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 4,
    },
    text: {
        textAlign: "left",
        lineHeight: 28,
        fontSize: 14,
        color: "#222",
    },
    placeholder: {
        textAlign: "left",
        lineHeight: 28,
        fontSize: 14,
        color: "#aaa",
    },
});
