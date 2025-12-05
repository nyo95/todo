import { describe, it, expect } from 'vitest';
import { signUpSchema, signInSchema, createProjectSchema } from './validations';

describe('Validation Schemas', () => {
  describe('signUpSchema', () => {
  it('should validate a correct sign-up object', () => {
    const data = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };
    const result = signUpSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should fail if the email is invalid', () => {
    const data = {
      email: 'invalid-email',
      password: 'password123',
    };
    const result = signUpSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should fail if the password is too short', () => {
    const data = {
      email: 'test@example.com',
      password: '123',
    };
    const result = signUpSchema.safeParse(data);
    expect(result.success).toBe(false);
    });
  });

  describe('signInSchema', () => {
    it('should validate a correct sign-in object', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = signInSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if the email is invalid', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
      };
      const result = signInSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should fail if the password is empty', () => {
      const data = {
        email: 'test@example.com',
        password: '',
      };
      const result = signInSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('createProjectSchema', () => {
    it('should validate a correct project object', () => {
      const data = {
        name: 'My Project',
        description: 'This is a test project',
        color: '#ff0000',
        isFavorite: true,
      };
      const result = createProjectSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail if the project name is empty', () => {
      const data = {
        name: '',
      };
      const result = createProjectSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
