function checkReachIntoPackage({ context, namespace, importRe }) {
  return function evaluateImport(node, importName) {
    if (!importName) return;
    if (importName.indexOf(namespace) === -1) return;
    if (!importRe.test(importName)) return;

    context.report({
      node,
      message: `Cannot reach into top-level package for "${importName}"`
    });
  };
}

function namespaceOption(options) {
  return options.find(o => o.hasOwnProperty("namespace"));
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {},
    schema: [
      {
        type: "object",
        properties: {
          namespace: {
            type: "string"
          }
        },
        additionalProperties: false
      }
    ]
  },
  create: context => {
    const option = namespaceOption(context.options);
    if (!option) {
      return;
    }
    const namespace = option.namespace;
    const importRe = new RegExp(`${namespace}\/.+\/`);
    const evaluate = checkReachIntoPackage({ context, namespace, importRe });

    return {
      "CallExpression[callee.name=/require/]": node => {
        if (node.arguments.length === 0) return;
        const importName = node.arguments[0].value;
        evaluate(node, importName);
      },
      ImportDeclaration: node => {
        const importName = node.source.value;
        evaluate(node, importName);
      }
    };
  }
};