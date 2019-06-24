import * as d from './declarations';
import * as fs from 'fs';


export function usePlugin(fileName: string) {
  if (typeof fileName === 'string') {
    return /(\.jsx|\.js)$/i.test(fileName);
  }
  return true;
}


export function getContext(context: d.PluginCtx) {
  context = context || {} as any;

  if (!Array.isArray(context.diagnostics)) {
    context.diagnostics = [];
  }

  context.config = context.config || {};

  if (typeof context.config.rootDir !== 'string') {
    context.config.rootDir = __dirname;
  }

  if (typeof context.config.srcDir !== 'string') {
    context.config.srcDir = __dirname;
  }

  context.fs = context.fs || {};

  if (typeof context.fs.readFileSync !== 'function') {
    context.fs.readFileSync = (filePath: string) => {
      return fs.readFileSync(filePath, 'utf8');
    };
  }

  if (typeof context.fs.writeFile !== 'function') {
    context.fs.writeFile = () => {
      return Promise.resolve();
    };
  }

  return context;
}
