import { describe, it, expect, beforeEach } from 'vitest';
import { Contract } from '../../contracts/managed/scholarship/contract/index.js';
import { createCircuitContext, createConstructorContext } from '@midnight-ntwrk/compact-runtime';

describe('Scholarship Pure Unit Tests', () => {
  let contract: Contract<any>;
  let constructResult: any;
  const dummyAddress = '00'.repeat(32);

  beforeEach(() => {
    contract = new Contract({});
    const constructCtx = createConstructorContext(new Uint8Array(32)); // this expects uint8array
    constructResult = contract.initialState(constructCtx, 800n, 250000n);
  });

  it('Verifies eligibility successfully for a qualifying student', () => {
    const circuitCtx = createCircuitContext(
      dummyAddress,
      constructResult.currentZswapLocalState,
      constructResult.currentContractState,
      constructResult.currentPrivateState
    );
    const result = contract.circuits.verify_eligibility(circuitCtx, 910n, 180000n);
    expect(result).toBeDefined();
  });

  it('Fails verification for a student with GPA too low', () => {
    const circuitCtx = createCircuitContext(
      dummyAddress,
      constructResult.currentZswapLocalState,
      constructResult.currentContractState,
      constructResult.currentPrivateState
    );
    expect(() => contract.circuits.verify_eligibility(circuitCtx, 750n, 180000n)).toThrow();
  });

  it('Fails verification for a student with income too high', () => {
    const circuitCtx = createCircuitContext(
      dummyAddress,
      constructResult.currentZswapLocalState,
      constructResult.currentContractState,
      constructResult.currentPrivateState
    );
    expect(() => contract.circuits.verify_eligibility(circuitCtx, 910n, 300000n)).toThrow();
  });

  it('Verifies eligibility successfully when exactly at the threshold edge-case', () => {
    const circuitCtx = createCircuitContext(
      dummyAddress,
      constructResult.currentZswapLocalState,
      constructResult.currentContractState,
      constructResult.currentPrivateState
    );
    // Exact thresholds: 800 GPA, 250000 Income
    const result = contract.circuits.verify_eligibility(circuitCtx, 800n, 250000n);
    expect(result).toBeDefined(); 
  });

  it('Fails verification when both GPA is too low and income is too high', () => {
    const circuitCtx = createCircuitContext(
      dummyAddress,
      constructResult.currentZswapLocalState,
      constructResult.currentContractState,
      constructResult.currentPrivateState
    );
    expect(() => contract.circuits.verify_eligibility(circuitCtx, 600n, 400000n)).toThrow();
  });
});
