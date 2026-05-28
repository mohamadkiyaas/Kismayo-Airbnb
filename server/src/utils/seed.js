import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { Booking } from '../models/Booking.js';
import { Review } from '../models/Review.js';
import { logger } from './logger.js';

const PHOTO_POOL = [
  'https://images.unsplash.com/photo-1501183638710-841dd1904471',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
  'https://images.unsplash.com/photo-1518733057094-95b53143d2a7',
  'https://images.unsplash.com/photo-1551763073-22d5cce4cd5b',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
  'https://images.unsplash.com/photo-1571508601891-ca5e7a713859',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c',
];

const pick = (arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
};

const imageSet = () =>
  pick(PHOTO_POOL, 5).map((url) => ({ url: `${url}?auto=format&fit=crop&w=1600&q=80`, publicId: '' }));

const LISTINGS = [
  {
    title: 'Beachfront Villa on Lido Beach',
    description:
      'Wake up to the sound of waves in this private 4-bedroom villa right on Lido Beach. Private pool, sea views, and direct beach access.',
    type: 'villa',
    category: 'beachfront',
    location: {
      country: 'Somalia',
      city: 'Kismayo',
      address: 'Lido Beach Road',
      coordinates: { type: 'Point', coordinates: [42.5454, -0.3582] },
    },
    pricePerNight: 220,
    bedrooms: 4,
    beds: 5,
    baths: 3,
    maxGuests: 8,
    amenities: ['wifi', 'kitchen', 'parking', 'pool', 'ac', 'beach-access', 'tv'],
  },
  {
    title: 'Downtown Kismayo Loft',
    description:
      'Modern loft in the heart of Kismayo with workspace, fast WiFi, and walking distance to the market.',
    type: 'apartment',
    category: 'city',
    location: {
      country: 'Somalia',
      city: 'Kismayo',
      address: 'Central Market District',
      coordinates: { type: 'Point', coordinates: [42.5482, -0.3576] },
    },
    pricePerNight: 75,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    amenities: ['wifi', 'kitchen', 'ac', 'workspace', 'tv'],
  },
  {
    title: 'Jubba River Eco Cabin',
    description:
      'Off-grid eco cabin overlooking the Jubba River. Wake up to birdsong and enjoy guided river tours.',
    type: 'cabin',
    category: 'countryside',
    location: {
      country: 'Somalia',
      city: 'Jamame',
      address: 'Jubba River Bank',
      coordinates: { type: 'Point', coordinates: [42.7468, 0.0703] },
    },
    pricePerNight: 95,
    bedrooms: 2,
    beds: 3,
    baths: 1,
    maxGuests: 4,
    amenities: ['wifi', 'kitchen', 'parking', 'pet-friendly'],
  },
  {
    title: 'Mogadishu Seaside Suite',
    description:
      'Beautiful seaside suite with panoramic Indian Ocean views in Mogadishu. Includes daily breakfast.',
    type: 'apartment',
    category: 'amazing-views',
    location: {
      country: 'Somalia',
      city: 'Mogadishu',
      address: 'Liido Beach',
      coordinates: { type: 'Point', coordinates: [45.3182, 2.0469] },
    },
    pricePerNight: 140,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    maxGuests: 4,
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'breakfast', 'gym'],
  },
  {
    title: 'Lamu Style Stone House',
    description:
      'Traditional Swahili stone house with rooftop terrace overlooking the old town and harbor.',
    type: 'house',
    category: 'tropical',
    location: {
      country: 'Kenya',
      city: 'Lamu',
      address: 'Lamu Old Town',
      coordinates: { type: 'Point', coordinates: [40.9019, -2.2696] },
    },
    pricePerNight: 110,
    bedrooms: 3,
    beds: 3,
    baths: 2,
    maxGuests: 6,
    amenities: ['wifi', 'kitchen', 'ac', 'breakfast', 'beach-access'],
  },
  {
    title: 'Nairobi Skyline Penthouse',
    description:
      'Stunning penthouse with skyline views, infinity pool, and premium furnishings in Westlands.',
    type: 'apartment',
    category: 'luxury',
    location: {
      country: 'Kenya',
      city: 'Nairobi',
      address: 'Westlands',
      coordinates: { type: 'Point', coordinates: [36.8108, -1.2674] },
    },
    pricePerNight: 260,
    bedrooms: 3,
    beds: 4,
    baths: 3,
    maxGuests: 6,
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'gym', 'parking', 'tv', 'workspace'],
  },
  {
    title: 'Diani Beach Bungalow',
    description: 'Charming bungalow steps from the white sands of Diani Beach.',
    type: 'house',
    category: 'beachfront',
    location: {
      country: 'Kenya',
      city: 'Diani',
      address: 'Diani Beach Road',
      coordinates: { type: 'Point', coordinates: [39.5783, -4.3175] },
    },
    pricePerNight: 130,
    bedrooms: 2,
    beds: 3,
    baths: 2,
    maxGuests: 4,
    amenities: ['wifi', 'kitchen', 'ac', 'beach-access', 'parking', 'pool'],
  },
  {
    title: 'Zanzibar Island Retreat',
    description: 'Private retreat on the white-sand coast of Zanzibar with personal chef option.',
    type: 'villa',
    category: 'islands',
    location: {
      country: 'Tanzania',
      city: 'Zanzibar',
      address: 'Nungwi',
      coordinates: { type: 'Point', coordinates: [39.2964, -5.7234] },
    },
    pricePerNight: 320,
    bedrooms: 5,
    beds: 6,
    baths: 4,
    maxGuests: 10,
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'beach-access', 'breakfast', 'parking'],
  },
  {
    title: 'Addis Ababa Mountain Lodge',
    description: 'Mountain lodge with cool breezes, fireplace, and panoramic city views.',
    type: 'cabin',
    category: 'amazing-views',
    location: {
      country: 'Ethiopia',
      city: 'Addis Ababa',
      address: 'Entoto Hills',
      coordinates: { type: 'Point', coordinates: [38.7613, 9.0307] },
    },
    pricePerNight: 85,
    bedrooms: 2,
    beds: 2,
    baths: 1,
    maxGuests: 4,
    amenities: ['wifi', 'kitchen', 'heating', 'parking'],
  },
  {
    title: 'Dubai Marina High-Rise',
    description: 'Sleek high-rise apartment overlooking Dubai Marina with floor-to-ceiling windows.',
    type: 'apartment',
    category: 'city',
    location: {
      country: 'United Arab Emirates',
      city: 'Dubai',
      address: 'Marina Walk',
      coordinates: { type: 'Point', coordinates: [55.1404, 25.0763] },
    },
    pricePerNight: 280,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    maxGuests: 4,
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'gym', 'tv', 'workspace'],
  },
  {
    title: 'Cape Town Mountain View Studio',
    description: 'Cozy studio at the foot of Table Mountain, walking distance to the V&A Waterfront.',
    type: 'apartment',
    category: 'city',
    location: {
      country: 'South Africa',
      city: 'Cape Town',
      address: 'Gardens',
      coordinates: { type: 'Point', coordinates: [18.4178, -33.9333] },
    },
    pricePerNight: 95,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    amenities: ['wifi', 'kitchen', 'workspace', 'tv'],
  },
  {
    title: 'Sahara Desert Glamping Tent',
    description: 'Luxury glamping under the stars in the Sahara, with camel rides and Berber dinner.',
    type: 'room',
    category: 'desert',
    location: {
      country: 'Morocco',
      city: 'Merzouga',
      address: 'Erg Chebbi Dunes',
      coordinates: { type: 'Point', coordinates: [-4.0186, 31.0992] },
    },
    pricePerNight: 180,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    maxGuests: 2,
    amenities: ['breakfast', 'heating'],
  },
];

