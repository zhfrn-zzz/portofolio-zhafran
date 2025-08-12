import '@testing-library/jest-dom';

// Mock untuk komponen yang menggunakan Web APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock untuk localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock untuk sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeListener: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock untuk IntersectionObserver (untuk AOS)
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock untuk window.scrollTo
global.scrollTo = jest.fn();

// Mock untuk HTMLMediaElement
window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.play = () => { 
  return Promise.resolve();
};

// Mock AOS library
jest.mock('aos', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    refresh: jest.fn(),
    refreshHard: jest.fn()
  }
}));

// Mock AOS CSS import
jest.mock('aos/dist/aos.css', () => ({}));

// Mock import.meta.env
global.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: 'http://localhost:3000',
      VITE_SUPABASE_ANON_KEY: 'test-key'
    }
  }
};

// Mock Audio constructor
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  currentTime: 0,
  duration: 10,
  volume: 1,
  muted: false,
  paused: true,
  readyState: 4
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();
window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };

// Mock untuk Audio constructor
global.Audio = jest.fn().mockImplementation(() => ({
  play: () => Promise.resolve(),
  pause: () => {},
  load: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  canPlayType: () => '',
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
  paused: true,
  ended: false,
  readyState: 0,
}));
