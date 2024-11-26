import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 創建 QueryClient 實例
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 使用 QueryClientProvider 包裹應用程式 */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>  </StrictMode>,
)
