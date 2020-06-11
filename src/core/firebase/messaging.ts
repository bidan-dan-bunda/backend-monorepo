import { messaging } from './admin';

export function sendMessage() {
  return messaging.send({
    notification: {
      title: 'Bro apa kabar',
      body: 'Baik kan? ngewe kau',
    },
    data: {
      userId: '10',
      message: 'hello bro',
    },
    webpush: {},
    token:
      'eavsSdLJWqbl1yehCEi7kY:APA91bGDZFahgcyZzEEtrlNSUZAlcaK3BsD1NNG7RXkzZSBuC8QBW_ZE5s9RbVJzAncCdihMeN8FL2DfvPDhXKzgY5I93Dg5vZkmL5IpiCLxrHKK5csFYmCrvfJpLrRdVXlSDnZ2KD9W',
  });
}
