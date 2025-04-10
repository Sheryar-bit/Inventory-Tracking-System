const { setCache, getCache, deleteCache } = require('../middleware/Cache');
const logAudit = require('../middleware/AuditLogger');
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
        });
        await logAction('CREATE_PRODUCT', req.user?.id || 'system', { 
          productId: newProduct.id, 
          name, 
          sku 
      });
        await logAudit('CREATE_PRODUCT', req.user?.id || 'system', { productId: product.id, name, sku });
        await deleteCache('products:all');
        
        res.status(200).json({message:'Product Created', product})
    }catch(err){
        res.status(500).json({message: 'Error creating product'})
    }
}


//Showing All the Products
const getAllProduct = async function(req, res) {
  try {
      const key = 'products:all';
      let products = await getCache(key); 

      if (!products) {
          products = await prisma.product.findMany();
          await setCache(key, products, 60 * 60 * 24);
      }
          res.json(products);
  } catch (err) {
      console.error(err); 
      res.status(500).json({ message: 'Error fetching products' });
  }
};



//Get product details with movement history
const getProductInventory = async (req, res) => {
    try {
      const { productId } = req.params;
      const key = `product:inventory:${productId}`;
      
      let product = await getCache(key);
      if (!product) {
        product = await prisma.product.findUnique({
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
      await setCache(key, product, 60 * 60 * 24);
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
        });

        await logAudit('UPDATE_PRODUCT', req.user?.id || 'system', { productId: product_id, name, sku });
        await deleteCache('products:all');
        await deleteCache(`product:inventory:${product_id}`);

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
  });
        await logAudit('DELETE_PRODUCT', req.user?.id || 'system', { productId: product_id });
        await deleteCache('products:all');
        await deleteCache(`product:inventory:${product_id}`);
        

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