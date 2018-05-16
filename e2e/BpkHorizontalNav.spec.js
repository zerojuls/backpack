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

  it('docs:default', async () => {
    await recordTest(
      'react-native-bpk-component-horizontal-nav',
      'docs:default',
      async () => {
        await expect(element(by.id('nav'))).toBeVisible();
        await expect(element(by.id('nav-tab-0'))).toBeVisible();
        await sleep(500);
        await element(by.id('nav-tab-0')).tap();
      },
    );
  });
});
