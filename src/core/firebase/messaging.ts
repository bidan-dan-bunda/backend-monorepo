import { messaging } from './admin';

export function sendMessage() {
  return messaging.send({
    notification: {
      title: 'Test title',
      body: 'Test body',
    },
    data: {
      sender: 'admin',
      message: 'test',
    },
    webpush: {},
    token:
      'd_ZvOzVMMFY:APA91bEyXbo4FLipv43TunPdTGx11uPW_drZ1_g1XJpCboNAaGYbVGJfmeKchXcAfzAZamiVdujDwTwntJ0uFZ9yfY8GCe4OZnK7xr17E6yU6amSyh4joJsYjSahXdEhaz9p4JsaKM6Y',
  });
}
