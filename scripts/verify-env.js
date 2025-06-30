const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Define required environment variables
const requiredEnvVars = {
  development: [
    'REACT_APP_API_URL',
    'REACT_APP_SUPABASE_URL',
    'REACT_APP_SUPABASE_ANON_KEY',
    'REACT_APP_GOOGLE_MAPS_API_KEY'
  ],
  production: [
    'REACT_APP_API_URL',
    'REACT_APP_SUPABASE_URL',
    'REACT_APP_SUPABASE_ANON_KEY',
    'REACT_APP_GOOGLE_MAPS_API_KEY'
  ]
};

// Alternative variable names that can be used instead
const alternativeVars = {
  'REACT_APP_API_URL': ['REACT_APP_API_BASE_URL']
};

// Get current environment
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(chalk.blue(`🔍 Verifying environment variables for ${NODE_ENV} environment...`));

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
    // Create new .env file with template
    const envContent = `# API URL - Development
REACT_APP_API_URL=http://localhost:3001/api

# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Maps API Keys
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Firebase Configuration (if used)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id_here
`;
    fs.writeFileSync(envPath, envContent);
    console.log(chalk.green('✅ Created new .env file template'));
    console.log(chalk.yellow('⚠️ Please fill in the required values in the .env file'));
    process.exit(1);
  }
}

// Read .env file
console.log(chalk.blue('Reading .env file...'));
const envContent = fs.readFileSync(envPath, 'utf8');
console.log(chalk.gray('First 100 characters of .env file:'));
console.log(chalk.gray(envContent.substring(0, 100) + '...'));

// Handle different line endings (CRLF on Windows, LF on Unix)
const envLines = envContent.replace(/\r\n/g, '\n').split('\n');
const envVars = {};

// Parse .env file - improved parsing
envLines.forEach((line, index) => {
  // Skip empty lines and comments
  if (!line.trim() || line.trim().startsWith('#')) return;
  
  // Try to match key=value pattern, handling quotes if present
  const match = line.trim().match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }
    
    envVars[key] = value;
    console.log(chalk.gray(`Line ${index+1}: Found variable ${key}`));
  } else {
    console.log(chalk.yellow(`Line ${index+1}: Could not parse line: ${line}`));
  }
});

// Debug output
console.log(chalk.blue('Found environment variables:'));
console.log(Object.keys(envVars));
console.log(chalk.blue('Looking for required variables:'));
console.log(requiredEnvVars[NODE_ENV]);
console.log(chalk.blue('Alternative variables:'));
console.log(alternativeVars);

// Check for missing required variables, considering alternatives
const missingVars = requiredEnvVars[NODE_ENV].filter(key => {
  // Check if the primary variable exists
  if (envVars[key]) {
    console.log(chalk.green(`✅ Found required variable: ${key}`));
    return false;
  }
  
  // Check if any alternative variable exists
  const alternatives = alternativeVars[key] || [];
  const foundAlternative = alternatives.find(alt => envVars[alt]);
  
  if (foundAlternative) {
    console.log(chalk.green(`✅ Found alternative variable for ${key}: ${foundAlternative}`));
    return false;
  }
  
  console.log(chalk.red(`❌ Missing required variable: ${key}`));
  return true;
});

// Check for placeholder values, but allow the production backend URL as valid
const placeholderRegex = /your.*api.*key|api.*key.*here|your.*url.*here|your.*key.*here|example|placeholder/i;
const validValues = [
  'http://localhost:3001/api',
  'https://eskan-real-estate-backend.onrender.com/api'
];

const placeholderVars = Object.entries(envVars)
  .filter(([key, value]) => {
    // Check if this is a required variable or an alternative
    const isRequiredOrAlternative = requiredEnvVars[NODE_ENV].includes(key) || 
      Object.values(alternativeVars).flat().includes(key);
    
    if (!isRequiredOrAlternative) return false;
    
    // Skip validation for API_URL or API_BASE_URL if it's one of the valid values
    if ((key === 'REACT_APP_API_URL' || key === 'REACT_APP_API_BASE_URL') && 
        validValues.includes(value)) {
      return false;
    }
    
    return placeholderRegex.test(value);
  })
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.log(chalk.red(`❌ Missing required environment variables: ${missingVars.join(', ')}`));
  process.exit(1);
}

if (placeholderVars.length > 0) {
  console.log(chalk.red(`❌ Found placeholder values for: ${placeholderVars.join(', ')}`));
  console.log(chalk.yellow('\nPlease replace placeholder values with actual credentials:'));
  
  if (placeholderVars.includes('REACT_APP_GOOGLE_MAPS_API_KEY')) {
    console.log(chalk.yellow('\nTo set up Google Maps:'));
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a project or select an existing one');
    console.log('3. Enable these APIs:');
    console.log('   - Maps JavaScript API');
    console.log('   - Places API');
    console.log('   - Geocoding API');
    console.log('4. Create credentials (API key)');
    console.log('5. Copy the key (starts with AIza)');
    console.log('6. Replace placeholder value in .env with your actual API key');
  }
  
  if (placeholderVars.includes('REACT_APP_SUPABASE_URL') || 
      placeholderVars.includes('REACT_APP_SUPABASE_ANON_KEY')) {
    console.log(chalk.yellow('\nTo set up Supabase:'));
    console.log('1. Go to https://supabase.com/ and create an account');
    console.log('2. Create a new project');
    console.log('3. Go to Project Settings > API');
    console.log('4. Copy the URL and anon key');
    console.log('5. Replace placeholder values in .env with your actual credentials');
  }
  
  console.log('\nAfter updating .env:');
  console.log('1. Stop your development server');
  console.log('2. Run: npm start');
  
  process.exit(1);
}

console.log(chalk.green('✅ Environment setup looks good!'));
process.exit(0); 