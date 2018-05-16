const sleep = async delay => new Promise(resolve => setTimeout(resolve, delay));
const record = require('./record');
const StorybookController = require('./storybook-controller');
const IOSRecorder = require('./ios-recorder');

describe('Example', () => {
  let controller;
  let recordTest;
  beforeAll(async () => {
    controller = new StorybookController('http://localhost:7007');
    await controller.start();
    recordTest = record(controller, IOSRecorder);
  });

  afterAll(async () => {
    await controller.done();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('docs:text-input', async () => {
    await recordTest(
      'react-native-bpk-component-switch',
      'docs:stateful',
      async () => {
        await expect(element(by.id('switch'))).toBeVisible();
        await expect(element(by.id('switch-themed'))).toBeVisible();

        await element(by.id('switch')).swipe('right', 'fast', 0.2);
        await sleep(500);

        await element(by.id('switch-themed')).swipe('right', 'fast', 0.2);
        await sleep(500);

        await element(by.id('switch')).swipe('left', 'fast', 0.2);
        await sleep(500);

        await element(by.id('switch-themed')).swipe('left', 'fast', 0.2);
        await sleep(500);
      },
    );
  });
});
