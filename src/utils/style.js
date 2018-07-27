import { StyleSheet, Dimensions } from "react-native";

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

export {
    mainStyles,
};
