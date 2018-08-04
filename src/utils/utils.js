import producers from "./producers.json";
import default_abi from "./abi/default_abi.js";
import eosdactokens_abi from "./abi/eosdactokens_abi.js";
import everipediaiq_abi from "./abi/everipediaiq_abi.js";

const localChainId = "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906";

const getTransactionHeadersFromJsonInfo = jsonInfo => {
    const { refBlockNum, refBlockPrefix, expiration } = JSON.parse(jsonInfo);
    return {
        expiration,
        ref_block_num: refBlockNum,
        ref_block_prefix: refBlockPrefix,
    };
};

const getChainIdFromJsonInfoOrConfig = jsonInfo => {
    let { chainId } = JSON.parse(jsonInfo);
    chainId = chainId || localChainId;
    return chainId;
};

const voteNodes = [];
producers.forEach(item => {
    voteNodes.push(item.owner);
});

const abi = {
    eosdactokens: {
        abi: eosdactokens_abi,
    },
    everipediaiq: {
        abi: everipediaiq_abi,
    },
    default: {
        abi: default_abi,
    },
};

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
    getTransactionHeadersFromJsonInfo,
    getChainIdFromJsonInfoOrConfig,
    voteNodes,
    abi,
    PrivateKeyFormat,
    getPrivateKeyBySelectedPk,
};
