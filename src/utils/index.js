module.exports = {
  getKeyString: (name) => {
    return `${name}-${Math.random().toString(36).slice(2)}`;
  },
}