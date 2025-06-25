const debugEnabled = process.env.DEBUG === 'true';

module.exports = {
  debug: (...args) => {
    if (debugEnabled) {
      console.log(...args);
    }
  }
};
