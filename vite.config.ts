import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
  base: './',
  build: { rollupOptions: { input: { home: 'index.html', about: 'about.html', contact: 'contact.html', skills: 'skills.html', certifications: 'certifications.html', project: 'project.html' } } },
  plugins: [tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
})
