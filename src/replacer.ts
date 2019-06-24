import * as acorn from 'acorn';
// @ts-ignore
import * as walk from 'acorn-walk/dist/walk';
import { generate } from 'astring';

export function replace(source: string, dictionary: KeyValue, functionName = 'i18n') {
  let diff = 0;
  const missingTranslations: string[] = [];
  const missingParams = new Map<string, string>();
  walk.simple(acorn.parse(source, { sourceType: 'module' }), {
    CallExpression(node: any) {
      if (node.callee.name === functionName) {
        let value = 'undefined';
        if (node.arguments.length === 1) {
          const translation = translate(getTranslationKey(node, functionName), dictionary, missingTranslations);
          value = `'${translation}'`;
        } else if (node.arguments.length === 2) {
          const key = getTranslationKey(node, functionName);

          if (key && node.arguments[1].type === 'ObjectExpression') {
            const { params, values } = getReplaceParams(node);
            let translation = translate(key, dictionary, missingTranslations);
            translation = dynamicReplace(translation, values, params, missingParams, key);
            value = `\`${translation}\``;
          } else {
            console.error(`Second parameter of ${functionName} for ${key} has to be object declaration.`);
          }
        }
        source = `${source.substring(0, node.start + diff)}${value}${source.substring(node.end + diff)}`;
        diff += value.length - (node.end - node.start);
      }
    }
  });

  if (missingTranslations.length > 0 || missingParams.size > 0) {
    console.warn({ missingTranslations, missingParams });
  }
  return source;
}

function getTranslationKey(node: any, functionName: string): string | undefined {
  if (node.arguments[0].type === 'Literal') {
    return node.arguments[0].value;
  } else {
    console.error(
      `First parameter of ${functionName} has to be string literal but was ${node.arguments[0].type} (name: ${node.arguments[0].name}).`
    );
    return undefined;
  }
}

function getReplaceParams(node: any): { params: KeyValue; values: KeyValue } {
  const params: KeyValue = {};
  const values: KeyValue = {};

  node.arguments[1].properties.forEach((param: any) => {
    switch (param.value.type) {
      case 'Identifier':
          params[param.key.name] = param.value.name;
          break;
      case 'MemberExpression':
      case 'CallExpression':
        params[param.key.name] = generate(param.value);
        break;
      case 'Literal':
        values[param.key.name] = param.value.value;
        break;
      default:
        console.warn(`${param.value.type} is not a handled param type`);
    }
  });

  return { params, values };
}

function translate(key: string, dictionary: KeyValue, missingTranslations: string[]): string {
  if (dictionary.hasOwnProperty(key)) {
    return dictionary[key];
  } else {
    missingTranslations.push(key);
    return key;
  }
}

function dynamicReplace(
  translation: string,
  statics: KeyValue,
  dynamics: KeyValue,
  missingParams: Map<string, string>,
  key: string
): string {
  return translation.replace(/{{\s*(.[^}]+)\s*}}/g, (_: string, replaceKey: string) => {
    if (statics.hasOwnProperty(replaceKey)) {
      return statics[replaceKey];
    }
    if (dynamics.hasOwnProperty(replaceKey)) {
      return `\${${dynamics[replaceKey]}}`;
    }
    missingParams.set(key, replaceKey);
    return `{{${replaceKey}}}`;
  });
}

interface KeyValue {
  [index: string]: string;
}
