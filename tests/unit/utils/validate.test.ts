import { describe, it, expect } from 'bun:test';
import { z } from 'zod';
import validate from '../../../src/libs/utils/validate';
import { ValidationError } from '../../../src/libs/utils/error';

describe('[Unit test] - validate - utility function', () => {
  it('should return parsed data when validation succeeds', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().min(0),
    });

    const inputData = { name: 'John Doe', age: 30 };
    const result = validate(inputData, schema);

    expect(result).toEqual(inputData);
  });

  it('should throw ValidationError when validation fails', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().min(0),
    });

    const inputData = { name: 'John Doe', age: -5 };

    expect(() => validate(inputData, schema)).toThrow(ValidationError);
    expect(() => validate(inputData, schema)).toThrow('Validation Error');
  });
});
