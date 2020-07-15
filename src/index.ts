import * as fs from 'fs';
import * as path from 'path';
import * as d from './declarations';
import { replace } from './replacer';
import * as util from './util';

export function i18n(options: d.PluginOptions = {}) {
  const locale = process.env.i18n_locale || 'en';
  const srcPath = path.join(process.cwd(), '/', options.srcPath ?? '/src');
  const localePath = path.join(process.cwd(), options.dictionaryPath, `messages.${locale}.json`);
  const file = fs.readFileSync(localePath, 'utf8');

  return {
    name: 'i18n',

    transform(sourceText: string, fileName: string, context?: d.PluginCtx) {
      if (!util.usePlugin(fileName, srcPath)) {
        return null;
      }

      if (typeof sourceText !== 'string') {
        return null;
      }

      context = util.getContext(context);

      const results: d.PluginTransformResults = {
        id: fileName,
      };

      if (sourceText.trim() === '') {
        results.code = '';
        return Promise.resolve(results);
      }

      return new Promise<d.PluginTransformResults>((resolve) => {
        try {
          results.code = replace(sourceText, JSON.parse(file), options.functionName);

          context.fs.writeFile(results.id, results.code, { inMemoryOnly: true }).then(() => {
            resolve(results);
          });
        } catch (e) {
          const diagnostic: d.Diagnostic = {
            level: 'error',
            type: 'typescript',
            language: 'typescript',
            header: 'i18n error',
            relFilePath: null,
            absFilePath: null,
            messageText: e,
            lines: [],
          };
          context.diagnostics.push(diagnostic);

          results.code = `/**  i18n error${e && e.message ? ': ' + e.message : ''}  **/`;
          results.diagnostics = [diagnostic];
          resolve(results);
        }
      });
    },
  };
}
