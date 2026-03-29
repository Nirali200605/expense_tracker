const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing CSS files...\n');

const cssFiles = {
    'src/index.css': `/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f5f7fa;
    color: #333;
    line-height: 1.6;
}

#root {
    min-height: 100vh;
}`,

    'src/styles/global.css': `/* Global styles will be added here */`,

    'src/styles/pages.css': `/* Page styles will be added here */`
};

// Create directories
fs.mkdirSync('src/styles', { recursive: true });

// Create CSS files
Object.entries(cssFiles).forEach(([filePath, content]) => {
    const fullPath = path.join(__dirname, filePath);
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Created: ${filePath}`);
});

console.log('\n🎉 All CSS files created successfully!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm start');
console.log('2. If errors persist, restart the development server');
console.log('3. Press Ctrl+C and run: npm start again');