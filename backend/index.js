require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { firstName, lastName, phone }
    }
  });
  if (error) return res.status(400).json({ message: error.message });

  // Insert into profiles table
  const userId = data.user.id;
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: userId, first_name: firstName, last_name: lastName, email, phone }]);
  if (profileError) return res.status(400).json({ message: profileError.message });

  res.status(201).json({ user: data.user, message: 'Registration successful. Please verify your email.' });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ message: error.message });

  // Fetch profile from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) return res.status(401).json({ message: profileError.message });

  // Merge auth user and profile info
  const user = { ...data.user, ...profile };

  res.json({ token: data.session.access_token, user });
});

// Middleware to get user from token
const getUserFromToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ message: 'Invalid token' });

  req.user = data.user;
  next();
};

// Add a testimonial (user must be authenticated)
app.post('/api/testimonials', getUserFromToken, async (req, res) => {
  const { text, rating } = req.body;
  const profile_id = req.user.id;
  if (!text || !rating) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const { data, error } = await supabase
    .from('testimonials')
    .insert([{ profile_id, text, rating }])
    .select()
    .single();
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  res.status(201).json(data);
});

// Get all testimonials with user name
app.get('/api/testimonials', async (req, res) => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, text, rating, created_at, profile_id, profiles ( first_name, last_name, email )')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

// In-memory store for demo purposes
const phoneCodes = {};

// Send phone verification code
app.post('/api/auth/send-phone-code', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone number is required.' });

  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  phoneCodes[phone] = code;

  // TODO: Integrate with SMS provider here
  console.log(`Verification code for ${phone}: ${code}`);

  res.json({ message: 'Verification code sent.' });
});

// Verify phone code
app.post('/api/auth/verify-phone', async (req, res) => {
  let { phone, code } = req.body;
  phone = typeof phone === 'string' ? phone.trim() : '';
  code = typeof code === 'string' ? code.trim() : '';

  if (!phone || !code) return res.status(400).json({ message: 'Phone and code are required.' });

  if (phoneCodes[phone] !== code) {
    return res.status(400).json({ message: 'Invalid verification code.' });
  }

  // Optionally, update the user's profile in Supabase to mark phone as verified
  const { data, error } = await supabase
    .from('profiles')
    .update({ phone_verified: true })
    .eq('phone', phone)
    .select()
    .maybeSingle();

  if (error) return res.status(400).json({ message: error.message });
  if (!data) return res.status(404).json({ message: 'Profile not found for this phone number.' });

  // Remove code after successful verification
  delete phoneCodes[phone];

  res.json({ message: 'Phone verified successfully.', profile: data });
});

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    const details = req.query;

    // Handle status filter
    if (details.status && details.status !== 'all') {
      query = query.eq('status', details.status);
    }

    // Filter by property_type (text)
    if (details.propertyType && details.propertyType !== '') {
      query = query.eq('property_type', details.propertyType);
    }

    // Handle price range filter
    if (details.priceRange && parseInt(details.priceRange) > 0) {
      query = query.lte('price', parseInt(details.priceRange));
    }

    // Handle bedrooms and bathrooms filters
    if (details.bedrooms && details.bedrooms !== '') {
      query = query.gte('bedrooms', parseInt(details.bedrooms));
    }
    if (details.bathrooms && details.bathrooms !== '') {
      query = query.gte('bathrooms', parseInt(details.bathrooms));
    }

    // Handle keyword search
    if (details.keyword && details.keyword.trim() !== '') {
      query = query.or(`title.ilike.%${details.keyword}%,description.ilike.%${details.keyword}%,address.ilike.%${details.keyword}%,city.ilike.%${details.keyword}%`);
    }

    // Handle feature filters (booleans)
    [
      'airConditioning', 'heating', 'internet', 'parking', 'swimmingPool', 'generator', 'waterTank',
      'security', 'balcony', 'elevator', 'solarPanels', 'garden', 'fireplace', 'bbqArea',
      'irrigation', 'storage', 'electricity', 'roadAccess'
    ].forEach(feature => {
      const dbKey = feature.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (details[feature] === 'true') {
        query = query.eq(dbKey, 'true');
      }
    });

    const { data, error } = await query;
    if (error) {
      console.error('Supabase query error:', error);
      return res.status(400).json({ message: error.message });
    }

    data.forEach(property => {
      property.features = property.features ? property.features.split(',') : [];
      // If using JSON: property.features = property.features ? JSON.parse(property.features) : [];
    });

    res.json(data);
  } catch (err) {
    console.error('Property search error:', err);
    res.status(500).json({ message: 'An error occurred while searching properties' });
  }
});

