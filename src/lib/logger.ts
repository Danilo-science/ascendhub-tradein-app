import { toast } from '@/hooks/use-toast';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  source?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;

  private formatMessage(level: LogLevel, message: string, source?: string): string {
    const levelStr = LogLevel[level];
    const timestamp = new Date().toISOString();
    const sourceStr = source ? `[${source}]` : '';
    return `${timestamp} ${levelStr} ${sourceStr} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private logToConsole(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data);
        break;
    }
  }

  private showUserNotification(level: LogLevel, message: string): void {
    // Solo mostrar notificaciones al usuario para errores y warnings importantes
    if (level >= LogLevel.ERROR) {
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } else if (level === LogLevel.WARN && !this.isDevelopment) {
      toast({
        variant: "default",
        title: "Atención",
        description: message,
      });
    }
  }

  debug(message: string, data?: any, source?: string): void {
    this.logToConsole(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any, source?: string): void {
    this.logToConsole(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any, source?: string): void {
    this.logToConsole(LogLevel.WARN, message, data);
    this.showUserNotification(LogLevel.WARN, message);
  }

  error(message: string, error?: Error | any, source?: string): void {
    const errorData = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error;

    this.logToConsole(LogLevel.ERROR, message, errorData);
    this.showUserNotification(LogLevel.ERROR, message);
  }

  success(message: string, data?: any): void {
    this.info(message, data);
    toast({
      variant: "default",
      title: "Éxito",
      description: message,
    });
  }

  // Métodos de conveniencia para casos específicos
  authError(message: string, error?: any): void {
    this.error(`[Auth] ${message}`, error, 'Auth');
  }

  pwaInfo(message: string, data?: any): void {
    this.info(`[PWA] ${message}`, data, 'PWA');
  }

  guardianInfo(message: string, data?: any): void {
    this.info(`[Guardian] ${message}`, data, 'TaskGuardian');
  }

  paymentError(message: string, error?: any): void {
    this.error(`[Payment] ${message}`, error, 'Payment');
  }

  uploadError(message: string, error?: any): void {
    this.error(`[Upload] ${message}`, error, 'Upload');
  }
}

// Instancia singleton del logger
export const logger = new Logger();

// Funciones de conveniencia para compatibilidad con console.*
export const log = {
  debug: (message: string, data?: any) => logger.debug(message, data),
  info: (message: string, data?: any) => logger.info(message, data),
  warn: (message: string, data?: any) => logger.warn(message, data),
  error: (message: string, error?: any) => logger.error(message, error),
  success: (message: string, data?: any) => logger.success(message, data),
};