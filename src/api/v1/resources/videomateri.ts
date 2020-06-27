import { RouteDefinition } from './../../resource-route';
import {
  VideoMateri,
  VideoMateriDefinition,
} from './../../../orm/models/videomateri';
import Database, { getSequelizeInstance } from '../../../orm/database';
import { BaseObjectSchema } from '../../schema';
import * as commonRoutes from '../../common-route-definitions';
import { Video, VideoDefinition } from '../../../orm/models/video';
import sequelize from 'sequelize';
import { sum } from 'lodash';
import moment from 'moment';

const db = new Database<VideoMateri>(VideoMateriDefinition, undefined);
const videoDb = new Database<Video>(VideoDefinition, undefined);
const schema = BaseObjectSchema.videomateri;

export const index: RouteDefinition = commonRoutes.index(db);

export const show: RouteDefinition = {
  route: '/:week',
  method: 'get',
  load(req) {
    return db.model.findOne({ where: { week: req.params.week } });
  },
};

export const totalVideos: RouteDefinition = {
  route: '/:week/count',
  method: 'get',
  async load(req) {
    return {
      count: await videoDb.model.count({ where: { week: req.params.week } }),
    };
  },
};

export const totalDurationVideos: RouteDefinition = {
  route: '/:week/duration',
  method: 'get',
  async load(req) {
    const duration = await videoDb.model.sum('video_duration', {
      where: { week: req.params.week },
    });
    return {
      duration_ms: duration,
      duration_str: moment.duration(duration).humanize(),
    };
  },
};

export const create = commonRoutes.create(db, schema);
export const edit = commonRoutes.edit(db, schema);
export const destroy = commonRoutes.destroy(db);

const destLastPart = 'videomateri_thumbnails';
export const upload = commonRoutes.upload({
  db,
  dbField: 'thumbnail_url',
  destLastPart,
  routePostFix: 'thumbnail',
});
