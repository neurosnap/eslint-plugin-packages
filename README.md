# eslint-plugin-packages [![Build Status](https://travis-ci.org/neurosnap/eslint-plugin-packages.svg?branch=master)](https://travis-ci.org/neurosnap/eslint-plugin-packages)

Manage your monorepo with eslint

## Rules

`module-boundary`:

- Cannot reach into top-level `@app` packages
- Cannot import from the same package

### `module-boundary`

This rule will check all import/require to ensure it does not reach into a
top-level `packages` folder

#### Valid

```js
import { actionCreators } from "@app/thread";
```

#### Invalid

```js
import { actionCreators } from "@app/thread/message";
```

### `circular-imports`

#### Valid

```js
// ./packages/mail/something.js
import { actionCreators } from "@app/thread";
```

#### Invalid

```js
// ./packages/thread/something.js
import { actionCreators } from "@app/thread";
```
