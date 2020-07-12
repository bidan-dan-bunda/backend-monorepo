import { GenericFunc } from './../../utils';
import { CronJob } from 'cron';
import { nanoid } from 'nanoid';

const crons: { [key: string]: CronJob } = {};

export function schedule(date: Date, cb: GenericFunc) {
  const jobId = nanoid();
  const job = new CronJob(date, cb, () => {
    deleteRunningJob(jobId);
  });
  crons[jobId] = job;
  job.start();
  return { jobId, job };
}

export function getRunningJob(key: string) {
  return crons[key];
}

export function deleteRunningJob(key: string) {
  if (crons[key]) {
    delete crons[key];
  }
}
