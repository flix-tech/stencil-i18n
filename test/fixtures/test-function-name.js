import { c as registerInstance, f as h } from './testcomponents-7aa02c6d.js';

class TestComponent {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    const a = notTheSame('simple-message');
    const b = 1234;
    const to = 'abc'
    return h('div', {
      class: 'test-component',
      attrName: notTheSame('VAR.TO.REPLACE', { varName: 'static replace'})
   }, h("h2", { class: "test-heading" }, notTheSame('multiVars', {
     from: b,
     to
   })),);
  }
}

export { TestComponent as test_component };
