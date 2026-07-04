const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Lead = require('./models/Lead');

// Load environment variables
dotenv.config();

const sampleLeads = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    source: 'Website Contact Form',
    status: 'New',
    notes: 'Inquired about enterprise pricing structure.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    source: 'Google Ads',
    status: 'Contacted',
    notes: 'Had a discovery call. Requested a follow-up demo next Tuesday.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    source: 'Referral',
    status: 'Converted',
    notes: 'Signed contract for onboarding. Project starts next month.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
  },
  {
    name: 'Diana Prince',
    email: 'diana@example.com',
    source: 'Social Media',
    status: 'New',
    notes: 'Interested in retail plans. Responded to summer campaign ad.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    source: 'Website Contact Form',
    status: 'Contacted',
    notes: 'Emailed custom configuration inquiries. Sent tech docs.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini-crm');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Admin.deleteMany({});
    await Lead.deleteMany({});
    console.log('Existing data cleared.');

    // Seed Admin
    const adminEmail = 'admin@crm.com';
    const adminPassword = 'admin123';
    await Admin.create({
      email: adminEmail,
      password: adminPassword // Hashed automatically by pre-save hook in Admin model
    });
    console.log(`Admin user seeded: ${adminEmail} / ${adminPassword}`);

    // Seed Leads
    await Lead.insertMany(sampleLeads);
    console.log(`${sampleLeads.length} sample leads seeded successfully.`);

    console.log('Database seeding process completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding database error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
