export interface PluginOptions {
  /**
   * name of the translation function
   */
  functionName?: string;

  /**
   * Path to a file to compile.
   */
  file?: string;

  /**
   * A string to pass to compile.
   */
  data?: string;

  /**
   * path to files containing translations.
   */
  dictionaryPath?: string;

  /**
   * path to source files that will be translated. If not defined, path will be "src"
   */
  srcPath?: string;
}

export type ImporterReturnType = { file: string } | { contents: string } | Error | null;

export type Importer = (url: string, prev: string, done: (data: ImporterReturnType) => void) => ImporterReturnType | void;

export interface PluginTransformResults {
  code?: string;
  id?: string;
  diagnostics?: Diagnostic[];
}

export interface PluginCtx {
  config: {
    rootDir?: string;
    srcDir?: string;
  };
  fs: any;
  diagnostics: Diagnostic[];
}

export interface Diagnostic {
  level: 'error' | 'warn' | 'info' | 'log' | 'debug';
  type: 'typescript' | 'bundling' | 'build' | 'runtime' | 'hydrate' | 'css';
  header?: string;
  language?: string;
  messageText: string;
  code?: string;
  absFilePath?: string;
  relFilePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  lines?: PrintLine[];
}

export interface PrintLine {
  lineIndex: number;
  lineNumber: number;
  text?: string;
  errorCharStart: number;
  errorLength?: number;
}
