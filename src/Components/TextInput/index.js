// 引入公共组件
import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default class Input extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        let IconName = null;
        switch(this.props.icon) {
        case "user":
            IconName = "ios-contact-outline";
            break;
        case "contract":
            IconName = "ios-globe-outline";
            break;
        case "lock":
            IconName = "ios-key-outline";
            break;
        case "quantity":
            IconName = "ios-cart-outline";
            break;
        case "digit":
            IconName = "ios-locate-outline";
            break;
        case "unit":
            IconName = "ios-at-outline";
            break;
        default:
            IconName = "ios-help-circle-outline";
        }
        return (
            <View style={styles.BodyBox}>
                <Text style={styles.TextLabel}>{this.props.required ? (<Text style={styles.TextRequired}>*</Text>) : ""}{this.props.label}：</Text>
                <TextInput
                    style={styles.Input}
                    placeholder={this.props.placeholder}
                    placeholderTextColor="#aaa"
                    selectionColor="#111"
                    value={this.props.value}
                    onBlur={this.props.onBlur}
                    onChangeText={this.props.onChange}
                    underlineColorAndroid="transparent"
                />
                <Icon style={styles.TextIcon} name={IconName} color="#999" size={20}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    BodyBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    TextLabel: {
        flexBasis: "27%",
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
    Input: {
        width: "73%",
        height: 40,
        paddingRight: 10,
        paddingLeft: 26,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#fff",
        borderColor: "#eee",
        borderWidth: 1,
        borderRadius: 4,
        textAlign: "left",
        lineHeight: 20,
        fontSize: 14,
        color: "#222",
    },
    TextIcon: {
        position: "absolute",
        left: "27.5%",
    },
});
