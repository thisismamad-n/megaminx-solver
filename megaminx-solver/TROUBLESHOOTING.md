# Troubleshooting Guide: Vite + React Template Issues

## Problem 1: Seeing Vite + TypeScript Template Instead of React App

If you're seeing the default Vite + TypeScript template page instead of your React application, this is typically caused by TypeScript configuration issues and incorrect file setup.

### Root Causes
1. Mismatched TypeScript configurations between `tsconfig.json` and `tsconfig.node.json`
2. Incorrect file extensions in imports (`.ts` vs `.js`)
3. Vite configuration not properly set up for React
4. Missing or incorrect entry point configuration

### Solution Steps

1. **Update tsconfig.node.json**
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "allowJs": true,
    "noEmit": true
  },
  "include": ["vite.config.js", "vite.config.ts"]
}
```

2. **Update vite.config.js**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,tsx}",
      babel: {
        plugins: [],
        babelrc: false,
        configFile: false,
      },
    }),
  ],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})
```

3. **Update index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your App Name</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

4. **Clean and Reinstall**
```bash
# Navigate to project directory
cd your-project-directory

# Remove existing dependencies
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Start development server
npm run dev
```

## Problem 2: TypeScript Error - Cannot write file 'vite.config.js'

If you see this error:
```
Cannot write file 'vite.config.js' because it would overwrite input file.
```

This happens because TypeScript is trying to compile your Vite config file. To fix this:

1. Add `"noEmit": true` to `tsconfig.node.json` compilerOptions (already included in the config above)
2. Make sure your `vite.config.js` file exists and is not named `vite.config.ts`
3. If the error persists, try these additional steps:
   ```bash
   # Remove any existing compiled files
   rm -rf dist

   # Clear TypeScript cache
   rm -rf .tsbuildinfo

   # Reinstall dependencies
   npm install
   ```

### Key Points to Remember
- Always use `.jsx` extension for React components
- Make sure `main.jsx` imports point to the correct files
- TypeScript configurations should be consistent across files
- The entry point in `index.html` should match your main file location
- Use `"noEmit": true` in TypeScript configs when you don't want files to be compiled

### Common Gotchas
1. Missing or incorrect file extensions in imports
2. Conflicting TypeScript configurations
3. Incorrect entry point specification in `index.html`
4. Not cleaning and reinstalling after configuration changes
5. TypeScript trying to compile configuration files

If you encounter these issues again, following these steps in order should resolve the problem. 