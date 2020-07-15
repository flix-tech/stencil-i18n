import * as fs from 'fs';
import * as path from 'path';
import { i18n } from '../dist';
import { PluginCtx } from '../dist/declarations';

describe('test build', () => {
  afterEach(() => {
    delete process.env.i18n_locale;
  });

  it('default', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'test-default.js');
    const sourceText = fs.readFileSync(filePath, 'utf8');

    const plugin = i18n({
      dictionaryPath: 'test/fixtures/i18n',
      srcPath: 'test/fixtures',
    });

    const context: PluginCtx = {
      config: {
        rootDir: __dirname,
      },
      fs: {},
      diagnostics: [],
    };

    const results = await plugin.transform(sourceText, filePath, context);

    expect(results.code).toContain("const a = 'english';");
    expect(results.code).toContain('attrName: `Some random text with variable (static replace).`');
    expect(results.code).toContain('h("h2", { class: "test-heading" }, `${b} to ${to} with other text.`)');
  });

  it('default - de', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'test-default.js');
    const sourceText = fs.readFileSync(filePath, 'utf8');

    process.env.i18n_locale = 'de';

    const plugin = i18n({
      dictionaryPath: 'test/fixtures/i18n',
      srcPath: 'test/fixtures',
    });

    const context: PluginCtx = {
      config: {
        rootDir: __dirname,
      },
      fs: {},
      diagnostics: [],
    };

    const results = await plugin.transform(sourceText, filePath, context);

    expect(results.code).toContain("const a = 'deutsch';");
    expect(results.code).toContain('attrName: `Irgend ein zufälliger Text mit variable (static replace).`');
    expect(results.code).toContain('h("h2", { class: "test-heading" }, `${b} zu ${to} mit weiterem Text.`)');
  });

  it('rename function', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'test-function-name.js');
    const sourceText = fs.readFileSync(filePath, 'utf8');

    const plugin = i18n({
      dictionaryPath: 'test/fixtures/i18n',
      functionName: 'notTheSame',
      srcPath: 'test/fixtures',
    });

    const context: PluginCtx = {
      config: {
        rootDir: __dirname,
      },
      fs: {},
      diagnostics: [],
    };

    const results = await plugin.transform(sourceText, filePath, context);

    expect(results.code).toContain("const a = 'english';");
    expect(results.code).toContain('attrName: `Some random text with variable (static replace).`');
    expect(results.code).toContain('h("h2", { class: "test-heading" }, `${b} to ${to} with other text.`)');
  });

  it('missing params and translations', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'test-warn.js');
    const sourceText = fs.readFileSync(filePath, 'utf8');

    process.env.i18n_locale = 'error';

    const waring: string[] = [];
    spyOn(console, 'warn').and.callFake((message: any) => {
      waring.push(message);
    });

    const plugin = i18n({
      dictionaryPath: 'test/fixtures/i18n',
      srcPath: 'test/fixtures',
    });

    const context: PluginCtx = {
      config: {
        rootDir: __dirname,
      },
      fs: {},
      diagnostics: [],
    };

    const results = await plugin.transform(sourceText, filePath, context);

    expect(results.code).toContain("const a = 'simple-message';");
    expect(results.code).toContain('attrName: `VAR.TO.REPLACE`');
    expect(results.code).toContain('h("h2", { class: "test-heading" }, `${b} to {{to}} with other text.`)');

    expect(waring.length).toEqual(1);
    expect(JSON.stringify(waring[0])).toEqual('{"missingTranslations":["simple-message","VAR.TO.REPLACE"],"missingParams":{}}');
  });

  it('missing params and translations', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'test-error.js');
    const sourceText = fs.readFileSync(filePath, 'utf8');

    process.env.i18n_locale = 'error';

    const error: string[] = [];
    spyOn(console, 'error').and.callFake((message: any) => {
      error.push(message);
    });

    const plugin = i18n({
      dictionaryPath: 'test/fixtures/i18n',
      srcPath: 'test/fixtures',
    });

    const context: PluginCtx = {
      config: {
        rootDir: __dirname,
      },
      fs: {},
      diagnostics: [],
    };

    const results = await plugin.transform(sourceText, filePath, context);

    expect(error.length).toEqual(2);
    expect(error[0]).toEqual('First parameter of i18n has to be string literal but was Identifier (name: key).');
    expect(error[1]).toEqual('Second parameter of i18n for undefined has to be object declaration.');
  });
});
