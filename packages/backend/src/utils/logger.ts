type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogMessage {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
}

function formatLog(log: LogMessage): string {
  const prefix = `[${log.timestamp}] [${log.level.toUpperCase()}]`
  return log.data ? `${prefix} ${log.message} ${JSON.stringify(log.data)}` : `${prefix} ${log.message}`
}

function createLogEntry(level: LogLevel, message: string, data?: unknown): LogMessage {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
  }
}

export const logger = {
  info(message: string, data?: unknown): void {
    console.log(formatLog(createLogEntry('info', message, data)))
  },

  warn(message: string, data?: unknown): void {
    console.warn(formatLog(createLogEntry('warn', message, data)))
  },

  error(message: string, data?: unknown): void {
    console.error(formatLog(createLogEntry('error', message, data)))
  },

  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatLog(createLogEntry('debug', message, data)))
    }
  },
}
