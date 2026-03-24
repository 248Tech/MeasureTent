import {
  ADD_ON_KEYS,
  CalculationInputSchema,
  CalculationResultSchema,
  SEATING_STYLES,
  TENT_TYPES,
  type AddOnKey,
  type CalculationInput,
  type CalculationResult,
  type SeatingStyle,
  type TentType,
} from '@measurtent/shared';

export const calculateInputSchema = CalculationInputSchema;
export const calculateResultSchema = CalculationResultSchema;

export type CalculatorInput = CalculationInput;
export type CalculatorResult = CalculationResult;
export type CalculatorSeatingStyle = SeatingStyle;
export type CalculatorTentType = TentType;
export type CalculatorAddOnKey = AddOnKey;

export const seatingStyleOptions = SEATING_STYLES;
export const tentTypeOptions = TENT_TYPES;
export const addOnOptions = ADD_ON_KEYS;

export const defaultCalculatorInput: CalculatorInput = {
  guestCount: 100,
  seatingStyle: 'banquet',
  tentType: 'frame',
  addOns: [],
};
