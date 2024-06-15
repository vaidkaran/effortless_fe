import { flatten } from 'flat';

let store;

const injectStore = (_store) => {
  store = _store;
}

const getKeyString = (name) => {
  return `${name}-${Math.random().toString(36).slice(2)}`;
}

// expects state.reqData as arg
const getSelectedFileAndReq = (state) => {
  const {selectedFileId} = state;
  if(!selectedFileId) return {};

  const {selectedReqId} = state[selectedFileId].requests;
  return {
    selectedFileId,
    selectedReqId,
    selectedReq: state[selectedFileId].requests[selectedReqId],
  };
}

// expectes state.fileExpArray as the first argument
const getFileItem = (fileExpArray, fileId) => {
  for (let i=0; i<fileExpArray.length; i+=1) {
    if (fileExpArray[i].key === fileId) {
      return fileExpArray[i];
    } else if (!fileExpArray[i].isLeaf && fileExpArray[i]?.children.length) {
      return getFileItem(fileExpArray[i].children, fileId);
    }
  }
}

const getAllChildrenFileIds = (dirItem) => {
  if(!dirItem.isLeaf && dirItem.children.length === 0) {
    console.log('Item passed to getAllChildrenFieldIds is not a dir');
    return;
  }
  const fileIds = [];

  function getAllFileIds(dirItem) {
    dirItem.children.forEach(item => {
      if (item.isLeaf) fileIds.push(item.key);
      else getAllFileIds(item);
    });
  }
  getAllFileIds(dirItem);
  return fileIds;
}

// resolves {{vars}} with their values from the json provided
// const getResolvedString = (string, opts={}) => {
//   const envJson = opts.envJsonFlattened ? opts.envJsonFlattened : {};
//   const savedTestVarsWithValues = opts.savedTestVarsWithValues ? opts.savedTestVarsWithValues : {}

//   // match characters between {{ and }}
//   // https://stackoverflow.com/questions/6109882/regex-match-all-characters-between-two-strings
//   // added an extra ? to make it ungreedy
//   const matches = string.match(/(?<={{)(.+?)(?=}})/g);
  
//   if(matches) {
//     let resolvedString = string;
//     matches.forEach(e => {
//       const envVarFound = e.match(/env\.(.+)/); // starts with env.
      
//       const envVarPath = envVarFound && envVarFound[1]; // starts with env.
//       if(envJson[envVarPath]) {
//         resolvedString = resolvedString.replaceAll(`{{env.${envVarPath}}}`, envJson[envVarPath]);
//       }

//       Object.keys(savedTestVarsWithValues).forEach((savedTestVar) => {
//         if(savedTestVar === e) {
//           resolvedString = resolvedString.replaceAll(`{{${e}}}`, savedTestVarsWithValues[savedTestVar]);
//         }
//       })
//     });
//     return resolvedString;
//   }
//   return string;
// }

export { injectStore, getKeyString, getSelectedFileAndReq, getFileItem, getAllChildrenFileIds };


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