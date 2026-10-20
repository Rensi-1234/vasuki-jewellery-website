import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: '',
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    subcategory: {
      type: String,
      default: '',
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    purity: {
      type: String,
      enum: ['10K', '14K', '18K', '22K', '24K'],
      required: true,
    },

    weight: {
      type: Number,
      min: 0,
      default: 0,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    reviews: {
      type: Number,
      min: 0,
      default: 0,
    },

    stock: {
      type: Number,
      min: 0,
      default: 0,
    },

    collection: {
      type: String,
      default: 'VASUKI Signature',
      trim: true,
    },

    badges: {
      type: [String],
      default: [],
    },

    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          alt: {
            type: String,
            default: '',
          },
        },
      ],
      default: [],
    },

    metal: {
      type: String,
      default: 'Yellow Gold',
    },

    gender: {
      type: String,
      enum: ['Men', 'Women', 'Kids', 'Unisex'],
      default: 'Women',
    },

    occasion: {
      type: String,
      default: 'Everyday',
    },

    purities: {
      type: [String],
      default: ['10K', '14K', '18K', '22K', '24K'],
    },

    availability: {
      type: String,
      enum: ['In stock', 'Out of stock', 'Made to order'],
      default: 'In stock',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: 'text',
  description: 'text',
  sku: 'text',
});

const Product = mongoose.model('Product', productSchema);

export default Product;