import { User } from './../../../orm/models/user';
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
import moment from 'moment';

const db = new Database<VideoMateri>(VideoMateriDefinition, undefined);
const videoDb = new Database<Video>(VideoDefinition, undefined);
const schema = BaseObjectSchema.videomateri;

export const index: RouteDefinition = commonRoutes.index(db, undefined, {
  async load(req) {
    const sequelizeInstance = getSequelizeInstance();
    const t = await sequelizeInstance.transaction();
    await sequelizeInstance.query('SET SQL_MODE=""', { transaction: t });
    const videoMateri = await db.model.findAll({
      transaction: t,
      raw: true,
      include: [
        { model: User, attributes: ['name'], as: 'author', required: true },
        {
          model: Video,
          as: 'videos',
          attributes: [
            [
              sequelize.fn(
                'COALESCE',
                sequelize.fn('COUNT', sequelize.col('videos.id')),
                0
              ),
              'total',
            ],
            [
              sequelize.fn(
                'COALESCE',
                sequelize.fn('SUM', sequelize.col('video_duration')),
                0
              ),
              'duration',
            ],
          ],
          required: true,
        },
      ],
    });
    await t.commit();
    if (videoMateri.length) {
      return videoMateri.map((model) => {
        const duration = (model as any)['videos.duration'];
        return {
          ...model,
          ['videos.duration_str']:
            duration && moment.duration(duration).humanize(),
        };
      });
    }
    return null;
  },
});

export const show: RouteDefinition = {
  route: '/:week',
  method: 'get',
  async load(req) {
    const videoMateri = await db.model.findOne({
      where: { week: req.params.week },
      raw: true,
      group: 'week',
      include: [
        { model: User, attributes: ['name'], as: 'author', required: true },
        {
          model: Video,
          as: 'videos',
          attributes: [
            [
              sequelize.fn(
                'COALESCE',
                sequelize.fn('COUNT', sequelize.col('videos.id')),
                0
              ),
              'total',
            ],
            [
              sequelize.fn(
                'COALESCE',
                sequelize.fn('SUM', sequelize.col('video_duration')),
                0
              ),
              'duration',
            ],
          ],
          required: true,
        },
      ],
    });
    if (videoMateri) {
      const duration = (videoMateri as any)['videos.duration'];
      return {
        ...videoMateri,
        ['videos.duration_str']:
          duration && moment.duration(duration).humanize(),
      };
    }
    return null;
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
