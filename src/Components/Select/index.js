// 引入公共组件
import React, { Component } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default class Select extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    onPress = () => {
        this.props.navigation.navigate("SelectPage", {
            title: this.props.title,
            backUrl: this.props.backUrl,
            options: this.props.options,
            isMultiSelect: this.props.isMultiSelect,
            selected: this.props.selected,
        });
    };

    getIconSource = () => {
        switch(this.props.icon) {
        case "user":
            return "ios-contact-outline";
        case "digit":
            return "ios-locate-outline";
        default:
            return "ios-pricetag-outline";
        }
    };

    render() {
        return (
            <View style={styles.BodyBox}>
                <Text style={styles.TextLabel}>{this.props.required ? (<Text style={styles.TextRequired}>*</Text>) : null}{this.props.label}：</Text>
                <View style={styles.TextInput}>
                    <TouchableOpacity style={styles.TextTextBox} onPress={this.onPress}>
                        {this.props.selected ? (
                            <Text style={styles.TextInputValue}>{this.props.isMultiSelect ? this.props.selected.join(", ") : this.props.selected }</Text>
                        ) : (
                            <Text style={styles.TextInputPlaceholder}>{this.props.placeholder}</Text>
                        )}
                    </TouchableOpacity>
                    <Icon style={styles.TextIcon} name={this.getIconSource()} color="#999" size={20}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    BodyBox: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
    TextInput: {
        position: "relative",
        width: "75%",
        height: 40,
        paddingRight: 10,
        paddingLeft: 26,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#fff",
        borderColor: "#eee",
        borderWidth: 1,
        borderRadius: 4,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    TextIcon: {
        position: "absolute",
        left: 5,
    },
    TextTextBox: {
        flexBasis: "100%",
    },
    TextInputValue: {
        fontSize: 14,
        color: "#222",
    },
    TextInputPlaceholder: {
        fontSize: 14,
        color: "#aaa",
    },
    ModalBox: {
        position: "absolute",
        top: 40,
        right: 0,
        width: "75%",
        height: "auto",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#efefef",
        zIndex: 1001,
        backgroundColor: "#fefefe",
    },
    ModalConBox: {
        flexBasis: "100%",
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: -1,
        backgroundColor: "#fff",
    },
    ItemBox: {
        flexBasis: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    ItemCon: {
        flexBasis: "100%",
        fontSize: 14,
        color: "#222",
        lineHeight: 40,
    },
});