// Get single property by id
app.get('/api/properties/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, water_source')
    .eq('id', id)
    .single();
  if (error) return res.status(404).json({ message: 'Property not found' });
  res.json(data);
});

// Add a new property
app.post('/api/properties', getUserFromToken, upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const fields = req.body;
    const extraFields = JSON.parse(fields.extraFields || '{}');

    // Upload main image if provided
    let mainImageUrl = null;
    if (req.files['mainImage'] && req.files['mainImage'][0]) {
      const file = req.files['mainImage'][0];
      const path = `properties/main/${Date.now()}_${file.originalname}`;
      mainImageUrl = await uploadToSupabaseStorage(file, 'property-images', path);
    }

    // Upload additional images if provided
    let additionalImageUrls = [];
    if (req.files['additionalImages']) {
      for (const file of req.files['additionalImages']) {
        const path = `properties/additional/${Date.now()}_${file.originalname}`;
        const url = await uploadToSupabaseStorage(file, 'property-images', path);
        additionalImageUrls.push(url);
      }
    }

    // Collect features from the form (checkboxes)
    const allFeatures = [
      'airConditioning', 'heating', 'internet', 'parking', 'swimmingPool', 'generator', 'waterTank',
      'security', 'balcony', 'elevator', 'solarPanels', 'garden', 'fireplace', 'bbqArea',
      'irrigation', 'storage', 'electricity', 'roadAccess', 'waterSource'
    ];

    // Prepare property object
    const property = {
      title: fields.propertyTitle,
      property_type: fields.propertyType,
      description: fields.description,
      price: parseFloat((fields.price || '0').replace(/,/g, '')),
      governorate: fields.governorate,
      city: fields.city,
      address: fields.address,
      bedrooms: fields.bedrooms ? parseInt(fields.bedrooms) : null,
      bathrooms: fields.bathrooms ? parseInt(fields.bathrooms) : null,
      parking_spaces: fields.parkingSpaces ? parseInt(fields.parkingSpaces) : null,
      area: fields.area ? parseInt(fields.area) : (fields.propertyType === 'Farm' ? (extraFields.farmArea ? parseInt(extraFields.farmArea) : null) : null),
      year_built: fields.yearBuilt ? parseInt(fields.yearBuilt) : null,
      furnishing_status: fields.furnishingStatus,
      floor: fields.floor ? parseInt(fields.floor) : null,
      garden_area: fields.gardenArea ? parseInt(fields.gardenArea) : null,
      shop_front_width: fields.shopFrontWidth ? parseFloat(fields.shopFrontWidth) : null,
      storage_area: fields.storageArea ? parseFloat(fields.storageArea) : null,
      land_type: fields.landType || null,
      zoning: fields.zoning || null,
      meeting_rooms: fields.meetingRooms ? parseInt(fields.meetingRooms) : null,
      office_layout: fields.officeLayout || null,
      units: fields.units ? parseInt(fields.units) : null,
      elevators: fields.elevators ? parseInt(fields.elevators) : null,
      plot_size: fields.plotSize ? parseInt(fields.plotSize) : null,
      ceiling_height: fields.ceilingHeight ? parseFloat(fields.ceilingHeight) : null,
      loading_docks: fields.loadingDocks ? parseInt(fields.loadingDocks) : null,
      farm_area: fields.farmArea ? parseInt(fields.farmArea) : null,
      water_source: fields.waterSource || null,
      crop_types: fields.cropTypes || null,
      // Insert each feature as text
      air_conditioning: fields.airConditioning ? String(fields.airConditioning) : null,
      heating: fields.heating ? String(fields.heating) : null,
      internet: fields.internet ? String(fields.internet) : null,
      parking: fields.parking ? String(fields.parking) : null,
      swimming_pool: fields.swimmingPool ? String(fields.swimmingPool) : null,
      generator: fields.generator ? String(fields.generator) : null,
      water_tank: fields.waterTank ? String(fields.waterTank) : null,
      security: fields.security ? String(fields.security) : null,
      balcony: fields.balcony ? String(fields.balcony) : null,
      elevator: fields.elevator ? String(fields.elevator) : null,
      solar_panels: fields.solarPanels ? String(fields.solarPanels) : null,
      garden: fields.garden ? String(fields.garden) : null,
      fireplace: fields.fireplace ? String(fields.fireplace) : null,
      bbq_area: fields.bbqArea ? String(fields.bbqArea) : null,
      irrigation: fields.irrigation ? String(fields.irrigation) : null,
      storage: fields.storage ? String(fields.storage) : null,
      electricity: fields.electricity ? String(fields.electricity) : null,
      road_access: fields.roadAccess ? String(fields.roadAccess) : null,
      main_image: mainImageUrl || null,
      additional_images: additionalImageUrls.length > 0 ? additionalImageUrls : null,
      profile_id: req.user.id,
      status: fields.status || 'pending',
    };

    // Remove undefined or NaN values (optional, for clean insert)
    Object.keys(property).forEach(key => {
      if (
        property[key] === undefined ||
        (typeof property[key] === 'number' && isNaN(property[key]))
      ) {
        property[key] = null;
      }
    });

    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert property error:', error);
      return res.status(400).json({ message: 'Failed to save property to database', error: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error('Property upload error:', err);
    res.status(500).json({ message: err.message || 'Failed to submit property.', error: err.stack });
  }
});

