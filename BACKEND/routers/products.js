const { Category } = require('../models/category');
const Product = require('../models/product');
const express =  require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');//helps in uploading files for the backend to our server
const FILE_TYPE_MAP ={
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'

};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if(isValid){
            uploadError = null;
        };
      cb(null, 'public/uploads')//will be returned if there is an error in uploading the files
    },
    filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileName = file.originalname.split('').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`)//return the number of the day
    }
  });

 const uploadOption = multer({ storage: storage });


router.get(`/`, async (req, res) => {
    //localhost:7000/api/v1/products?categories=2342342,5555
let filter = {};
    if (req.query.categories){
         filter = {cateory: req.query.categories.split(',')};
    }


    const productList = await Product.find(filter).populate('category');

    if(!productList){
     res.status(500).json({success: false});
    };
     res.send(productList);
 });
  

 
router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(!product){
     res.status(500).json({success: false});
    };
     res.send(product);
 });
 
 
 router.post(`/`,uploadOption.single('image'), async (req, res) => { 
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');

    const file = req.file; //request won't pass when there is no file
    if(!file) return res.status(400).send('No file');

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
    const product = new Product({ 
    name: req.body.name,
    descrription: req.descrription,
    richDescription: req.body,richDescription,
    image: `${basePath}${fileName}`, //"http://localhost:7000/public/upload/image-2323232"
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
 
  });
 

  router.put('/:id', async (req,res)=>{
  if(!mongoose.isValidObjectId(req.params.id)){
    res.status(400).send('Invalid Product Id');
  }

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            descrription: req.descrription,
            richDescription: req.body,richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        
        {new: true}
    );
    if(!product)
    return res.status(500).send('The product can not be updated');

    res.send(product);       

 }); 



  product = await product.save();


  if(!product)
  return res.status(500).send('The product could not be created');

  res.send(product);
 
 });


 router.delete('/:Id', (req, res)=>{
    Product.findByIdAndRemove(req.params.Id).then(product=>{
        if(product){
            return res.status(200).json({success: true, message: 'The product is deleted '});
        } else{
            return res.status(404).json({success: fales, message: 'Product not found'});
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err});
    });
 });

 
 router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count)=> count);

    if(!productCount){
     res.status(500).json({success: false});
    };
     res.send({
        productCount: productCount
     });
 });


  
 router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.body.count : 0;
    const products = await Product.find({isFeatured: true}).limit(+count);

    if(!products){
     res.status(500).json({success: false});
    };
     res.send(products);
 });

 router.put('/gallary-images/:id', uploadOption.array('images', 10), async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product Id');
      }
     const files = req.files
     let imagesPaths = [];
     const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
     if(files){
        files.map(file=>{
            imagesPaths.push(`${basePath}${file.fileName}`);
        })
      
     }
     
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        
        {new: true}
    ); 
    if(!product)
        return res.status(500).send('The product can not be updated');
    
        res.send(product);      

 })



 module.exports = router;