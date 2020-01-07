# eslint module boundary rule

## Rules

`module-boundary`:

- Cannot reach into top-level `@app` packages

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
