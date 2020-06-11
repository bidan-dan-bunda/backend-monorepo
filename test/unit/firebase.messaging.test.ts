import { sendMessage } from '../../src/core/firebase/messaging';

describe('firebase cloud messaging', () => {
  test('test', () => {
    sendMessage().then(console.log).catch(console.error);
  });
});
