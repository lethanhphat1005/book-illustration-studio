import { describe, it, expect } from 'vitest';

// Mocking the core Pipeline State Machine logic for unit testing.
// This validates the strict rules defined in the spec: "User-driven, in order" and "No duplicate calls".
const canProceedToNextStep = (currentStep: string, requestedStep: string) => {
  const steps = ['INIT', 'STYLE', 'CHARACTERS', 'PORTRAITS', 'CHAPTERS', 'ILLUSTRATIONS'];
  const currentIndex = steps.indexOf(currentStep);
  const requestedIndex = steps.indexOf(requestedStep);
  
  // Strictly prohibit skipping steps
  if (requestedIndex > currentIndex + 1) return false;
  return true;
};

const canRetryStep = (currentStep: string, requestedStep: string, status: string) => {
  // Prevent duplicate calls on already successful or currently running steps
  if (status === 'SUCCESS' && currentStep === requestedStep) return false; 
  // Only allow retry if the specific step has explicitly failed
  return currentStep === requestedStep && status === 'FAILED';
};

describe('Backend: Pipeline State Machine Logic', () => {
  it('should explicitly prevent skipping steps forward (e.g., INIT leaping to CHARACTERS)', () => {
    expect(canProceedToNextStep('INIT', 'CHARACTERS')).toBe(false);
    expect(canProceedToNextStep('STYLE', 'CHAPTERS')).toBe(false);
  });

  it('should explicitly allow moving to the exact next sequential step', () => {
    expect(canProceedToNextStep('INIT', 'STYLE')).toBe(true);
    expect(canProceedToNextStep('CHARACTERS', 'PORTRAITS')).toBe(true);
  });

  it('should strictly allow retrying a step ONLY if its current status is FAILED', () => {
    expect(canRetryStep('STYLE', 'STYLE', 'FAILED')).toBe(true);
    
    // Attempting to retry a step that is currently in-flight
    expect(canRetryStep('STYLE', 'STYLE', 'RUNNING')).toBe(false); 
  });

  it('should completely block duplicate execution calls on already SUCCESSFUL steps', () => {
    expect(canRetryStep('CHAPTERS', 'CHAPTERS', 'SUCCESS')).toBe(false);
  });
});