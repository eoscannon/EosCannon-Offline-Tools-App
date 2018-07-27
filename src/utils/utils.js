import producers from "./producers.json";

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

export {
    getTransactionHeadersFromJsonInfo,
    getChainIdFromJsonInfoOrConfig,
    voteNodes,
};
