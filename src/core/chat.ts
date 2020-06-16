import { ChatTopic, ChatTopicDefinition } from './../orm/models/chattopic';
import { messaging } from './firebase/admin';
import {
  DeviceToken,
  DeviceTokenDefinition,
} from './../orm/models/devicetokens';
import { Chat, ChatDefinition, ChatFields } from './../orm/models/chat';
import Database from '../orm/database';
import { nanoid } from 'nanoid';

const deviceTokenDb = new Database<DeviceToken>(DeviceTokenDefinition);
const chatDb = new Database<Chat>(ChatDefinition);
const chatTopicDb = new Database<ChatTopic>(ChatTopicDefinition);

export async function isUserDeviceTokenExist(userId: number) {
  const tokens = await deviceTokenDb.load({ where: { user_id: userId } });
  if (tokens.length) {
    return tokens.map((token) => token.getDataValue('token'));
  }
  return null;
}

interface ChatData {
  senderId: number;
  targetId: number;
  message: string;
}

export async function storeChatToDB(chatData: any) {
  return await chatDb.create(chatData);
}

export async function sendMessageToTarget(chatData: ChatData) {
  const { senderId, message, targetId } = chatData;
  let tokensExist = false;
  let tokens: string[] | null;
  if ((tokens = await isUserDeviceTokenExist(targetId))) {
    tokensExist = true;
    messaging
      .sendMulticast({
        data: {
          senderId: senderId.toString(),
          message,
        },
        tokens: tokens as string[],
      })
      .catch((err) => {});
  }
  const chat = await storeChatToDB({
    sender_id: senderId,
    target_id: targetId,
    message,
    is_sent: tokensExist,
  });
  return chat;
}

export function createTopic() {
  return nanoid();
}

export async function storeTopicId(pusId: number, topic: string) {
  return await chatTopicDb.create({ topic, pus_id: pusId });
}

export function subscribeDevicesToTopic(tokens: string[], topic: string) {
  return messaging.subscribeToTopic(tokens, topic);
}
