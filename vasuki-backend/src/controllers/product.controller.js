import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import mongoose from 'mongoose';

// Configure image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, true);
    } else {
      callback(new Error('Please upload an image file.'));
    }
  },
});

export const uploadProductImageMiddleware = upload.single('image');

// Get all products with filters and pagination
export async function getProducts(req, res, next) {
  try {
    const {
      category,
      subcategory,
      search,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(limit) || 12));

    const filter = { isActive: true };

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (subcategory) {
      filter.subcategory = {
        $regex: subcategory,
        $options: 'i',
      };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      rating: { rating: -1 },
      name: { name: 1 },
    };

    const selectedSort = sortOptions[sort] || sortOptions.newest;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(selectedSort)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
}

// Get one product by slug
export async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

// Upload an image to Cloudinary and save its URL in MongoDB
export async function uploadProductImage(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image to upload.',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const imageUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'vasuki/products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result?.secure_url) {
            return reject(new Error('Cloudinary did not return an image URL.'));
          }

          resolve(result.secure_url);
        }
      );

      stream.end(req.file.buffer);
    });

    // Add the uploaded image to the product's image gallery
    product.images = [
      ...(product.images || []),
      {
        url: imageUrl,
        alt: product.name,
      },
    ];

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product image uploaded successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}
export async function createProduct(req, res, next) {
  try {
    const {
      name,
      sku,
      category,
      categoryName,
      subcategory = '',
      price,
      purity,
      weight = 0,
      stock = 0,
      description = '',
    } = req.body;

    if (!name || !sku || !category || !categoryName ||
        price === undefined || !purity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product details.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a product photo.',
      });
    }

    const slug = `${name}-${sku}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const imageUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'vasuki/products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url) {
            return reject(new Error('Image upload failed.'));
          }
          resolve(result.secure_url);
        }
      );

      stream.end(req.file.buffer);
    });

    const product = await Product.create({
      name,
      sku,
      slug,
      category,
      categoryName,
      subcategory,
      price: Number(price),
      purity,
      weight: Number(weight),
      stock: Number(stock),
      description,
      images: [{ url: imageUrl, alt: name }],
    });

    return res.status(201).json({
      success: true,
      message: 'Product and photo saved successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}