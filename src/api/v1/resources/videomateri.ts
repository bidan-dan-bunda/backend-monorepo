import { RouteDefinition } from './../../resource-route';
import {
  VideoMateri,
  VideoMateriDefinition,
} from './../../../orm/models/videomateri';
import Database from '../../../orm/database';
import { BaseObjectSchema } from '../../schema';
import * as commonRoutes from '../../common-route-definitions';

const db = new Database<VideoMateri>(VideoMateriDefinition, undefined);
const schema = BaseObjectSchema.videomateri;

export const index: RouteDefinition = {
  load(req, locals, res) {
    const { week } = req.query;
    const opts = { ...locals.page };
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

const destLastPart = 'videomateri_thumbnails';
export const upload = commonRoutes.upload({
  db,
  dbField: 'thumbnail_url',
  destLastPart,
  routePostFix: 'thumbnail',
});
