// 引入公共组件
import React, { Component } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default class SwitchComp extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.BodyBox}>
                <Text style={styles.TextLabel}><Text style={styles.TextRequired}>*</Text>{this.props.value ? this.props.options.open : this.props.options.close}</Text>
                <View>
                    <Switch style={styles.SwitchStyle} value={this.props.value} onValueChange={this.props.onChange} onTintColor='#1890ff' tintColor='#eee' thumbTintColor='#efefef'/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    BodyBox: {
        position: "relative",
        flexBasis: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    SwitchStyle: {
        width: 80,
        height: 40,
    },
    TextLabel: {
        flexBasis: "25%",
        textAlign: "left",
        lineHeight: 40,
        fontSize: 14,
        color: "#222",
    },
    TextRequired: {
        paddingRight: 6,
        fontSize: 14,
        color: "#f5222d"
    },
});
