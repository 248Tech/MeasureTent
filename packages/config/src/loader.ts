import defaults from './defaults.json';
import {
  DbConfigProvider,
  JsonConfigProvider,
  type TentConfig,
  type TentConfigOverride,
  isRecord,
  isTentConfig,
} from './types';

const DEFAULT_CONFIG = normalizeDefaults(defaults);

export async function loadConfig(tenantId?: string): Promise<TentConfig> {
  const tenantConfigDirectory = process.env.TENT_CONFIG_DIR;
  const provider = new JsonConfigProvider(
    tenantConfigDirectory ? { tenantConfigDirectory } : {},
  );

  const override = await provider.load(tenantId);
  return mergeAndValidate(DEFAULT_CONFIG, override);
}

export { DbConfigProvider, JsonConfigProvider } from './types';

function normalizeDefaults(value: unknown): TentConfig {
  if (!isTentConfig(value)) {
    throw new Error('Invalid default tent config');
  }

  return value;
}

function mergeAndValidate(base: TentConfig, override: TentConfigOverride | null): TentConfig {
  const merged = deepMerge(base, override);

  if (!isTentConfig(merged)) {
    throw new Error('Resolved tent config is invalid');
  }

  return merged;
}

function deepMerge(base: unknown, override: unknown): unknown {
  if (override === null || override === undefined) {
    return base;
  }

  if (Array.isArray(base) || Array.isArray(override)) {
    return override;
  }

  if (isRecord(base) && isRecord(override)) {
    const result: Record<string, unknown> = { ...base };

    for (const [key, value] of Object.entries(override)) {
      const current = result[key];
      result[key] = current === undefined ? value : deepMerge(current, value);
    }

    return result;
  }

  return override;
}
