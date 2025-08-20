import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder

jest.mock('@/auth/pkce', () => ({
  hasValidSession: () => false,
  loadTokens: () => null,
  isExpired: () => true,
  beginLogin: jest.fn(),
  handleRedirectCallback: jest.fn().mockResolvedValue(true),
  saveTokens: jest.fn(),
  logout: jest.fn(),
}))

jest.mock('@/api/auth', () => ({
  auth: {
    me: jest.fn().mockResolvedValue({ id: 'test-user' }),
    login: jest.fn(),
    logout: jest.fn(),
    handleRedirect: jest.fn().mockResolvedValue(true),
  },
}))


