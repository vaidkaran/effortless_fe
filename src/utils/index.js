module.exports = {
  getKeyString: (name) => {
    return `${name}-${Math.random().toString(36).slice(2)}`;
  },

  // expects state.reqData as arg
  getSelectedFileAndReq: (state) => {
    const {selectedFileId} = state;
    if(!selectedFileId) return {};

    const {selectedReqId} = state[selectedFileId].requests;
    return {
      selectedFileId,
      selectedReqId,
      selectedReq: state[selectedFileId].requests[selectedReqId],
    };
  }
}