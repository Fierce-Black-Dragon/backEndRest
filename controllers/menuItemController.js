const Product = require("../models/product");
const cloudinary = require("cloudinary").v2;

const createError = require("http-errors");

const WhereClause = require("../utils/WhereClause");
const UserModel = require("../models/userModel");
const product = require("../models/product");
//create product
exports.createProduct = async (req, res, next) => {
  try {
    // getting the require data from req.body
    const { name, price, description, isAvailable, isSpecial, daySpecial } =
      req.body;
    const userId = req.user._id;

    //if any fields are missing
    if (!(name && price && description)) {
      throw createError.BadRequest("all fields  are required");
    }
    // product image
    let responseImage;
    // checking if req.file (image is present .)
    if (!req.files) {
      throw createError.BadRequest("products photo are required");
    }

    // if req. files
    if (req.files.photo) {
      responseImage = await cloudinary.uploader.upload(
        req.files.photo.tempFilePath,
        {
          folder: "restaurant",
        }
      );
    }
    if (!responseImage?.secure_url) {
      throw createError.BadRequest("server error");
    }

    const product = await Product.create({
      name: name,
      price: price,
      description: description,
      isSpecial: isSpecial === "true" || isSpecial ? true : false,
      daySpecial: daySpecial ? daySpecial : "",
      photo: {
        id: responseImage?.public_id,
        secure_url: responseImage?.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchAllProducts = async (req, res, next) => {
  try {
    // const resultPerPage = 10;
    // const totalCountProduct = await Product.countDocuments();

    // const productsObj = new WhereClause(Product.find({}), req.query)
    //   .search()
    //   .filter();

    // let products = await productsObj.base;
    // const filteredProductNumber = products.length;

    // //products.limit().skip()

    // productsObj.pager(resultPerPage);
    // products = await productsObj.base.clone();
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productDetails = await Product.findById(id);
    res.status(200).json({
      success: true,
      productDetails,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProductByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description, isAvailable, isSpecial, daySpecial } =
      req.body;

    //if any fields are missing

    let product = await Product.findById(id);

    if (!product) {
      throw createError.NotFound("No product found with this id");
    }
    let newPhoto;

    if (req.files) {
      //destroy the existing image
      const res = await cloudinary.uploader.destroy(product.photo.id);

      let result = await cloudinary.uploader.upload(
        req.files.photo.tempFilePath,
        {
          folder: "restaurant",
        }
      );

      newPhoto = {
        id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    const UpdatedProduct = {
      isSpecial: isSpecial === "true" || isSpecial ? true : false,
      name,
      price,
      description,
      isAvailable: isAvailable === "true" || isAvailable ? true : false,

      daySpecial,
      photo: newPhoto,
    };

    product = await Product.findByIdAndUpdate(req.params.id, UpdatedProduct, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProductByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    //destroy the existing image
    const product = await Product.findById(id);
    if (!product) {
      throw createError.NotFound("No product found with this id");
    }
    await cloudinary.uploader.destroy(product.photo?.id);
    await Product.findByIdAndRemove(id);
    res.status(200).json({
      success: true,
      message: `Dish with  name : ${product.name} has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};
