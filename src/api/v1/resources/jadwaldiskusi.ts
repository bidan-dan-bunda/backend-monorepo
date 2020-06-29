import { User } from './../../../orm/models/user';
import {
  DeviceToken,
  DeviceTokenDefinition,
} from './../../../orm/models/devicetokens';
import { BaseObjectSchema } from './../../schema';
import {
  JadwalDiskusi,
  JadwalDiskusiDefinition,
} from './../../../orm/models/jadwaldiskusi';
import Database, { getSequelizeInstance } from '../../../orm/database';
import * as commonRoutes from '../../common-route-definitions';
import { authorize, isUserType } from '../../../auth/middleware';
import {
  schedule,
  getRunningJob,
  deleteRunningJob,
} from '../../../core/services/scheduler';
import { notify } from '../../../core/services/notifier';
import moment from 'moment';
import { CronTime } from 'cron';

const db = new Database<JadwalDiskusi>(JadwalDiskusiDefinition);
const deviceTokenDb = new Database<DeviceToken>(DeviceTokenDefinition);
const schema = BaseObjectSchema.jadwaldiskusi;
const isBidan = authorize(isUserType('b'));

async function getDeviceTokens(pusId: number) {
  return (
    await deviceTokenDb.model.findAll({
      attributes: ['token'],
      include: [
        {
          model: User,
          where: { pus_id: pusId },
          attributes: ['pus_id'],
          as: 'user',
        },
      ],
    })
  ).map((dt) => dt.token);
}

export const index = commonRoutes.index(
  db,
  (req) => ({
    where: {
      bid_id: req.session?.user.id,
    },
  }),
  {
    middleware: isBidan,
  }
);

export const show = commonRoutes.show(db, undefined, { middleware: isBidan });
export const create = commonRoutes.create(db, schema, undefined, {
  middleware: isBidan,
  async create(req) {
    const userId = req.session?.user.id;
    const deviceTokens = await getDeviceTokens(req.session?.user.pus_id);
    const title = req.body.title;
    const eventDate = new Date(req.body.timestamp);
    const { jobId: eventScheduleJobId } = schedule(eventDate, () => {
      notify(deviceTokens, {
        title: `Diskusi untuk ${title} dimulai`,
        // body: 'Jangan lupa untuk mengisi diskusinya ya, Bu',
      });
    });
    let reminder_job_id = '';
    if (req.body.reminder_timestamp) {
      const diff = Math.abs(req.body.timestamp - req.body.reminder_timestamp);
      const reminderDate = new Date(req.body.reminder_timestamp);
      const durationHumanized = moment.duration(diff).locale('id').humanize();
      const { jobId, job } = schedule(reminderDate, () => {
        notify(deviceTokens, {
          title: `Diskusi untuk ${title} dimulai ${durationHumanized} lagi`,
          // body: 'Jangan lupa untuk mengisi diskusinya ya, Bu',
        });
      });
      reminder_job_id = jobId;
    }
    return await db.model.create({
      ...req.body,
      bid_id: userId,
      job_id: eventScheduleJobId,
      reminder_job_id,
    });
  },
});

export const edit = commonRoutes.edit(db, schema, undefined, {
  middleware: isBidan,
  async edit(req) {
    const jd = await db.model.findByPk(req.params.id, {
      attributes: ['id', 'job_id', 'reminder_job_id', 'title'],
    });
    let job_id = '';
    let reminder_job_id = '';
    if (jd && jd.job_id) {
      const deviceTokens = await getDeviceTokens(req.session?.user.pus_id);
      if (req.body.timestamp) {
        let job = getRunningJob(jd.job_id);
        job.stop();
        const date = new Date(req.body.timestamp);
        let jobId = '';
        ({ job, jobId } = schedule(date, () => {
          notify(deviceTokens, {
            title: `Diskusi untuk ${jd.title} dimulai`,
            // body: 'Jangan lupa untuk mengisi diskusinya ya, Bu',
          });
        }));
        job_id = jobId;
      }
      if (req.body.reminder_timestamp) {
        const date = new Date(req.body.reminder_timestamp);
        if (jd.reminder_job_id) {
          const diff = Math.abs(
            req.body.timestamp - req.body.reminder_timestamp
          );
          const durationHumanized = moment
            .duration(diff)
            .locale('id')
            .humanize();
          let job = getRunningJob(jd.reminder_job_id);
          job.stop();
          let jobId = '';
          ({ job, jobId } = schedule(date, () =>
            notify(deviceTokens, {
              title: `Diskusi untuk ${jd.title} dimulai ${durationHumanized} lagi`,
              // body: 'Jangan lupa untuk mengisi diskusinya ya, Bu',
            })
          ));
          reminder_job_id = jobId;
        } else {
        }
      }
    }
    return db.update(
      { ...req.body, reminder_job_id, job_id },
      { where: { id: req.params.id } }
    );
  },
});

export const destroy = commonRoutes.destroy(db, undefined, {
  middleware: isBidan,
  async destroy(req) {
    const schedule = await db.model.findByPk(req.params.id, {
      attributes: ['id', 'job_id', 'reminder_job_id'],
    });
    if (schedule && schedule.job_id) {
      const job = getRunningJob(schedule.job_id);
      job.stop();
      deleteRunningJob(schedule.job_id);

      if (schedule?.reminder_job_id) {
        const job = getRunningJob(schedule.reminder_job_id);
        job.stop();
        deleteRunningJob(schedule.reminder_job_id);
      }

      return await db.destroy({ where: { id: req.params.id } });
    }
    return null;
  },
});
