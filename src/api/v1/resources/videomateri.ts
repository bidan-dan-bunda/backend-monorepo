import {
  VideoMateri,
  VideoMateriDefinition,
} from './../../../orm/models/videomateri';
import Database from '../../../orm/database';
import { RequestBodyObjectSchema } from '../../schema';
import * as commonRoutes from '../../common-route-definitions';

const db = new Database<VideoMateri>(VideoMateriDefinition, undefined);
const schema = RequestBodyObjectSchema.videomateri;

export const index = commonRoutes.index(db);
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