// Agent application endpoint
app.post('/api/agent-applications', getUserFromToken, upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'cvResume', maxCount: 1 }
]), async (req, res) => {
  try {
    const fields = req.body;
    const profile_id = req.user.id;

    // Handle file uploads
    let profilePhotoUrl = '';
    if (req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
      const file = req.files['profilePhoto'][0];
      const path = `agents/profile_photos/${Date.now()}_${file.originalname}`;
      profilePhotoUrl = await uploadToSupabaseStorage(file, 'property-images', path);
    }

    let cvResumeUrl = '';
    if (req.files['cvResume'] && req.files['cvResume'][0]) {
      const file = req.files['cvResume'][0];
      const path = `agents/cv_resumes/${Date.now()}_${file.originalname}`;
      cvResumeUrl = await uploadToSupabaseStorage(file, 'property-images', path);
    }

    const { data, error } = await supabase
      .from('agent_applications')
      .insert([{
        profile_id,
        full_name: fields.fullName,
        email: fields.email,
        phone: fields.phone,
        specialty: fields.specialty,
        experience: fields.experience,
        about_me: fields.aboutMe,
        profile_photo: profilePhotoUrl,
        cv_resume: cvResumeUrl,
        facebook: fields.facebook,
        twitter: fields.twitter,
        instagram: fields.instagram,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json(data);
  } catch (err) {
    console.error('Agent application error:', err);
    res.status(500).json({ message: err.message || 'Failed to submit application.', error: err });
  }
});

// Get all accepted agents
app.get('/api/agents', async (req, res) => {
  let query = supabase
    .from('agent_applications')
    .select(`
      id,
      profile_id,
      profile_photo,
      specialty,
      experience,
      about_me,
      facebook,
      twitter,
      instagram,
      phone,
      status,
      full_name,
      profiles (
        first_name,
        last_name
      )
    `)
    .eq('status', 'accepted')
    .order('created_at', { ascending: false });

  // Filtering
  const { name, specialty, experience } = req.query;
  if (name) {
    query = query.ilike('full_name', `%${name}%`);
  }
  if (specialty) {
    query = query.eq('specialty', specialty);
  }
  if (experience) {
    query = query.eq('experience', experience);
  }

  const { data, error } = await query;
  if (error) return res.status(400).json({ message: error.message });
  res.json(data);
});

// Utility function to upload files to Supabase Storage and return the public URL
async function uploadToSupabaseStorage(file, bucket, path) {
  try {
    console.log('Uploading file:', file.originalname, 'size:', file.size, 'to bucket:', bucket, 'path:', path);
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(path, file.buffer, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      throw new Error('Failed to upload file to storage');
    }

    const { data: urlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(path);

    if (!urlData || !urlData.publicUrl) {
      console.error('Error getting public URL: No URL returned');
      throw new Error('Failed to get public URL');
    }

    return urlData.publicUrl;
  } catch (err) {
    console.error('uploadToSupabaseStorage error:', err);
    throw err;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});