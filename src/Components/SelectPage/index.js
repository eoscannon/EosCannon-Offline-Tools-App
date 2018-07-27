// 引入公共组件
import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import CustomMultiPicker from "./multipleSelect";
import I18n from "../../utils/I18n";

export default class SelectPage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: props.navigation.state.params.title,
            headerRight: (
                <Text style={{paddingRight: 15}} onPress={() => {props.navigation.state.params.onConfirm();}}>{I18n.t("Public SelectPage ConfirmButtonName")}</Text>
            )
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            selected: [],
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({onConfirm: this.onConfirm});
    }

    onCallback = (res) => {
        const selected = res[0] ? res : res.slice(1);
        this.setState({
            selected,
        });
    };

    onConfirm = () => {
        const { backUrl } = this.props.navigation.state.params;
        this.props.navigation.navigate(backUrl, {responseSelected: this.state.selected});
    };

    render() {
        const height = Dimensions.get("window").height - 120;
        const { options, isMultiSelect, selected } = this.props.navigation.state.params;
        return (
            <View>
                <CustomMultiPicker
                    options={options}
                    search={true} // should show search bar?
                    multiple={isMultiSelect} //
                    placeholder={"Search"}
                    placeholderTextColor={"#757575"}
                    returnValue={"label"} // label or value
                    callback={this.onCallback} // callback, array of selected items
                    rowBackgroundColor={"#eee"}
                    rowHeight={40}
                    rowRadius={5}
                    iconColor={"#00a2dd"}
                    iconSize={30}
                    selectedIconName={"ios-checkmark-circle-outline"}
                    unselectedIconName={"ios-radio-button-off-outline"}
                    scrollViewHeight={height}
                    selected={selected} // list of options which are selected by default
                />
            </View>
        );
    }
}
