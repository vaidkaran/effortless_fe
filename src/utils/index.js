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
  getResolvedString: (string, opts={}) => {
    const json = opts.envJsonFlattened ? opts.envJsonFlattened : {};
    // match characters between {{ and }}
    // https://stackoverflow.com/questions/6109882/regex-match-all-characters-between-two-strings
    // added an extra ? to make it ungreedy
    const matches = string.match(/(?<={{)(.+?)(?=}})/g);
    
    if(matches) {
      let resolvedString = string;
      matches.forEach(e => {
        const variablePath = e.match(/env\.(.+)/)[1];
        if(json[variablePath]) {
          resolvedString = string.replaceAll(/{{(.+?)}}/g, json[variablePath]);
        }
      });
      return resolvedString;
    }
    return string;
  }
}


/*
{
  "dev": {
      "name": "karan",
      "url": "https://jsonplaceholder.typicode.com"
  },
  "qa": {
      "name": "ankur"
  }
}
*/