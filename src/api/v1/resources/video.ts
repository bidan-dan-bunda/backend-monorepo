import { User } from './../../../orm/models/user';
import { isAdmin } from './../../../auth/middleware';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { RouteDefinition } from './../../resource-route';
import Database from '../../../orm/database';
import { BaseObjectSchema } from '../../schema';
import * as commonRoutes from '../../common-route-definitions';
import { Video, VideoDefinition } from '../../../orm/models/video';
import {
  extractVideoIdFromUrl,
  getDuration,
} from '../../../core/services/youtube';
import moment from 'moment';
import { countPages } from '../../common';

const db = new Database<Video>(VideoDefinition, undefined);
const schema = BaseObjectSchema.video;

export const index: RouteDefinition = {
  middleware: (req, res, next) => {
    const { week } = req.query;
    const opts = {
      ...res.locals.page,
    };
    if (week) {
      opts.where = {
        week,
      };
    }
    res.locals.dbOptions = opts;
    return countPages(db, opts)(req, res, next);
  },
  async load(req, locals, res) {
    const videos = await db.load({
      ...locals.dbOptions,
      raw: true,
      include: [{ model: User, attributes: ['name'], as: 'author' }],
    });
    return videos.map((video) => ({
      ...video,
      yt_video_id: video.url && extractVideoIdFromUrl(video.url),
      video_duration_str:
        video.video_duration &&
        moment.duration(video.video_duration).humanize(),
    }));
  },
};

export const show = commonRoutes.show(db, undefined, {
  async load(req) {
    const video = await db.model.findByPk(req.params.id, {
      raw: true,
      include: [{ model: User, attributes: ['name'], as: 'author' }],
    });
    if (video) {
      const duration = video.video_duration;
      return {
        ...video,
        yt_video_id: video.url && extractVideoIdFromUrl(video.url),
        video_duration_str: duration
          ? moment.duration(duration).humanize()
          : null,
      };
    }
    return null;
  },
});

function isValidUrl(req: Request, res: Response, next: NextFunction) {
  const videoUrl = req.body.url;
  const videoId = extractVideoIdFromUrl(videoUrl);
  if (videoId && !Array.isArray(videoId)) {
    res.locals.videoId = videoId;
    return next();
  }
  return next(createError(400, { message: 'Invalid URL format' }));
}

export const create = commonRoutes.create(db, schema, undefined, {
  middleware: [isAdmin, isValidUrl],
  create: undefined,
  handler(req, res, next) {
    getDuration(res.locals.videoId).then((duration) => {
      db.model.create({ ...req.body, video_duration: duration });
    });
    return res.status(202).json({ message: 'Accepted' });
  },
});

export const edit = commonRoutes.edit(db, schema, undefined, {
  middleware: [isAdmin, isValidUrl],
  handler(req, res, next) {
    getDuration(res.locals.videoId).then((duration) => {
      db.model.update(
        { ...req.body, video_duration: duration },
        { where: { id: req.params.id } }
      );
    });
    return res.status(202).json({ message: 'Accepted' });
  },
});
export const destroy = commonRoutes.destroy(db);

const destLastPart = 'video_thumbnails';
export const upload = commonRoutes.upload({
  db,
  dbField: 'thumbnail_url',
  destLastPart,
  routePostFix: 'thumbnail',
});
