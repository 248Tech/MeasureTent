export const SEATING_STYLES = ['banquet', 'reception', 'theater', 'classroom'] as const;
export type SeatingStyle = (typeof SEATING_STYLES)[number];

export const TENT_TYPES = ['pole', 'frame', 'clearspan'] as const;
export type TentType = (typeof TENT_TYPES)[number];

export const ADD_ON_KEYS = ['stage', 'danceFloor', 'bar', 'catering', 'buffet'] as const;
export type AddOnKey = (typeof ADD_ON_KEYS)[number];

export interface Geometry {
  width: number;
  length: number;
}

export interface TentRecommendation {
  width: number;
  length: number;
  area: number;
}

export interface CalculationInput {
  guestCount: number;
  seatingStyle: SeatingStyle;
  tentType: TentType;
  addOns: AddOnKey[];
}

export interface CalculationResult {
  requiredSqFt: number;
  recommendedTentSize: TentRecommendation;
  tables: number;
  chairs: number;
  geometry: Geometry;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterInput extends AuthCredentials {
  tenantId?: string | undefined;
  displayName?: string | undefined;
}

export interface LoginInput extends AuthCredentials {}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ProjectInput {
  name: string;
  description?: string | null | undefined;
}

export interface ProjectRecord {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
