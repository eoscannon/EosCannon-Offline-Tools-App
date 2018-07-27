import { StyleSheet, Dimensions } from "react-native";

const ItemSize = (Dimensions.get("window").width - 10 - 30)/3;
const mainStyles = StyleSheet.create({
    BodyBox: {
        position: "relative",
        flexBasis: "100%",
        backgroundColor: "#fff",
    },
    LanguageBox: {
        marginTop: 40,
        paddingRight: 10,
        fontSize: 16,
        color: "#1890ff",
        textAlign: "right",
    },
    BodyTitle: {
        marginTop: 40,
        marginBottom: 40,
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(245, 203, 72)",
        textAlign: "center",
    },
    ContentBox: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: 5,
        paddingRight: 5,
    },
    ItemBox: {
        position: "relative",
        height: ItemSize,
        width: ItemSize,
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        overflow: "hidden",
    },
    ButtonBox: {
        height: ItemSize,
        width: ItemSize,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1890ff",
        borderWidth: 1,
        borderColor: "#1890ff",
    },
    ButtonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
    },
    ButtonDisableBox: {
        height: ItemSize,
        width: ItemSize,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#d9d9d9",
    },
    ButtonDisableText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "rgba(0,0,0,.25)",
    },
});

export {
    mainStyles,
};
