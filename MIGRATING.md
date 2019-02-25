# Migration guide

## From 1.x.x to 2.x.x

A breaking change had to happen on `redux-form-input-masks@2.0.0` in order to fix both [#37](https://github.com/renato-bohler/redux-form-input-masks/issues/37) and [#64](https://github.com/renato-bohler/redux-form-input-masks/issues/64). The reason is explained on [this comment](https://github.com/renato-bohler/redux-form-input-masks/issues/37#issuecomment-398935472).

Basically, for `createNumberMask`, if the `allowEmpty` message is set to `true`, the empty value at version `2.x.x` will be `null` instead of `undefined` (or empty string). If you never used `createNumberMask`'s `allowEmpty` option, you should be fine to migrate, otherwise you'll need to test if there's anything broken.
