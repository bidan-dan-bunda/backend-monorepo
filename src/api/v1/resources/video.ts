import Database from '../../../orm/database';
import { BaseObjectSchema } from '../../schema';
import * as commonRoutes from '../../common-route-definitions';
import { Video, VideoDefinition } from '../../../orm/models/video';

const db = new Database<Video>(VideoDefinition, undefined);
const schema = BaseObjectSchema.video;

export const index = commonRoutes.index(db);
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
