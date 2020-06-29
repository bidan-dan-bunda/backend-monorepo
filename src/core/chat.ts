import { User, UserDefinition } from './../orm/models/user';
import { ChatMember, ChatMemberDefinition } from './../orm/models/chatmember';
import { ChatRoom, ChatRoomDefinition } from './../orm/models/chatrooms';
import { ChatTopic, ChatTopicDefinition } from './../orm/models/chattopic';
import { messaging } from './firebase/admin';
import {
  DeviceToken,
  DeviceTokenDefinition,
} from './../orm/models/devicetokens';
import { Chat, ChatDefinition } from './../orm/models/chat';
import Database, { getSequelizeInstance } from '../orm/database';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import { reportError } from '../error';
import { logFirebaseResponse } from '../utils';
import { log } from '../logger';

const deviceTokenDb = new Database<DeviceToken>(DeviceTokenDefinition);
const chatDb = new Database<Chat>(ChatDefinition);
const chatTopicDb = new Database<ChatTopic>(ChatTopicDefinition);
const chatRoomDb = new Database<ChatRoom>(ChatRoomDefinition);
const chatMemberDb = new Database<ChatMember>(ChatMemberDefinition);
const userDb = new Database<User>(UserDefinition);

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
          timestamp: (~~(Date.now() / 1000)).toString(),
          message,
          type: 'konsultasi',
        },
        tokens: tokens as string[],
      })
      .then(logFirebaseResponse)
      .catch(reportError);
  }
  return tokensExist;
}

export function createTopic() {
  return nanoid(15);
}

export async function storeTopicId(pusId: number, topic: string) {
  return await chatTopicDb.create({ topic, pus_id: pusId });
}

export function subscribeDevicesToTopic(tokens: string[], topic: string) {
  return messaging
    .subscribeToTopic(tokens, topic)
    .then((res) => logFirebaseResponse(res, 'Subscribed to devices'))
    .catch(reportError);
}

interface GroupChatData {
  senderId: number;
  senderName: string;
  pusId: number;
  message: string;
}

export function sendToGroup(topic: string, data: GroupChatData) {
  return messaging
    .send({
      notification: {
        title: data.senderId.toString(),
        body: data.message,
      },
      data: {
        senderId: data.senderId.toString(),
        senderName: data.senderName,
        timestamp: (~~(Date.now() / 1000)).toString(),
        pusId: data.pusId.toString(),
        message: data.message,
        type: 'group',
      },
      topic,
    })
    .then((id) => log(`Message with ${id} sent`, ['fcm']))
    .catch(reportError);
}

export async function sendNotSentMessagesToId(
  userId: number,
  deviceToken: string
) {
  const user = (await userDb.model.findOne({ where: { id: userId } })) as User;
  const messages = (
    await chatDb.model.findAll({
      where: { target_id: userId, is_sent: false },
    })
  ).map((message) => ({
    message: message.message,
    senderId: message.sender_id,
    targetId: message.target_id,
    senderName: user.name,
  }));
  for (const message of messages) {
    sendMessageToTarget(message);
  }
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

export async function getChatRoomId() {
  return nanoid();
}

export async function getChatRoom(
  participantId1: number,
  participantId2: number
) {
  const chatMember = await chatMemberDb.model.findOne({
    where: {
      user_id: participantId1,
    },
    include: [
      { model: ChatMember, where: { user_id: participantId2 }, as: 'parent' },
    ],
    raw: true,
  });
  if (chatMember) {
    const roomId = chatMember.chatroom_id;
    const chatRoom = await chatRoomDb.model.findOne({ where: { id: roomId } });
    return chatRoom;
  }
  return null;
}

export async function createChatRoom(
  participantId1: number,
  participantId2: number
) {
  const chatRoom = await chatRoomDb.create({
    id: await getChatRoomId(),
  });
  const chatMember = [
    chatMemberDb.model.create({
      user_id: participantId1,
      chatroom_id: chatRoom.id,
    }),
    chatMemberDb.model.create({
      user_id: participantId2,
      chatroom_id: chatRoom.id,
    }),
  ];
  await Promise.all(chatMember);
  return chatRoom;
}
