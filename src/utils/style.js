import { StyleSheet } from "react-native";

const mainStyles = StyleSheet.create({
    BodyBox: {
        position: "relative",
        flexBasis: "100%",
        paddingTop: 20,
        backgroundColor: "#fff",
    },
    FromItem: {
        position: "relative",
        width: "96%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});

const PrivatePageStyles = StyleSheet.create({
    TextBox: {
        position: "relative",
        width: "94%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
    },
    TextItemBox: {
        marginBottom: 10,
    },
    TextItemText: {
        fontSize: 14,
        color: "#222",
        lineHeight: 28,
    },
    FromItem: {
        position: "relative",
        width: "98%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    PrivateKeyList: {
        position: "relative",
        width: "96%",
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
        lineHeight: 28,
    },
    listItemBox: {},
    listItem: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#efefef"
    },
    listItemCon: {
        flexBasis: "75%",
        fontSize: 14,
        color: "#555",
        lineHeight: 60,
    },
    listItemActions: {
        flexBasis: "25%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
    listItemDelete: {
        fontSize: 14,
        color: "#CC0066",
    },
    ModalBox: {
        flexBasis: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, .2)",
    },
    ModalBodyBox: {
        position: "relative",
        height: 180,
        width: "90%",
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 26,
        paddingLeft: 26,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 4,
    },
    ModalBodyText: {
        fontSize: 16,
        lineHeight: 32,
        marginBottom: 15,
    },
    ModalBodyCopyText: {
        marginTop: 15,
        fontSize: 12,
        color: "#CC0066",
    },
    CloseIcon: {
        position: "absolute",
        right: 1,
        top: 0,
    },
});
export {
    mainStyles,
    PrivatePageStyles,
};
