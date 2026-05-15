import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Ambiente Node.js
    environment: 'node',

    include: ["__tests__/**/*.test.ts"],
    
    // Configuração de cobertura
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: "./coverage",
      include: ["src/controllers/auth/**", "src/middlewares/**", "src/routes/**", "src/services/**", "src/utils/**", "src/app.ts"],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.ts',
        '**/types/',
        '**/*.d.ts',
        'src/templates/',
        'src/certificates/',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
      clean: false,
      reportOnFailure: true,
    },

    // Configuração de globals (describe, it, expect sem imports)
    globals: true,

    // Exclude padrões
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'build',
      'coverage',
    ],

    // Timeout padrão
    testTimeout: 10000,

    // Hook timeout
    hookTimeout: 10000,

    // Configuração de alias de path (mesmo do tsconfig.json)
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
