const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const { populate } = require('dotenv');
const router = express.Router();
// getting all the orders  
router.get('/', async (req,res) =>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
    if(!orderList){
        return res.status(500).json({success: false});
    }

    return res.send(orderList);
});

// getting orders by id
router.get('/:id', async (req,res) =>{
    const order = await Order.findById().populate('user', 'name').populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}});
    if(!order){
        return res.status(500).json({success: false});
    }

    return res.send(order);
});

//adding a new order
router.post('/', async (req, res) =>{
    const orderItemsIds = Promise.all(req.body.orderItems.map( async orderItem =>{
        let newOrderItem = new OrderItem({
            quantiry:  orderItem.quantity,
            product: orderItem.product
        });

        newOrderItem =  await newOrderItem.save();//saving in the database
        return newOrderItem._id;

    }));

    const orderItemsIdResolved = await orderItemsIds;
    const totalPrices = await Promise.all(orderItemsIdResolved.map(async (orderItemsId) =>{
        const orderItem = await OrderItem.findById(orderItemsId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;

    }));
    
    const totalPrice = totalPrices.reduce((a,b) => a+b, 0);
    console.log(totalPrices);
  
    let order = new Order( {
    orderItems: orderItemsIdResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    counrty: req.body.counrty,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,

    });
     
    order = await category.save();
    if(!order)
        return res.status(404).send('The order can not be created');
    
        res.send(order);

 });

//updating the order by the status
 
 router.put('/:id', async (req,res)=>{
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
           status: req.body.status
        },
        
        {new: true}
    );
    if(!order)
    return res.status(404).send('The order can not be created');

    res.send(order);

 });

 
 router.delete('/:Id', (req, res)=>{
    // in both the database and  postman (the two awaits are for such that the data is removed from the database)
    Order.findByIdAndRemove(req.params.Id).then( async order=>{
        if(order){
            await order.orderItems.map(async orderItem =>{
                await OrderItem.findByIdAndRemove(orderItem)
            });
            return res.status(200).json({success: true, message: 'The order is deleted '});
        } else{
            return res.status(404).json({success: fales, message: 'Order not found'});
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err});
    });
 });

 router.get('/get/totalSales', async (req,res) =>{
    const totalSales = await Order.aggregate([
        {$group: {_id: null, totalSales: {$sum: 'totalPrice'}}}
    ])
    if(!totalSales){
        return res.status(400).send('The order sales cannot be generated');

    }
    return res.send({totalSales: totalSales.pop().totalSales})
 });

  
 router.get(`/get/count`, async (req, res) => {
    const orderCount = await Order.countDocuments((count)=> count);

    if(!orderCount){
     res.status(500).json({success: false});
    };
     res.send({
        orderCount: orderCount
     });
 });

//the orders of a certain user according to his id will get his own orders on the dashbord
 router.get('/get/userorders/:userid', async (req,res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}}).sort({'dateOrdered': -1});
    if(! userOrderList){
        return res.status(500).json({success: false});
    }

    return res.send( userOrderList);
});


module.exports = router;