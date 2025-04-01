const prisma = require('../db/db_config')

//creating a product
const createProduct = async function(req, res) {
    try{
        const {name, sku} = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                sku
            }
        })
        res.status(200).json({message:'Product Created', product})
    }catch(err){
        res.status(500).json({message: 'Error creating product'})
    }
}


//Showing All the Products
const getAllProduct = async function(req, res) {
    try{
        const products = await prisma.product.findMany()
        res.json(products)
    }catch(err){
        res.status(500).json({message: 'Error fetching products'})
    }
}


//Get product details with movement history
const getProductbyID = async function(req, res){
    try{
        const product_id = req.params.id;
        if(!product_id) return res.status(404).json({message: "Product not found"})
        const getproduct = await prisma.product.findUnique({
            where: {
                id: Number(product_id)
            }
        })
        res.status(200).json({message:'Product Fetched', getproduct})
    }catch(err){
        res.status(500).json({message: 'Error fetching product by id'})
    }
}


//Updating the product
const UpdateProduct = async function (req, res) {
    try{
        const product_id = req.params.id;
        if(!product_id) 
            return res.status(404).json({message: "Product not found"})
        const {name, sku} = req.body;
        const updateProduct = await prisma.product.update({
            where: {
                id: Number(product_id)
            }
        })
        res.status(200).json({message:'Product Updated', updateProduct})

    }catch(err){
        res.status(500).json({message: 'Error updating product'})
    }
}


//deleting any product
const deleteProduct = async function(req, res){
    try{
        const product_id = req.params.id;
        if(!product_id) 
            return res.status(404).json({message: "Product not found"})
        const deleteProduct = await prisma.product.delete({
        where: {
            id: Number(product_id)
        }
 })
        res.status(200).json({message:'Product Deleted', deleteProduct})
      }
      catch(err){
        res.status(500).json({message: 'Error deleting product'})
    }
}




module.exports = {
    createProduct,
    getAllProduct,
    getProductbyID,
    UpdateProduct,
    deleteProduct
}