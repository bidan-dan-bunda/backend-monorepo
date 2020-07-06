import { BaseObjectSchema } from './../../schema';
import { User, UserDefinition } from './../../../orm/models/user';
import { ResourcePage } from './../../middleware';
import { Patient, PatientDefinition } from './../../../orm/models/patient';
import * as commonRoutes from '../../common-route-definitions';
import Database from '../../../orm/database';
import { RouteDefinition } from '../../resource-route';
import { toArray } from '../../../utils';
import { authorize, isUserType } from '../../../auth/middleware';
import { generateMedicalRecordId } from '../../../core/medical-record-id';

const db = new Database<Patient>(PatientDefinition);
const userDb = new Database<User>(UserDefinition);
const schema = BaseObjectSchema.patient;

const isBidan = authorize(isUserType('b'));

export const index = commonRoutes.index(
  db,
  (req) => ({
    raw: true,
    include: [
      {
        model: User,
        where: { pus_id: req.session?.user.pus_id },
        attributes: ['name', 'profile_image'],
      },
    ],
  }),
  function (props: RouteDefinition): RouteDefinition {
    const middleware = toArray(props.middleware) || [];
    const additionalMiddleware = isBidan;
    return {
      middleware: [...middleware, additionalMiddleware],
    };
  }
);

export const showPatientsWithEmptyNote = commonRoutes.index(
  db,
  (req) => ({
    raw: true,
    where: { patient_note: null },
    include: [
      {
        model: User,
        where: { pus_id: req.session?.user.pus_id },
        attributes: ['name', 'profile_image', 'id'],
        required: false,
        right: true,
      },
    ],
  }),
  {
    route: '/empty',
  }
);

export const show = commonRoutes.show(db, (req) => ({
  raw: true,
  include: [
    {
      model: User,
      where: { pus_id: req.session?.user.pus_id },
      attributes: ['name', 'profile_image'],
    },
  ],
}));

export const create = commonRoutes.create(db, schema, undefined, {
  middleware: isBidan,
  create(req) {
    return db.create({
      ...req.body,
      medical_record_id: generateMedicalRecordId(),
    });
  },
});

export const edit = commonRoutes.edit(
  db,
  schema,
  (req) => ({ where: { user_id: req.params.id } }),
  {
    middleware: isBidan,
  }
);

export const destroy = commonRoutes.destroy(
  db,
  (req) => ({ where: { user_id: req.params.id } }),
  {
    middleware: isBidan,
  }
);
