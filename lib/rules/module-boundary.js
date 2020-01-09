const path = require("path");

function checkReachIntoPackage({ context, namespace, importRe }) {
  return function evaluateImport(node, importName) {
    if (!importName) return true;
    if (importName.indexOf(namespace) === -1) return true;
    if (!importRe.test(importName)) return true;

    const useRe = new RegExp(`(${namespace}\/[a-zA-Z_-]+)\/`);
    const use = useRe.exec(importName);
    const should = use && use.length > 1 ? use[1] : "unknown";
    context.report({
      node,
      message: `Cannot reach into package (${importName}): import "${should}" instead`
    });
    return false;
  };
}

function checkCircularImport({
  context,
  node,
  namespace,
  importName,
  resolve
}) {
  if (importName.indexOf(namespace) === -1) {
    return true;
  }

  const re = new RegExp(`(${namespace}\/[a-zA-z-_]+)`);
  const relativeFname = `${namespace}${resolve}`;
  const r1 = re.exec(relativeFname);
  const r2 = re.exec(importName);
  if (!r1 || !r2) {
    return true;
  }
  const results = r1[1] === r2[1];
  if (results) {
    const boo = new RegExp(/(\/[a-zA-Z-_.]+)$/);
    const relative = path.relative(relativeFname.replace(boo, ""), importName);
    const suggest = relative[0] === "." ? relative : `./${relative}`;
    context.report({
      node,
      message: `when importing to the same package (${importName}), use relative imports (${suggest})`
    });
    return false;
  }

  return true;
}

function getOptions(options) {
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
          },
          packagesDir: {
            type: "string"
          }
        },
        additionalProperties: false
      }
    ]
  },
  create: context => {
    const { namespace, packagesDir } = getOptions(context.options);
    if (!namespace) {
      return;
    }
    const fname = context.getFilename();
    const cwd = context.getCwd();

    const importRe = new RegExp(`${namespace}\/.+\/`);
    const checkPackage = checkReachIntoPackage({
      context,
      namespace,
      importRe
    });
    const absolutePkgDir = path.resolve(cwd, packagesDir);
    const resolve = fname.replace(absolutePkgDir, "");
    const checkCircular = (node, importName) =>
      checkCircularImport({ context, node, namespace, importName, resolve });

    return {
      "CallExpression[callee.name=/require/]": node => {
        if (node.arguments.length === 0) return;
        const importName = node.arguments[0].value;
        if (!checkCircular(node, importName)) return;
        checkPackage(node, importName);
      },
      ImportDeclaration: node => {
        const importName = node.source.value;
        if (!checkCircular(node, importName)) return;
        checkPackage(node, importName);
      }
    };
  }
};
