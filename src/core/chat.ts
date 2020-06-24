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
  senderName: string;
  targetId: number;
  message: string;
}

export async function storeChatToDB(chatData: any) {
  return await chatDb.create(chatData);
}

export async function sendMessageToTarget(chatData: ChatData) {
  const { senderId, message, targetId, senderName } = chatData;
  let tokensExist = false;
  let tokens: string[] | null;
  if ((tokens = await isUserDeviceTokenExist(targetId))) {
    tokensExist = true;
    messaging
      .sendMulticast({
        notification: {
          title: senderId.toString(),
          body: message,
        },
        data: {
          senderId: senderId.toString(),
          senderName,
          timestamp: new Date().getTime().toString(),
          message,
          type: 'konsultasi',
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
  return nanoid(15);
}

export async function storeTopicId(pusId: number, topic: string) {
  return await chatTopicDb.create({ topic, pus_id: pusId });
}

export function subscribeDevicesToTopic(tokens: string[], topic: string) {
  return messaging.subscribeToTopic(tokens, topic);
}

interface GroupChatData {
  senderId: number;
  senderName: string;
  pusId: number;
  message: string;
}

export function sendToGroup(topic: string, data: GroupChatData) {
  return messaging.send({
    notification: {
      title: data.senderId.toString(),
      body: data.message,
    },
    data: {
      senderId: data.senderId.toString(),
      senderName: data.senderName,
      timestamp: new Date().getTime().toString(),
      pusId: data.pusId.toString(),
      message: data.message,
      type: 'group',
    },
    topic,
  });
}

export async function setUserDeviceToSubscribePuskesmasChatTopic(
  pusId: number,
  deviceToken: string
) {
  const topic = await chatTopicDb.model.findOne({ where: { pus_id: pusId } });
  if (topic) {
    return subscribeDevicesToTopic([deviceToken], topic.topic);
  }
  return null;
}
