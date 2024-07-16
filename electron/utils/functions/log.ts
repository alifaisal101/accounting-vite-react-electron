import { logColors } from '../objects/log-colors';

export const warnLog = (log?: unknown): void => {
  console.warn(logColors.FgYellow + 'Warn: ' + log, logColors.Reset);
};

export const errorLog = (log?: unknown): void => {
  console.error(logColors.FgRed + log, logColors.Reset);
};

export const successLog = (log?: unknown): void => {
  console.log(logColors.FgGreen + log, logColors.Reset);
};
