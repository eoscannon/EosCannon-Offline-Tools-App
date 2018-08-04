import { StyleSheet, Dimensions } from "react-native";

const HeaderBgImgHeight = Dimensions.get("window").width/375*240;
const HeaderWelcomeImgMarginTop = HeaderBgImgHeight - 174;
const mainStyles = StyleSheet.create({
    BodyBox: {
        position: "relative",
        flexBasis: "100%",
        backgroundColor: "#fff",
    },
    HeaderBox: {
        position: "relative",
        width: "100%",
        height: HeaderBgImgHeight,
    },
    HeaderConBox: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 101,
        paddingLeft: 20,
    },
    HeaderWelcomeImg: {
        marginTop: HeaderWelcomeImgMarginTop,
    },
    HeaderCannonImg: {},
    HeaderLanguageImg: {
        marginTop: 32,
    },
    HeaderBgImg: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    ListBox: {
        paddingLeft: 20,
    },
    ListItemBox: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        height: 64,
        paddingRight: 20,
    },
    ListItemButton: {
        fontSize: 16,
        color: "#000",
    },
    ListItemMoreIcon: {},
    FooterBox: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 64,
    },
    FooterIcon: {},
});

export {
    mainStyles,
};
