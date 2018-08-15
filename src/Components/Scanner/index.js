import React, {Component} from "react";
import {StyleSheet, TouchableOpacity, Image, View} from "react-native";
import {QRscanner} from "react-native-qr-scanner";
import I18n from "../../utils/I18n";

export default class Scanner extends Component {
    static navigationOptions = ( props ) => {
        return {
            title: I18n.t("Public Scanner NavigationTitle"),
        };
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // setTimeout(() => {
        //     this.onRead({data: JSON.stringify({"compression":"none","transaction":{"expiration":"2018-08-06T07:22:19","ref_block_num":54704,"ref_block_prefix":1848123983,"net_usage_words":0,"max_cpu_usage_ms":0,"delay_sec":0,"context_free_actions":[],"actions":[{"account":"eosio","name":"delegatebw","authorization":[{"actor":"zhujingxinga","permission":"active"}],"data":"60d8749d4df774fb1042c62a4f3aa741102700000000000004454f5300000000102700000000000004454f530000000000"}],"transaction_extensions":[]},"signatures":[]})});
        // }, 1000);
    }

    onRead = (res) => {
        const UnSignedBuffer = res.data ? res.data : "";
        this.props.navigation.navigate(this.props.navigation.state.params.backUrl, {UnSignedBuffer});
    };

    render() {
        return (
            <View style={styles.container}>
                <QRscanner onRead={this.onRead} finderY={50} hintTextPosition={100}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
});
