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
  },

  // resolves {{vars}} with their values from the json provided
  getResolvedString: (string, json) => {
    // match characters between {{ and }}
    // https://stackoverflow.com/questions/6109882/regex-match-all-characters-between-two-strings
    // added an extra ? to make it ungreedy
    const matches = string.match(/(?<={{)(.+?)(?=}})/g);
    
    if(matches) {
      let resolvedString = string;
      matches.forEach(e => {
        if(json[e]) {
          resolvedString = string.replaceAll(/{{(.+?)}}/g, json[e]);
        }
      });
      return resolvedString;
    }
    return string;
  }
}