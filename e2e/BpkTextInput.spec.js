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
      'react-native-bpk-component-text-input',
      'docs:text-inputs',
      async () => {
        await expect(element(by.id('empty-input'))).toBeVisible();
        await element(by.id('empty-input')).typeText('Design offsite');
        await sleep(500);
      },
    );
  });
});
