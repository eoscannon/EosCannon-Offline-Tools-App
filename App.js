// 引入公共组件
import React, { Component } from "react";
import {createStore } from "redux";
import {Provider} from "react-redux";
import { StackNavigator } from "react-navigation";
import { View, Modal, Text, AppState, TextInput, StyleSheet } from "react-native";
import CryptoJS from "crypto-js";

// 引入自定义组件
import reducers from "./src/utils/reducers";
import I18n from "./src/utils/I18n";

// 引入自定义组件
import HomePage from "./src/pages/HomePage";
import PrivatePage from "./src/pages/PrivatePage";
import SignPage from "./src/pages/SignPage";
import Scanner from "./src/Components/Scanner";
import SelectPage from "./src/Components/SelectPage";
import {storage, localSave} from "./src/utils/storage";

// 自定义变量
const Navigator = StackNavigator(
    {
        HomePage: { screen: HomePage },
        PrivatePage: { screen: PrivatePage },
        SignPage: { screen: SignPage },
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
export default class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isShowModal: true,
            PassWordErrorTip: "",
            openPassword: "",
            appState: AppState.currentState,
        };
    }

    componentWillMount() {
        storage.load({key: "PrivateKeyPassword"}).then((ret) => {
            global.OpenPasswordMd5 = ret;
        }).catch(err => {
            global.OpenPasswordMd5 = "";
        });
    }

    componentDidMount() {
        AppState.addEventListener("change", this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState === "background" && nextAppState === "active") {
            this.setModalShow();
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
        openPassword.length == 6 ? this.SaveOpenPassword(openPassword) : this.setState({PassWordErrorTip: ""});
        this.setState({openPassword});
    };

    SaveOpenPassword = openPassword => {
        const md5 = CryptoJS.MD5(openPassword).toString();
        if (global.OpenPasswordMd5) {
            if ( md5 === global.OpenPasswordMd5) {
                global.OpenPassword = openPassword;
                this.setModalHidden();
            } else {
                this.setState({
                    PassWordErrorTip: I18n.t("Public OpenPassWord ErrorTip"),
                });
            }
        } else {
            global.OpenPasswordMd5 = md5;
            global.OpenPassword = openPassword;
            localSave.setPrivateKeyPassword(md5);
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
                            <Text style={styles.ModalBodyTitle}>{I18n.t("Public OpenPassWord Title")}</Text>
                            <TextInput
                                style={styles.ModalBodyTextInput}
                                onChangeText={this.onChangeTextInput}
                                value={this.state.openPassword}
                                maxLength={6}
                                secureTextEntry={true}
                                keyboardType="numeric"
                                autoFocus={true}
                            />
                            <Text style={styles.ModalBodyError}>{this.state.PassWordErrorTip}</Text>
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
    ModalBodyTitle: {
        fontSize: 22,
        marginBottom: 22,
    },
    ModalBodyTextInput: {
        width: "80%",
        height: 40,
        borderColor: "#eee",
        borderWidth: 1,
        textAlign: "center",
    },
    ModalBodyError: {
        fontSize: 14,
        color: "#CC6666",
        marginTop: 14,
    },
});
