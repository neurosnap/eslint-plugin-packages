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
ruleTester.run("circular-import", rule, {
  valid: [
    {
      code: `import { actionCreators } from '@app/thread';
import _ from 'lodash';
`,
      parserOptions,
      options,
      filename: `${process.cwd()}/packages/mail/something.js`
    },
    {
      code: `import { actionCreators } from '.';
import _ from 'lodash';
`,
      parserOptions,
      options,
      filename: `${process.cwd()}/packages/mail/something.js`
    }
  ],
  invalid: [
    {
      code: `import { actionCreators } from '@app/thread';
import _ from 'lodash';
`,
      errors: [
        {
          message:
            "when importing to the same package (@app/thread), use relative imports (./)",
          line: 1,
          column: 1,
          type: "ImportDeclaration"
        }
      ],
      parserOptions,
      options,
      filename: `${process.cwd()}/packages/thread/something.js`
    },
    {
      code: `import { actionCreators } from '@app/ui/membership-selector';
import _ from 'lodash';
`,
      errors: [
        {
          message:
            "when importing to the same package (@app/ui/membership-selector), use relative imports (./membership-selector)",
          line: 1,
          column: 1,
          type: "ImportDeclaration"
        }
      ],
      parserOptions,
      options,
      filename: `${process.cwd()}/packages/ui/create-membership.tsx`
    },
    {
      code: `import { AssetStatusTableCellDropdown } from '@app/ui/tables/asset-status-table-cell-dropdown';
import _ from 'lodash';
`,
      errors: [
        {
          message:
            "when importing to the same package (@app/ui/tables/asset-status-table-cell-dropdown), use relative imports (./asset-status-table-cell-dropdown)",
          line: 1,
          column: 1,
          type: "ImportDeclaration"
        }
      ],
      parserOptions,
      options,
      filename: `${process.cwd()}/packages/ui/tables/saas-system-authorizations.tsx`
    },
    {
      code: `import _ from 'lodash/fp';
  import { SomeComponent } from '@app/thread/component/some-component.js';
`,
      errors: [
        {
          message:
            "when importing to the same package (@app/thread/component/some-component.js), use relative imports (./component/some-component.js)",
          line: 2,
          column: 3,
          type: "ImportDeclaration"
        }
      ],
      parserOptions,
      options,
      filename: `${process.cwd()}/packages/thread/ok-boomer.js`
    },
    {
      code: `import _ from 'lodash/fp';
  import { SomeComponent } from '@app/ui/atoms/edit-button';
`,
      errors: [
        {
          message:
            "when importing to the same package (@app/ui/atoms/edit-button), use relative imports (../atoms/edit-button)",
          line: 2,
          column: 3,
          type: "ImportDeclaration"
        }
      ],
      parserOptions,
      options,
      filename: `${process.cwd()}/packages/ui/tables/asset-status-table-cell-dropdown.tsx`
    }
  ]
});
