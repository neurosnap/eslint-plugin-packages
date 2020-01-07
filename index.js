/* eslint-disable global-require */

const allRules = {
  "module-boundary": require("./lib/rules/module-boundary")
};

module.exports = {
  rules: allRules,
  configs: {
    all: {
      rules: {
        "module-boundary": 2
      }
    },
    recommended: {
      rules: {
        "module-boundary": 2
      }
    }
  }
};
