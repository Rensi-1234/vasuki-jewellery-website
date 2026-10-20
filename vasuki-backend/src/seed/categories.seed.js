import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const categories = [
  {
    name: 'Rings',
    slug: 'rings',
    description: 'Discover signature gold rings crafted to represent strength, identity, and timeless elegance.',
    subcategories: ['Gold Rings', 'Diamond Rings', 'Serpent Rings', 'Statement Rings', 'Engagement Rings', 'Wedding Rings', 'Men’s Rings', 'Women’s Rings'],
    sortOrder: 1,
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'Explore elegant earrings designed for everyday sophistication and special occasions.',
    subcategories: ['Stud Earrings', 'Hoop Earrings', 'Jhumka', 'Drop Earrings', 'Gold Earrings', 'Diamond Earrings', 'Chandbali', 'Statement Earrings'],
    sortOrder: 2,
  },
  {
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Discover distinctive necklaces inspired by heritage, craftsmanship, and contemporary luxury.',
    subcategories: ['Gold Necklaces', 'Diamond Necklaces', 'Bridal Necklaces', 'Choker Necklaces', 'Long Necklaces', 'Temple Necklaces', 'Statement Necklaces'],
    sortOrder: 3,
  },
  {
    name: 'Bangles',
    slug: 'bangles',
    description: 'Explore refined bangles that bring together traditional artistry and modern design.',
    subcategories: ['Gold Bangles', 'Diamond Bangles', 'Traditional Bangles', 'Daily Wear Bangles', 'Bridal Bangles', 'Kada'],
    sortOrder: 4,
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Discover versatile bracelets crafted for understated elegance and personal expression.',
    subcategories: ['Gold Bracelets', 'Diamond Bracelets', 'Chain Bracelets', 'Cuff Bracelets', 'Men’s Bracelets', 'Charm Bracelets'],
    sortOrder: 5,
  },
  {
    name: 'Pendants',
    slug: 'pendants',
    description: 'Explore meaningful pendants inspired by symbols, stories, and timeless design.',
    subcategories: ['Gold Pendants', 'Diamond Pendants', 'Serpent Pendants', 'Religious Pendants', 'Initial Pendants', 'Statement Pendants'],
    sortOrder: 6,
  },
  {
    name: 'Nose Pins',
    slug: 'nose-pins',
    description: 'Discover delicate nose jewellery with distinctive details and elegant craftsmanship.',
    subcategories: ['Gold Nose Pins', 'Diamond Nose Pins', 'Serpent Nose Pin', 'Stud Nose Pins', 'Traditional Nose Pins', 'Hoop Nose Rings'],
    sortOrder: 7,
  },
  {
    name: 'Charms',
    slug: 'charms',
    description: 'Create a personal story with distinctive charms inspired by identity and symbolism.',
    subcategories: ['Serpent Charms', 'Guardian Charms', 'VASUKI Logo Charms', 'Gold Naga Charms', 'Eternal Coil Charms', 'Personalised Charms'],
    sortOrder: 8,
  },
  {
    name: 'Mangalsutra',
    slug: 'mangalsutra',
    description: 'Discover thoughtfully designed mangalsutras that unite tradition with contemporary elegance.',
    subcategories: ['Gold Mangalsutra', 'Diamond Mangalsutra', 'Daily Wear Mangalsutra', 'Traditional Mangalsutra', 'Modern Mangalsutra'],
    sortOrder: 9,
  },
  {
    name: 'Jewellery Sets',
    slug: 'jewellery-sets',
    description: 'Explore coordinated jewellery sets designed to create a complete and harmonious look.',
    subcategories: ['Gold Jewellery Sets', 'Diamond Jewellery Sets', 'Bridal Sets', 'Necklace Sets', 'Traditional Sets', 'Lightweight Sets'],
    sortOrder: 10,
  },
  {
    name: 'Wedding Jewellery',
    slug: 'wedding-jewellery',
    description: 'Discover memorable jewellery for wedding celebrations and meaningful milestones.',
    subcategories: ['Wedding Rings', 'Wedding Necklaces', 'Wedding Earrings', 'Wedding Bangles', 'Wedding Pendants'],
    sortOrder: 11,
  },
  {
    name: 'Bridal Jewellery',
    slug: 'bridal-jewellery',
    description: 'Explore statement jewellery created for bridal celebrations and timeless wedding elegance.',
    subcategories: ['Bridal Necklaces', 'Bridal Earrings', 'Bridal Bangles', 'Bridal Jewellery Sets', 'Temple Jewellery', 'Royal Bridal Collection'],
    sortOrder: 12,
  },
  {
    name: 'Diamond Jewellery',
    slug: 'diamond-jewellery',
    description: 'Discover diamond jewellery that celebrates brilliance, craftsmanship, and lasting beauty.',
    subcategories: ['Diamond Rings', 'Diamond Earrings', 'Diamond Necklaces', 'Diamond Pendants', 'Diamond Bracelets', 'Diamond Bangles'],
    sortOrder: 13,
  },
  {
    name: 'Gold Jewellery',
    slug: 'gold-jewellery',
    description: 'Explore gold jewellery across distinctive designs, purities, and occasions.',
    subcategories: ['10K Gold', '14K Gold', '18K Gold', '22K Gold', '24K Gold', 'Traditional Gold Jewellery', 'Modern Gold Jewellery'],
    sortOrder: 14,
  },
  {
    name: 'Gemstone Jewellery',
    slug: 'gemstone-jewellery',
    description: 'Discover expressive gemstone jewellery featuring distinctive colours and refined gold craftsmanship.',
    subcategories: ['Ruby Jewellery', 'Emerald Jewellery', 'Sapphire Jewellery', 'Birthstone Jewellery', 'Gemstone Rings', 'Gemstone Pendants'],
    sortOrder: 15,
  },
  {
    name: 'Men’s Jewellery',
    slug: 'mens-jewellery',
    description: 'Explore bold, refined jewellery designed for modern men and individual expression.',
    subcategories: ['Men’s Rings', 'Men’s Chains', 'Men’s Bracelets', 'Men’s Pendants', 'Men’s Earrings', 'Men’s Gold Jewellery'],
    sortOrder: 16,
  },
  {
    name: 'Women’s Jewellery',
    slug: 'womens-jewellery',
    description: 'Discover versatile jewellery designed for everyday elegance, celebrations, and personal style.',
    subcategories: ['Women’s Rings', 'Women’s Earrings', 'Women’s Necklaces', 'Women’s Bracelets', 'Women’s Pendants', 'Women’s Gold Jewellery'],
    sortOrder: 17,
  },
  {
    name: 'Kids Jewellery',
    slug: 'kids-jewellery',
    description: 'Explore thoughtfully designed jewellery for children and special family occasions.',
    subcategories: ['Kids Earrings', 'Kids Rings', 'Kids Bracelets', 'Kids Pendants', 'Baby Bangles', 'Kids Gold Jewellery'],
    sortOrder: 18,
  },
];

async function seedCategories() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing from your .env file.');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    for (const category of categories) {
      await Category.findOneAndUpdate(
        { slug: category.slug },
        {
          $set: {
            ...category,
            isActive: true,
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log(`Successfully seeded ${categories.length} VASUKI categories.`);
  } catch (error) {
    console.error('Category seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCategories();