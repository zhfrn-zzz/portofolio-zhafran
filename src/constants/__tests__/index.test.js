import { 
  TYPING_SPEED, 
  ERASING_SPEED, 
  PAUSE_DURATION, 
  TECH_STACK, 
  SOCIAL_LINKS, 
  WORDS_EN, 
  WORDS_ID 
} from '../constants';

describe('Constants', () => {
  test('typing speeds are valid numbers', () => {
    expect(typeof TYPING_SPEED).toBe('number');
    expect(typeof ERASING_SPEED).toBe('number');
    expect(typeof PAUSE_DURATION).toBe('number');
    
    expect(TYPING_SPEED).toBeGreaterThan(0);
    expect(ERASING_SPEED).toBeGreaterThan(0);
    expect(PAUSE_DURATION).toBeGreaterThan(0);
  });

  test('TECH_STACK contains expected technologies', () => {
    expect(Array.isArray(TECH_STACK)).toBe(true);
    expect(TECH_STACK.length).toBeGreaterThan(0);
    
    // Check if it contains some expected technologies
    expect(TECH_STACK).toContain('React');
    expect(TECH_STACK).toContain('Javascript');
  });

  test('SOCIAL_LINKS has correct structure', () => {
    expect(Array.isArray(SOCIAL_LINKS)).toBe(true);
    expect(SOCIAL_LINKS.length).toBeGreaterThan(0);
    
    SOCIAL_LINKS.forEach(link => {
      expect(link).toHaveProperty('icon');
      expect(link).toHaveProperty('link');
      expect(typeof link.link).toBe('string');
    });
  });

  test('WORDS arrays contain strings for both languages', () => {
    expect(Array.isArray(WORDS_EN)).toBe(true);
    expect(Array.isArray(WORDS_ID)).toBe(true);
    
    expect(WORDS_EN.length).toBeGreaterThan(0);
    expect(WORDS_ID.length).toBeGreaterThan(0);
    
    // Both arrays should have the same length
    expect(WORDS_EN.length).toBe(WORDS_ID.length);
    
    // All items should be strings
    WORDS_EN.forEach(word => {
      expect(typeof word).toBe('string');
    });
    
    WORDS_ID.forEach(word => {
      expect(typeof word).toBe('string');
    });
  });

  test('social links contain valid URLs or paths', () => {
    SOCIAL_LINKS.forEach(link => {
      expect(typeof link.link).toBe('string');
      expect(link.link.length).toBeGreaterThan(0);
      
      // Should be either URL or path
      const isUrl = link.link.startsWith('http') || link.link.startsWith('https');
      const isPath = link.link.startsWith('/');
      
      expect(isUrl || isPath).toBe(true);
    });
  });
});
