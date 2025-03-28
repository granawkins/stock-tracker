import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WikiTokFeed from './components/WikiTok/WikiTokFeed';
import TopBar from './components/TopBar/TopBar';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <TopBar />
        <WikiTokFeed />
      </div>
    </QueryClientProvider>
  );
}

export default App;
