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
                return res.status(400).json({
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
        return res.status(200).json({
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
                    error: "Image should be less than 3mb in size"
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