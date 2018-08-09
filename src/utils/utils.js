const PrivateKeyFormat = PrivateKey => {
    const startStr = PrivateKey.substr(0, 6);
    const endStr = PrivateKey.substr(-6);
    return startStr + "***" + endStr;
};

const getPrivateKeyBySelectedPk = (SelectedPk, OriginPkObjArr) => {
    const SelectedPkNick = SelectedPk[0].split("：")[0];
    for (let i = 0; i < OriginPkObjArr.length; i++ ) {
        if (SelectedPkNick === OriginPkObjArr[i].Nick) {
            return OriginPkObjArr[i].PrivateKey;
        }
    }
};

export {
    PrivateKeyFormat,
    getPrivateKeyBySelectedPk,
};
