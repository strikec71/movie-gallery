import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Плейсхолдеры, чтобы модули с import.meta.env не падали в Vitest
vi.stubEnv('VITE_KINOPOISK_API_KEY', 'vitest-kinopoisk-placeholder');
vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'vitest-anon-key');
vi.stubEnv('VITE_GROQ_API_KEY', 'vitest-groq-placeholder');
