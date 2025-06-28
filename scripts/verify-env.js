const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // You may need to install this package

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log(chalk.yellow('⚠️ No .env file found'));
  
  // Create .env file from example if it exists
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log(chalk.green('✅ Created .env file from .env.example'));
  } else {
    // Create new .env file
    const envContent = `# Frontend Google Maps API key (used by React)
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Backend Google Maps API key (used by Express)
GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Other environment variables...
`;
    fs.writeFileSync(envPath, envContent);
    console.log(chalk.green('✅ Created new .env file'));
  }
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

// Check for placeholder values
const placeholderRegex = /your.*api.*key|api.*key.*here/i;
const hasPlaceholders = envLines.some(line => {
  const [key, value] = line.split('=');
  return value && placeholderRegex.test(value);
});

if (hasPlaceholders) {
  console.log(chalk.red('❌ Found placeholder API keys in .env file'));
  console.log(chalk.yellow('\nTo set up Google Maps:'));
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a project or select an existing one');
  console.log('3. Enable these APIs:');
  console.log('   - Maps JavaScript API');
  console.log('   - Places API');
  console.log('   - Geocoding API');
  console.log('4. Create credentials (API key)');
  console.log('5. Copy the key (starts with AIza)');
  console.log('6. Replace placeholder values in .env with your actual API key');
  console.log('\nAfter updating .env:');
  console.log('1. Stop your development server');
  console.log('2. Run: npm run build');
  console.log('3. Start your server: npm start\n');
  process.exit(1);
}

console.log(chalk.green('✅ Environment setup looks good'));
process.exit(0); 