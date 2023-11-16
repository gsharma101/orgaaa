const { product } = require('../models/productModel');
const  multer = require('multer')


/*
module.exports.addProduct = async (req, res) => {
  const product = await Product.findOne({
    productid: req.body.productid
  });
  if (product) return res.status(400).send("Product already exists!");
  const result = await product.save();
  
  
  return res.status(200).send("Product Saved successfully!");
}
*/

//Storage

const  Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//image upload
const upload = multer({
  storage:Storage
}).single('testImage')



// Function to add a product to the database
const addProduct = async (req, res) => {
  try {
    const newProductData = req.body; // Assuming the product data is in the request body

    const existingProduct = await product.findOne({ productid: newProductData.productid });

    if (existingProduct) {
      return res.status(400).json({ success: false, message: 'Product with the same productID already exists.' });
    }

    const createdProduct = await product.create(newProductData);

    return res.status(201).json({ success: true, message: 'Product added successfully', data: createdProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while adding the product.', error });
  }
};

const getallProduct = async (req, res) => {
  try {
    const allProducts = await product.find();

    return res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while fetching products.', error });
  }
};

//product ID to be passed as a route parameter (e.g., /products/:id)
// Function to get a product by its ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming the product ID is passed as a route parameter

    const foundProduct = await product.findOne({ productid: productId });

    if (foundProduct) {
      return res.status(200).json({ success: true, data: foundProduct });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while fetching the product.', error });
  }
};

// Function to update a product by its ID
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming the product ID is passed as a route parameter
    const updatedProductData = req.body; // Assuming the updated product data is sent in the request body

    const updatedProduct = await product.findOneAndUpdate({ productid: productId }, updatedProductData, { new: true });

    if (updatedProduct) {
      return res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while updating the product.', error });
  }
};

// Function to delete a product by its ID
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming the product ID is passed as a route parameter

    const deletedProduct = await product.findOneAndRemove({ productid: productId });

    if (deletedProduct) {
      return res.status(200).json({ success: true, message: 'Product deleted successfully', data: deletedProduct });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while deleting the product.', error });
  }
};

//Function to search Product
const searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm; // Assuming the search term is passed as a query parameter
    const products = await product.find({ $or: [{ productname: new RegExp(searchTerm, 'i') }, { category: new RegExp(searchTerm, 'i') }] });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while searching for products.', error });
  }
};
//Function to get product by category
const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category; // Assuming the category is passed as a route parameter
    const products = await product.find({ category });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while fetching products by category.', error });
  }
};

//Function fetch products within a certain price range 
const getProductsByPriceRange = async (req, res) => {
  try {
    const minPrice = req.query.minPrice; // Assuming minimum price is passed as a query parameter
    const maxPrice = req.query.maxPrice; // Assuming maximum price is passed as a query parameter
    const products = await product.find({ price: { $gte: minPrice, $lte: maxPrice } });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while fetching products by price range.', error });
  }
};

//Function total number of products in the database
const getProductCount = async (req, res) => {
  try {
    const count = await product.countDocuments();
    return res.status(200).json({ success: true, data: count });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while fetching the product count.', error });
  }
};

// to retrieve featured products

/* comment: update "isFeatured" in Schemma*/

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await product.find({ isFeatured: true }); // Assuming you have an "isFeatured" field in your schema
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while fetching featured products.', error });
  }
};

// to fetch the latest products added to the database
const getNewestProducts = async (req, res) => {
  try {
    const products = await product.find().sort({ dateAdded: -1 }).limit(10); // Assuming you have a "dateAdded" field in your schema
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while fetching the newest products.', error });
  }
};


//Function to return a list of top-selling products based on sales data
const getTopSellingProducts = async (req, res) => {
  try {
    // Implement your logic to fetch top-selling products here
    // You may need to have a sales data or order history to determine top-selling products
    const products = await product.find({}).limit(10); // For example, return the top 10 products for now
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred while fetching top-selling products.', error });
  }
};



module.exports = {
  addProduct, 
  getallProduct,
  getProductById, 
  updateProduct, 
  deleteProduct, 
  searchProducts,
  getProductsByCategory,
  getProductsByPriceRange,
  getProductCount,
  getFeaturedProducts,
  getNewestProducts,
  getTopSellingProducts
};