const prisma = require('../db/db_config')

//Creating stck movement
const RecordStockMovement = async (req, res) => {
    try {
      const { storeId, productId, quantity, type, notes } = req.body;
       
    const product = await prisma.product.findUnique({
        where: { id: productId }
      });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      
      const store = await prisma.store.findUnique({
        where: { id: storeId }
      });
  
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
  
      // Validate type
      const validateTypes = ['STOCK_IN', 'SALE', 'MANUAL_REMOVAL'];
      if (!validateTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid type" });
      }
  
      // Validate quantity
      if (type === "STOCK_IN" && quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
  
      // Record the movement
      const stockMovement = await prisma.stockMovement.create({
        data: {
          productId,  
          storeId,    
          quantity,
          type,
          notes
        }
      });
  
      
      await prisma.storeStock.upsert({
        where: {
          productId_storeId: { productId, storeId }
        },
        update: {
          quantity: {
            increment: type === "STOCK_IN" ? quantity : -quantity
          }
        },
        create: {
          productId,
          storeId,
          quantity: type === "STOCK_IN" ? quantity : -quantity
        }
      });
  
      return res.status(201).json({
        message: "Stock Movement Recorded!",
        stockMovement
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error Recording Movement!" });
    }
  };




//get product Inventory:
const GetProductInventory = async (req, res) => {
    try {
        const  productId  = req.params.id
        const product = await prisma.product.findUnique({
            where: { id: (productId) },
            include: {movements: true}    
        });
        
        if(!product) 
            return res.status(404).json({message: "Product Not Found!"})

        const currentQuantity = product.movements.reduce((sum, m) => {
            return m.type === "STOCK_IN" ? sum + m.quantity : sum - m.quantity;
          }, 0)

          res.json({
            ...product,
            currentQuantity,
          });

        // return res.status(200).json({message: "Product Inventory", product})
    }catch (error) {
        return res.status(500).json({message: 'Error fetching product inventory! '})
    }
}



module.exports={ 
    RecordStockMovement,
    GetProductInventory
}