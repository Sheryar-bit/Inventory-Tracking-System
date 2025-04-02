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
const getProductInventory = async (req, res) => {
    try {
      const { productId } = req.params;
      
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          movements: {
            orderBy: { createdAt: 'desc' } // Newest first
          }
        }
      });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      const currentQuantity = product.movements.reduce((total, movement) => {
        return movement.type === "STOCK_IN" 
          ? total + movement.quantity 
          : total - movement.quantity;
      }, 0);
  
      res.json({
        product: {
          name: product.name,
          sku: product.sku
        },
        movements: product.movements,
        currentQuantity
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching inventory" });
    }
  };


//Updating the product
const UpdateProduct = async function (req, res) {
    try{
        const product_id = req.params.id;
        if(!product_id) 
            return res.status(404).json({message: "Product not found"})
        const {name, sku} = req.body;
        const updateProduct = await prisma.product.update({
            where: {
                id: product_id
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
            id: (product_id)
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
    getProductInventory,
    UpdateProduct,
    deleteProduct
}