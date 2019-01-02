// 引入公共组件
import React, { Component } from "react";
import {createStore } from "redux";
import {Provider} from "react-redux";
import { StackNavigator } from "react-navigation";
import { View, Modal, Text, AppState, TextInput, StyleSheet, Clipboard } from "react-native";
import CryptoJS from "crypto-js";
import SplashScreen from "rn-splash-screen";
import Icon from "react-native-vector-icons/Ionicons";

// 引入自定义组件
import reducers from "./src/utils/reducers";
import I18n from "./src/utils/I18n";

// 引入自定义组件
import HomePage from "./src/pages/HomePage";
import PrivatePage from "./src/pages/PrivatePage";
import SignPage from "./src/pages/SignPage";
import LoginPage from "./src/pages/LoginPage";

import Scanner from "./src/Components/Scanner";
import SelectPage from "./src/Components/SelectPage";
import Button from "./src/Components/Button";
import {storage, localSave} from "./src/utils/storage";

// 自定义变量
const Navigator = StackNavigator(
    {

        HomePage: { screen: HomePage },
        PrivatePage: { screen: PrivatePage },
        SignPage: { screen: SignPage },
        LoginPage: { screen: LoginPage },
        Scanner: { screen: Scanner },
        SelectPage: { screen: SelectPage },
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: "#fafafa",
                borderBottomWidth: 0,
                elevation: 0,
            },
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#222",
                lineHeight: 26,
                textAlign: "center",
            },
            headerTintColor: "#323232",
            headerBackTitle: null,
        },
    },
);

const myStore = createStore(
    reducers
);

const OpenPassWordTitleInput = I18n.t("Public OpenPassWord Title Input");
const OpenPassWordTitleSet = I18n.t("Public OpenPassWord Title Set");
const OpenPassWordTitleInputErrorTip = I18n.t("Public OpenPassWord Input ErrorTip");
export default class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isShowModal: true,
            PassWordTitle: OpenPassWordTitleInput,
            PassWordErrorTip: OpenPassWordTitleInputErrorTip,
            openPassword: "",
            openPasswordEntry: true,
            appState: AppState.currentState,
        };
    }

    componentWillMount() {
        storage.load({key: "PrivateKeyPassword"}).then((ret) => {
            global.OpenPasswordMd5 = ret;
            SplashScreen.hide();
        }).catch(err => {
            global.OpenPasswordMd5 = "";
            SplashScreen.hide();
            this.setState({
                PassWordTitle: OpenPassWordTitleSet,
            });
        });
    }

    componentDidMount() {
        AppState.addEventListener("change", this._handleAppStateChange);
        SplashScreen.hide();
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState === "background" && nextAppState === "active") {
            if (!global.OpenPasswordMd5) {
                this.setState({
                    PassWordTitle: OpenPassWordTitleSet,
                });
            } else {
                this.setState({
                    PassWordTitle: OpenPassWordTitleInput,
                });
            }
            this.setModalShow();
        } else {
            Clipboard.setString("");
        }
        this.setState({
            appState: nextAppState,
        });
    };

    setModalShow = () => {
        this.setState({
            isShowModal: true,
            openPassword: "",
        });
    };

    setModalHidden = () => {
        this.setState({
            isShowModal: false,
            openPassword: "",
        });
    };

    onChangeTextInput = openPassword => {
        const reg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        reg.test(openPassword) ? this.setState({PassWordErrorTip: "", openPassword}) : this.setState({PassWordErrorTip: OpenPassWordTitleInputErrorTip, openPassword});
    };

    SaveOpenPassword = () => {
        const openPassword = CryptoJS.MD5(this.state.openPassword).toString();
        if (global.OpenPasswordMd5) {
            if ( openPassword === global.OpenPasswordMd5) {
                global.OpenPassword = openPassword;
                this.setModalHidden();
            } else {
                this.setState({
                    PassWordErrorTip: I18n.t("Public OpenPassWord ErrorTip"),
                });
            }
        } else {
            global.OpenPasswordMd5 = openPassword;
            localSave.setPrivateKeyPassword(openPassword);
            this.setModalHidden();
        }
    };

    render() {
        return (
            <Provider store={myStore}>
                {this.state.isShowModal ? (
                    <Modal
                        transparent={false}
                        visible={true}
                        onRequestClose={() => {}}
                    >
                        <View style={styles.ModalBody}>
                            <View style={styles.FromItem}>
                                <Text style={styles.Title}>{this.state.PassWordTitle}</Text>
                            </View>
                            <View style={styles.FromItem}>
                                <TextInput
                                    style={styles.passwordInput}
                                    onChangeText={this.onChangeTextInput}
                                    value={this.state.openPassword}
                                    secureTextEntry={this.state.openPasswordEntry}
                                    autoFocus={true}
                                    underlineColorAndroid="transparent"
                                />
                                <Icon style={styles.passwordEye} name={this.state.openPasswordEntry ? "ios-eye" : "ios-eye-off"} color="#555" size={22} onPress={() => this.setState({openPasswordEntry: !this.state.openPasswordEntry})}/>
                            </View>
                            <View style={styles.FromItem}>
                                <Text style={styles.Error}>{this.state.PassWordErrorTip}</Text>
                            </View>
                            <View style={styles.FromItem}>
                                <Button name={I18n.t("Public OpenPassWord Button ButtonName")} onPress={this.SaveOpenPassword} Disable={true}/>
                            </View>
                        </View>
                    </Modal>
                ) : <Navigator/>}
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    ModalBody: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    FromItem: {
        position: "relative",
        marginBottom: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    Title: {
        fontSize: 22,
        marginBottom: 22,
    },
    passwordInput: {
        width: "80%",
        height: 40,
        padding: 0,
        borderColor: "#eee",
        borderWidth: 1,
        fontSize: 22,
        textAlign: "center",
    },
    passwordEye: {
        position: "absolute",
        right: 12,
    },
    Error: {
        fontSize: 14,
        color: "#CC6666",
        marginTop: 14,
    },
});
