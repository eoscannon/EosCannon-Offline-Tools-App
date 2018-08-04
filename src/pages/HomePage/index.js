// 引入公共组件
import React, { Component } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import SplashScreen from "rn-splash-screen";

// 自定义组件
import { mainStyles } from "./style";
import I18n from "../../utils/I18n";

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
                    actionName: "Homepage ButtonName UpdateAuthPage",
                    disabled: false,
                    url: "UpdateAuthPage",
                },
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
        const HeaderWelcomeImgSource = this.state.isZh ? require("./images/welcomeTextCh.png") : require("./images/welcomeTextEn.png");
        const HeaderCannonImggSource = this.state.isZh ? require("./images/toolsTextCh.png") : require("./images/toolsTextEn.png");
        const HeaderLanguageImgSource = this.state.isZh ? require("./images/enBtn.png") : require("./images/chBtn.png");
        return (
            <ScrollView style={mainStyles.BodyBox}>
                <View style={mainStyles.HeaderBox}>
                    <View style={mainStyles.HeaderConBox}>
                        <Image style={mainStyles.HeaderWelcomeImg} source={HeaderWelcomeImgSource} />
                        <Image style={mainStyles.HeaderCannonImg} source={HeaderCannonImggSource} />
                        <TouchableOpacity onPress={this.onChangeLanguage} style={{width: 140}}>
                            <Image style={mainStyles.HeaderLanguageImg} source={HeaderLanguageImgSource} />
                        </TouchableOpacity>
                    </View>
                    <Image style={mainStyles.HeaderBgImg} source={require("./images/bgBlue.png")} />
                </View>
                <View style={mainStyles.ListBox}>
                    {this.state.ActionsArray.map((item, index) => {
                        return item.disabled ? (
                            <View key={index} style={mainStyles.ListItemBox}>
                                <Text style={mainStyles.ListItemButton}>{I18n.t(item.actionName)}</Text>
                            </View>
                        ) : (
                            <TouchableOpacity key={index} style={mainStyles.ListItemBox} onPress={() => {this.props.navigation.navigate(item.url);}}>
                                <Text style={mainStyles.ListItemButton}>{I18n.t(item.actionName)}</Text>
                                <Image style={mainStyles.ListItemMoreIcon} source={require("./images/arrow.png")} />
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={mainStyles.FooterBox}>
                    <Image style={mainStyles.FooterIcon} source={require("./images/eosLogo.png")} />
                </View>
                <View style={{height: 50}}/>
            </ScrollView>
        );
    }
}
