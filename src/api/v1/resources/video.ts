import { RouteDefinition } from './../../resource-route';
import Database from '../../../orm/database';
import { BaseObjectSchema } from '../../schema';
import * as commonRoutes from '../../common-route-definitions';
import { Video, VideoDefinition } from '../../../orm/models/video';
import { countPages } from '../../common';

const db = new Database<Video>(VideoDefinition, undefined);
const schema = BaseObjectSchema.video;

export const index: RouteDefinition = {
  async load(req, locals, res) {
    const { week } = req.query;
    const opts = { ...locals.page };
    await countPages(db, locals.page.limit, locals, {
      where: week ? { week: week as any } : undefined,
    });
    if (week) {
      opts.where = {
        week,
      };
    }
    return db.load(opts);
  },
};

export const show = commonRoutes.show(db);
export const create = commonRoutes.create(db, schema);
export const edit = commonRoutes.edit(db, schema);
export const destroy = commonRoutes.destroy(db);

const destLastPart = 'video_thumbnails';
export const upload = commonRoutes.upload({
  db,
  dbField: 'thumbnail_url',
  destLastPart,
  routePostFix: 'thumbnail',
});
