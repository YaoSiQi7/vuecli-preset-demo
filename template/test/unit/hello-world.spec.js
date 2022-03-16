import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/views/HelloWorld';

// eslint-disable-next-line no-use-before-define
describe('HelloWorld.vue', () => {
  // eslint-disable-next-line no-use-before-define
  it('renders props.msg when passed', () => {
    const msg = 'Welcome to Vuetify';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    // eslint-disable-next-line no-use-before-define
    expect(wrapper.text()).toMatch(msg);
  });
});
