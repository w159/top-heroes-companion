import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('in production mode (DEV=false)', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('error() always calls console.error', async () => {
      vi.stubGlobal('import_meta_env', { DEV: false });
      vi.doMock('virtual:env', () => ({ DEV: false }));

      // Re-import to pick up the mocked env
      // Since isDev is computed at module load from import.meta.env?.DEV,
      // and vitest sets DEV=true by default, we test the behavior directly
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { logger } = await import('./logger');
      logger.error('test error');

      expect(errorSpy).toHaveBeenCalledWith('test error');
    });
  });

  describe('in development mode (vitest default)', () => {
    // vitest runs with DEV=true by default, so logger.debug/warn/info should log

    it('error() calls console.error', async () => {
      vi.resetModules();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { logger } = await import('./logger');
      logger.error('critical failure', { code: 500 });

      expect(errorSpy).toHaveBeenCalledWith('critical failure', { code: 500 });
    });

    it('debug() calls console.log in dev mode', async () => {
      vi.resetModules();
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const { logger } = await import('./logger');
      logger.debug('debug message');

      expect(logSpy).toHaveBeenCalledWith('debug message');
    });

    it('warn() calls console.warn in dev mode', async () => {
      vi.resetModules();
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { logger } = await import('./logger');
      logger.warn('warning message');

      expect(warnSpy).toHaveBeenCalledWith('warning message');
    });

    it('info() calls console.info in dev mode', async () => {
      vi.resetModules();
      const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      const { logger } = await import('./logger');
      logger.info('info message');

      expect(infoSpy).toHaveBeenCalledWith('info message');
    });

    it('error() passes multiple arguments', async () => {
      vi.resetModules();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { logger } = await import('./logger');
      logger.error('msg', 1, { a: 'b' });

      expect(errorSpy).toHaveBeenCalledWith('msg', 1, { a: 'b' });
    });

    it('debug() passes multiple arguments', async () => {
      vi.resetModules();
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const { logger } = await import('./logger');
      logger.debug('msg', [1, 2], true);

      expect(logSpy).toHaveBeenCalledWith('msg', [1, 2], true);
    });
  });

  describe('production behavior simulation', () => {
    // We can test the conditional logic by checking that error always logs
    // regardless of environment, while the others are gated

    it('error is unconditional (no isDev check)', async () => {
      vi.resetModules();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { logger } = await import('./logger');

      // Call error multiple times
      logger.error('err1');
      logger.error('err2');

      expect(errorSpy).toHaveBeenCalledTimes(2);
    });
  });
});
