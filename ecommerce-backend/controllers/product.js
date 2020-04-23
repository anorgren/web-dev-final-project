const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandlers');

// middleware to find by Id, makes product available in the request
exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = product;
        next();
    })
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    // keep image type extensions
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not upload."
            })
        }

        const { name, description, price, category, quantity, shipping } = fields;
        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "Missing required field; all fields required."
            })
        }

        let product = req.product;
        product = _.extend(product, fields);
        // must send photo from client side with photo tag
        if (files.photo) {
            if (files.photo.size > 3000000) {
                return res.status(400).json({
                    error: "Image should be less than 3mb in size"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.status(200).json(result);
        })
    });
};

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, isDelete) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.status(200).json({
            message: "Successfully deleted product."
        })
    })
};

exports.read = (req, res) => {
    // Take out photo to increase request speed, have a separate method for getting product photo
    if (req.product) {
        req.product.photo = undefined;
        return res.status(200).json(req.product);
    }
};

// gets photo, acts as middleware
exports.photo = (req, res, next) => {
    if (req.product.photo && req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    // keep image type extensions
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not upload."
            })
        }

        const { name, description, price, category, quantity, shipping } = fields;
        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "Missing required field; all fields required."
            })
        }

        let product = new Product(fields);
        // must send photo from client side with photo tag
        if (files.photo) {
            if (files.photo.size > 3000000) {
                return res.status(400).json({
                    error: "Image should be less than 3mb in size."
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.status(200).json(result);
        })
    });
};

exports.list =  (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sort = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 12;

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sort, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found.'
                })
            }
            res.status(200).json(products)
        })
};

// Find products with same category as given product
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 4;

    Product.find({_id: {$ne: req.product}, category: req.product.category})
        .select("-photo")
        .limit(limit)
        .populate('category', '_id name')
        .exec( (err, products) => {
            if (err) {
                return res.status(400).json({
                    message: "No products found."
                })
            }
            res.status(200).json(products)
        })
};

// Find all categories present across all products
exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                message: "No categories found."
            })
        }
         res.status(200).json(categories)
    })
};

// List products by fit within various parameters (price range, order, sort,
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                // products available
                size: data.length,
                data
            });
        });
};

