import { describe, it, expect, vi, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { WikipediaArticle } from '../types';

// Mock the WikiTokFeed component since we're testing App in isolation
vi.mock('../components/WikiTok/WikiTokFeed', () => ({
  default: () => <div data-testid="wiktok-feed">WikiTok Feed Mock</div>,
}));

// Mock the React Query library
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn().mockImplementation(() => ({
    defaultOptions: {},
  })),
  QueryClientProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="query-provider">{children}</div>,
}));

describe('App Component', () => {
  it('renders the WikiTok app correctly', () => {
    render(<App />);
    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
    expect(screen.getByTestId('wiktok-feed')).toBeInTheDocument();
    expect(screen.getByText('WikiTok Feed Mock')).toBeInTheDocument();
  });
});