const run = async () => {
  await connectDB();

  logger.info('Clearing old data...');
  await Promise.all([
    User.deleteMany({}),
    Listing.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
  ]);

  logger.info('Creating users...');
  const passwordHash = await User.hashPassword('password123');
  const adminHash = await User.hashPassword('admin1234');

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@kismayo-airbnb.com',
    passwordHash: adminHash,
    role: 'admin',
  });

  const hosts = await User.insertMany([
    { name: 'Amina Host', email: 'amina@example.com', passwordHash, role: 'host' },
    { name: 'Yusuf Host', email: 'yusuf@example.com', passwordHash, role: 'host' },
    { name: 'Layla Host', email: 'layla@example.com', passwordHash, role: 'host' },
  ]);

  const guest = await User.create({
    name: 'Guest User',
    email: 'guest@example.com',
    passwordHash,
    role: 'guest',
  });

  logger.info('Creating listings...');
  const listingsToInsert = LISTINGS.map((l, i) => ({
    ...l,
    host: hosts[i % hosts.length]._id,
    images: imageSet(),
    rating: 4 + Math.random(),
    reviewCount: Math.floor(Math.random() * 25),
  }));
  const listings = await Listing.insertMany(listingsToInsert);

  logger.info(`Seeded ${listings.length} listings, ${hosts.length} hosts + 1 guest + 1 admin.`);
  logger.info('Login as:');
  logger.info('  admin@kismayo-airbnb.com / admin1234');
  logger.info('  amina@example.com / password123 (host)');
  logger.info('  guest@example.com / password123 (guest)');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  logger.error(err);
  process.exit(1);
});
