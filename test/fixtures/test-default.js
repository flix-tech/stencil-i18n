import { c as registerInstance, f as h } from './testcomponents-7aa02c6d.js';

class TestComponent {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    const a = i18n('simple-message');
    const b = 1234;
    const to = 'abc'
    return h('div', {
      class: 'test-component',
      attrName: i18n('VAR.TO.REPLACE', { varName: 'static replace'})
   }, h("h2", { class: "test-heading" }, i18n('multiVars', {
     from: b,
     to
   })),);
  }
}

export { TestComponent as test_component };
