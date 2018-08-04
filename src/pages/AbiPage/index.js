// 引入公共组件
import React, { Component } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// 自定义组件
import Alert from "../../Components/Alert";
import Button from "../../Components/Button";
import TextArea from "../../Components/TextArea";
import TextInput from "../../Components/TextInput";
import { mainStyles } from "../../utils/style";
import I18n from "../../utils/I18n";
import {storage} from "../../utils/storage";

export default class AbiPage extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Homepage ButtonName AbiPage"),
        };
    };

    constructor (props) {
        super(props);
        this.state = {
            ContractName: "",
            Abi: "",
            AbiArr: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params) {
            const { jsonInfo } = nextProps.navigation.state.params;

            if (jsonInfo) {
                this.setAbi(jsonInfo);
            }
        }
    }

    componentWillMount() {
        this.getAbiArrFromStorage();
    };

    componentDidMount() {}

    openCamera = () => {
        if (!this.state.ContractName) {return;}
        this.props.navigation.navigate("Scanner", {backUrl: "AbiPage"});
    };

    setAbi = (str) => {
        const json = JSON.parse(str);
    };

    getAbiArrFromStorage = () => {
        storage.load({key: "AbiArr"}).then((ret) => {
            if (ret) {
                ret.forEach(item => {});
                this.setState({
                    AbiArr: this.state.AbiArr,
                });
            }
        }).catch(err => {
            console.log(err);
        });
    };

    render() {
        return (
            <KeyboardAwareScrollView style={mainStyles.BodyBox}>
                <View style={mainStyles.FromItem}>
                    <Alert title={I18n.t("AbiPage Info Title")} Description={I18n.t("AbiPage Info Description")}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextInput required={true} label={I18n.t("AbiPage TextInput ContractName label")} icon="user" placeholder={I18n.t("AbiPage TextInput ContractName Placeholder")} value={this.state.ContractName} onChange={ContractName => this.setState({ContractName})} onBlur={() => {}}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <Button name={I18n.t("Public BlockInfo ButtonName")} onPress={this.openCamera} Disable={true}/>
                </View>
                <View style={mainStyles.FromItem}>
                    <TextArea text={this.state.Abi} placeholder={I18n.t("AbiPage TextArea Placeholder")}/>
                </View>
                <View style={{height: 100}}/>
            </KeyboardAwareScrollView>
        );
    }
}
