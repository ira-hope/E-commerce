const {Category}= require('../models/category');
const express = require('express');
const {router} = require('./products');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const CategoryList = await Category.find();
    if(!CategoryList){
     res.status(500).json({success: false});
    };
     res.status(200).send(CategoryList);
 });


 router.get('/:id',async(req,res)=>{
    const category = await Category.findById(req.params.id);
    if(!category){
        res.status(500).json({message: 'The catef=ory with the given ID was not found'});
    }
         res.status(200).send(category);

 });

 router.post('/', async(req, res) =>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
    category = await category.save();
    if(!category)
        return res.status(404).send('The category can not be created');
    
        res.send(category);

 });

 router.put('/:id', async (req,res)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon:  req.body.icon,
            color: req.body.color
        },
        
        {new: true}
    );
    if(!category)
    return res.status(404).send('The category can not be created');

    res.send(category);


       

 });

 router.delete('/:Id', (req, res)=>{
    Category.findByIdAndRemove(req.params.Id).then(category=>{
        if(category){
            return res.status(200).json({success: true, message: 'The category is deleted '});
        } else{
            return res.status(404).json({success: fales, message: 'Catgeory not found'});
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err});
    });
 });

 module.exports = router;
