const rule = require("./module-boundary");
const RuleTester = require("eslint").RuleTester;

const parserOptions = {
  ecmaVersion: 6,
  sourceType: "module",
  ecmaFeatures: {
    experimentalObjectRestSpread: true
  }
};

const options = [
  {
    namespace: "@app",
    packagesDir: "./packages"
  }
];

const ruleTester = new RuleTester();
ruleTester.run("module-boundary", rule, {
  valid: [
    {
      code: `import { actionCreators } from '@app/thread';
import _ from 'lodash';
`,
      parserOptions,
      options
    },
    {
      code: `const thread = require('@app/thread');
`,
      parserOptions,
      options
    }
  ],
  invalid: [
    {
      code: `import { actionCreators } from '@app/thread/message';
`,
      errors: [
        {
          message:
            'Cannot reach into package (@app/thread/message): import "@app/thread" instead',
          line: 1,
          column: 1,
          type: "ImportDeclaration"
        }
      ],
      parserOptions,
      options
    },
    {
      code: `import _ from 'lodash/fp';
  import { SomeComponent } from '@app/thread/component/some-component.js';
`,
      errors: [
        {
          message:
            'Cannot reach into package (@app/thread/component/some-component.js): import "@app/thread" instead',
          line: 2,
          column: 3,
          type: "ImportDeclaration"
        }
      ],
      parserOptions,
      options
    },
    {
      code: `import _ from 'lodash/fp';
const message = require('@app/thread/message');
`,
      errors: [
        {
          message:
            'Cannot reach into package (@app/thread/message): import "@app/thread" instead',
          line: 2,
          column: 17,
          type: "CallExpression"
        }
      ],
      parserOptions,
      options
    }
  ]
});
