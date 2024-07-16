import { errorLog, warnLog } from './log';

export const systemError = (warnMsg: string, err: Error): void => {
  warnLog(warnMsg);
  errorLog(err);
  process.exit(1);
};
