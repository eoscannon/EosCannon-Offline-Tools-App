// 引入公共组件
import React, { Component } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import SplashScreen from "rn-splash-screen";

// 自定义组件
import { mainStyles } from "./style";
import I18n from "../../utils/I18n";

console.log("I18n.locale == ", I18n.locale);

export default class HomePage extends Component {
    static navigationOptions = ( props ) => {
        return {
            header: null,
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            isZh: I18n.locale == "zh",
            ActionsArray: [
                {
                    actionName: "Homepage ButtonName TransferPage",
                    disabled: false,
                    url: "TransferPage",
                },
                {
                    actionName: "Homepage ButtonName CreateAccountPage",
                    disabled: false,
                    url: "CreateAccountPage",
                },
                {
                    actionName: "Homepage ButtonName StakePage",
                    disabled: false,
                    url: "StakePage",
                },
                {
                    actionName: "Homepage ButtonName BuyRamBytesPage",
                    disabled: false,
                    url: "BuyRamBytesPage",
                },
                {
                    actionName: "Homepage ButtonName VotePage",
                    disabled: false,
                    url: "VotePage",
                },
                {
                    actionName: "Homepage ButtonName ProxyPage",
                    disabled: false,
                    url: "ProxyPage",
                },
                {
                    actionName: "Homepage ButtonName UpdateAuthPage",
                    disabled: false,
                    url: "UpdateAuthPage",
                },
                {
                    actionName: "Homepage ButtonName RefundPage",
                    disabled: false,
                    url: "RefundPage",
                },
            ],
        };
    }

    componentDidMount() {
        setTimeout(() => {
            SplashScreen.hide();
        }, 1000);
    }

    onChangeLanguage = () => {
        const isZh = !this.state.isZh;
        I18n.locale = isZh ? "zh" : "en";
        this.setState({
            isZh,
        });
    };

    render() {
        return (
            <ScrollView style={mainStyles.BodyBox}>
                <Text style={mainStyles.LanguageBox} onPress={this.onChangeLanguage}>{this.state.isZh ? "English" : "中文"}</Text>
                <Text style={mainStyles.BodyTitle}>{I18n.t("Homepage title")}</Text>
                <View style={mainStyles.ContentBox}>
                    {this.state.ActionsArray.map((item, index) => (
                        <View style={mainStyles.ItemBox} key={index}>
                            {item.disabled ? (
                                <View style={mainStyles.ButtonDisableBox}>
                                    <Text style={mainStyles.ButtonDisableText}>{item.actionName}</Text>
                                </View>
                            ) : (
                                <TouchableOpacity style={mainStyles.ButtonBox} onPress={() => {this.props.navigation.navigate(item.url);}}>
                                    <Text style={mainStyles.ButtonText}>{I18n.t(item.actionName)}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        );
    }
}
