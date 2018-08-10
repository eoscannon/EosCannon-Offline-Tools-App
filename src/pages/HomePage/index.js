// 引入公共组件
import React, { Component } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";

// 自定义组件
import { mainStyles } from "./style";
import I18n from "../../utils/I18n";
import PrivatePage from "../PrivatePage";
import SignPage from "../SignPage";

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
                    actionName: "Homepage ButtonName PrivatePage",
                    disabled: false,
                    url: "PrivatePage",
                },
                {
                    actionName: "Homepage ButtonName SignPage",
                    disabled: false,
                    url: "SignPage",
                },
            ],
        };
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
