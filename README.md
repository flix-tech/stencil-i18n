[![Build Status](https://travis-ci.org/flix-tech/stencil-i18n.svg?branch=master)](https://travis-ci.org/flix-tech/stencil-i18n)
# Static translations (Stencil plugin)

Generating staticly translated bundles.

## Getting started
```bash
npm i @flix-tech/stencil-i18n
```

configure it in `stencil.config.js`
```javascript
const { i18n } = require('@flix-tech/stencil-i18n');

...

plugins: [
    ...,
    i18n({
      functionName: 'i18n', // default value is i18n
      dictionaryPath: 'src/i18n'
    })
  ]
```

Create the dummy function inside src folder to satisfy typescript and have a fallback.

```typescript
export function i18n(key: string, params?: { [index: string]: string | number }): string {
  return key;
}
```

Put the translation files `messages.${locale}.json` into the `dictionaryPath` like specified in the stencil config.
Configure the build task in your `package.json` similar to the following.

```
"build": "for lang in en de; do i18n_locale=$lang stencil build && mkdir -p dist-build/$lang && mv dist/* dist-build/$lang; done && mv dist-build/* dist/ && rm -R dist-build"
```

Be sure to put the `i18n_locale` environment variable containing the same as `messages.${locale}.json` `locale`.
Use the function you defined in `functionName` to translate.
Import the dummy function defined before.
```javascript
const param3 = 'bye';
...
i18n('TRANSLATION.KEY', {
    param1: 1234,
    param2: 'hello',
    param3
});
```

## Angular

To include the resulting components into your angular project do a dynamic import in the app component to have the components in the whole project but be able to also access the `LOCALE_ID`. `YOUR_COMPONENT_NAME` can be the npm name `@scope/package`.

```typescript
import { Component, Inject, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(@Inject(LOCALE_ID) locale: string) {
    import(`<YOUR_COMPONENT_NAME>/dist/${locale}/loader`).then(webcomponent => {
      webcomponent.defineCustomElements(window);
    });
  }
}

```