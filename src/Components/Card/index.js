// 引入公共组件
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Card extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.BodyBox}>
                <View style={styles.TitleBox}><Text style={styles.Title}>{this.props.title}</Text></View>
                <View style={styles.ContentBox}>{this.props.children}</View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    BodyBox: {
        position: "relative",
        width: "96%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 4,
    },
    TitleBox: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    Title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
        lineHeight: 26,
    },
    ContentBox: {
        paddingTop: 20,
        paddingLeft: 5,
        paddingBottom: 0,
        paddingRight: 5,
    },
});
