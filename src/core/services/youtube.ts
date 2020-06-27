import axios from 'axios';
import * as url from 'url';
import { getConfig } from '../../config';
import qs from 'querystring';
import moment from 'moment';
import urljoin from 'url-join';

export const BASE_URL = 'https://www.googleapis.com';
export const API_KEY = getConfig('GOOGLE_API_KEY');
export const API_URL = urljoin(BASE_URL, 'youtube/v3');

export function youtubeApiReq(path: string, params?: any, body?: any) {
  const fullUrl = urljoin(API_URL, 'videos');
  return axios.get(fullUrl, { params: { ...params, key: API_KEY } });
}

export async function getDuration(videoId: string) {
  try {
    const res = await youtubeApiReq('videos', {
      id: videoId,
      part: 'contentDetails',
    });
    const body = res.data;
    const item = body.items[0];
    const contentDetails = item.contentDetails;
    return moment.duration(contentDetails.duration).as('millisecond');
  } catch (err) {
    return null;
  }
}

export function extractVideoIdFromUrl(str: string) {
  const parsed = url.parse(str, true).query;
  return parsed.v;
}
