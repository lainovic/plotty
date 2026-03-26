import { LogcatEntry } from "../../value-objects/LogcatEntry";

interface LogcatFormat {
  regex: RegExp;
  createFromMatch(match: RegExpMatchArray): LogcatEntry;
}

export class LogcatEntryParser {
  private static readonly logcatFormats: LogcatFormat[] = [
    // YYYY-MM-DD HH:MM:SS.SSS +HHMM PID TID I TAG: message
    {
      regex:
        /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\.\d{3})\s+([+-]\d{4})\s+(\d+)\s+(\d+)\s+([VDIWEF])\s+([^:]+):\s+(.*)$/,
      createFromMatch: ([
        ,
        date,
        time,
        timezone,
        pid,
        tid,
        level,
        tag,
        message,
      ]) =>
        LogcatEntryParser.createLogcatEntry(
          date,
          time,
          pid,
          tid,
          level,
          tag,
          message,
          timezone
        ),
    },

    // YYYY-MM-DD HH:MM:SS.mmm+TZ LEVEL TAG: MESSAGE
    {
      regex:
        /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\.\d{3})\+(\d{4})\s+([VDIWEF])\s+([^:]+):\s+(.*)$/,
      createFromMatch: ([, date, time, timezone, level, tag, message]) =>
        LogcatEntryParser.createLogcatEntry(
          date,
          time,
          "0",
          "0",
          level,
          tag,
          message,
          "+" + timezone
        ),
    },

    // MM-DD HH:MM:SS.SSS PID TID I TAG: message
    {
      regex:
        /^(\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\.\d{3})\s+(\d+)\s+(\d+)\s+([VDIWEF])\s+([^:]+):\s+(.*)$/,
      createFromMatch: ([, date, time, pid, tid, level, tag, message]) =>
        LogcatEntryParser.createLogcatEntry(
          date,
          time,
          pid,
          tid,
          level,
          tag,
          message
        ),
    },

    // HH:MM:SS.SSS [thread] INFO TAG - message
    {
      regex:
        /^(\d{2}:\d{2}:\d{2}\.\d{3})\s+\[([^\]]+)\]\s+([A-Z]+)\s+([^-]+)\s+-\s+(.*)$/,
      createFromMatch: ([, time, , level, tag, message]) =>
        LogcatEntryParser.createLogcatEntry(
          "",
          time,
          "0",
          "0",
          level,
          tag,
          message
        ),
    },
  ];

  static parse(line: string): LogcatEntry | null {
    if (!line.trim()) return null;

    for (const fmt of LogcatEntryParser.logcatFormats) {
      const match = line.match(fmt.regex);
      if (match) return fmt.createFromMatch(match);
    }

    return null;
  }

  private static createLogcatEntry(
    date: string,
    time: string,
    pid: string,
    tid: string,
    level: string,
    tag: string,
    message: string,
    timezone?: string
  ): LogcatEntry {
    const timestamp = LogcatEntryParser.toUtcTimestamp(date, time, timezone);
    return new LogcatEntry(
      level,
      tag,
      parseInt(pid),
      parseInt(tid),
      timestamp,
      message
    );
  }

  private static toUtcTimestamp(
    date: string,
    time: string,
    timezone?: string
  ): number {
    if (date.length == 0 || time.length == 0) return -1;

    const result = new Date();
    if (date.includes("-")) {
      const [month, day] = date.split("-").map(Number);
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const [sec, ms] = seconds.toString().split(".").map(Number);

      result.setMonth(month - 1); // JavaScript months are 0-based
      result.setDate(day);
      result.setHours(hours, minutes, sec, ms);

      // Adjust for timezone, if provided.
      if (timezone) {
        const tzOffset = parseInt(timezone);
        const localOffset = result.getTimezoneOffset();
        result.setMinutes(result.getMinutes() + localOffset - tzOffset);
      }
    } else {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const [sec, ms] = seconds.toString().split(".").map(Number);

      result.setHours(hours, minutes, sec, ms);
    }

    return result.getTime();
  }
}
