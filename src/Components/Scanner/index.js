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
        //     this.onRead({data: null});
        // }, 1000);
    }

    onRead = (res) => {
        const jsonInfo = res.data ? res.data : {"expiration":"2018-07-21T16:31:38","refBlockNum":64400,"refBlockPrefix":3802453534,"chainId":"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"};
        this.props.navigation.navigate(this.props.navigation.state.params.backUrl, {jsonInfo: JSON.stringify(jsonInfo)});
    };

    render() {
        return (
            <View style={styles.container}>
                <QRscanner onRead={this.onRead} finderY={50}/>
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
