import { c as registerInstance, f as h } from './testcomponents-7aa02c6d.js';

class TestComponent {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    let key = 'key1';
    key = 'key2';

    const obj = {
      param1: '1'
    };
    obj.param2 = 2;

    const err = i18n(key, obj);
    return h('div', {
      class: 'test-component'
   });
  }
}

export { TestComponent as test_component };
