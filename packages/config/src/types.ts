import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export type TableShape = 'rectangular' | 'cocktail' | 'none';
export type SeatingStyleKey = 'banquet' | 'reception' | 'theater' | 'classroom';
export type TentTypeKey = 'pole' | 'frame' | 'clearspan';
export type AddOnKey = 'stage' | 'danceFloor' | 'bar' | 'catering' | 'buffet';

export interface SeatingStyleConfig {
  sqftPerPerson: number;
  tableShape: TableShape;
  seatsPerTable: number;
}

export interface TentTypeConfig {
  widthIncrements: number[];
  lengthIncrement: number;
  bufferFactor: number;
}

export interface AddOnConfig {
  sqft: number;
}

export interface TentConfig {
  seatingStyles: Record<SeatingStyleKey, SeatingStyleConfig>;
  tentTypes: Record<TentTypeKey, TentTypeConfig>;
  addOns: Record<AddOnKey, AddOnConfig>;
  chairSqft: number;
  aisleBuffer: number;
}

export type DeepPartial<T> = T extends readonly (infer U)[]
  ? readonly DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type TentConfigOverride = DeepPartial<TentConfig>;

export interface IConfigProvider {
  load(tenantId?: string): Promise<TentConfigOverride | null>;
}

export interface JsonConfigProviderOptions {
  tenantConfigDirectory?: string;
}

export class JsonConfigProvider implements IConfigProvider {
  constructor(private readonly options: JsonConfigProviderOptions = {}) {}

  async load(tenantId?: string): Promise<TentConfigOverride | null> {
    if (!tenantId || !this.options.tenantConfigDirectory) {
      return null;
    }

    const filePath = join(this.options.tenantConfigDirectory, `${tenantId}.json`);

    try {
      const raw = await readFile(filePath, 'utf8');
      return JSON.parse(raw) as TentConfigOverride;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }

      throw error;
    }
  }
}

export interface DbConfigProviderOptions {
  resolveTenantConfig: (tenantId: string) => Promise<TentConfigOverride | null>;
}

export class DbConfigProvider implements IConfigProvider {
  constructor(private readonly options: DbConfigProviderOptions) {}

  async load(tenantId?: string): Promise<TentConfigOverride | null> {
    if (!tenantId) {
      return null;
    }

    return this.options.resolveTenantConfig(tenantId);
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(isNumber);
}

function isSeatingStyleConfig(value: unknown): value is SeatingStyleConfig {
  return (
    isRecord(value) &&
    isNumber(value.sqftPerPerson) &&
    (value.tableShape === 'rectangular' || value.tableShape === 'cocktail' || value.tableShape === 'none') &&
    isNumber(value.seatsPerTable)
  );
}

function isTentTypeConfig(value: unknown): value is TentTypeConfig {
  return (
    isRecord(value) &&
    isNumberArray(value.widthIncrements) &&
    isNumber(value.lengthIncrement) &&
    isNumber(value.bufferFactor)
  );
}

function isAddOnConfig(value: unknown): value is AddOnConfig {
  return isRecord(value) && isNumber(value.sqft);
}

export function isTentConfig(value: unknown): value is TentConfig {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isRecord(value.seatingStyles) &&
    isRecord(value.tentTypes) &&
    isRecord(value.addOns) &&
    isNumber(value.chairSqft) &&
    isNumber(value.aisleBuffer) &&
    Object.values(value.seatingStyles).every(isSeatingStyleConfig) &&
    Object.values(value.tentTypes).every(isTentTypeConfig) &&
    Object.values(value.addOns).every(isAddOnConfig)
  );
}
