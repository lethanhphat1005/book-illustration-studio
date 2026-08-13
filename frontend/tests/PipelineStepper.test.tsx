/** @vitest-environment jsdom */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PipelineStepper } from '../src/components/PipelineStepper'; 

describe('Frontend: PipelineStepper Component UI Flow', () => {
  it('should successfully render the pipeline stepper with running state', () => {
    // Render the stepper component in active running mode at step CHARACTERS
    const { container } = render(
      <PipelineStepper currentStep="CHARACTERS" status="RUNNING" mode="active" />
    );
    
    // Assert that the container successfully mounts elements into the virtual DOM
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('should successfully render the pipeline stepper with failed/error state', () => {
    // Render the stepper component when a failure occurs at step CHAPTERS
    const { container } = render(
      <PipelineStepper currentStep="CHAPTERS" status="FAILED" mode="active" />
    );
    
    // Assert that the component handles the error state rendering without crashing
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });
});