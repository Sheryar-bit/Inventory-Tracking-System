const prisma = require('../db/db_config')

//Creating stck movement
const RecordStockMovement = async (req, res) => {
    try {
        const { productId, quantity, type, notes } = req.body
        
        //Validating:
        const validateTypes = ['STOCK_IN' , "SALE" , "MANUAL_REMOVAL"]
        if (!validateTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid type" })
        }
        if(
            (type == "STOCK_IN" && quantity <= 0)
        ){
            return res.status(400).json({ message: "Invalid quantity" })
        }else {
            const stockMovement = await prisma.stockMovement.create({
                data: {
                    productId: Number(productId),
                    quantity,
                    type,
                    notes
                }
            });
            return res.status(201).json({message: "Stock Movement Recorder!", stockMovement})
        }
    } catch (error) {
        return res.status(500).json({message: 'Error Recording Movment! '})
    }
};




//get product Inventory:
const GetProductInventory = async (req, res) => {
    try {
        const  productId  = req.params.id
        const product = await prisma.product.findUnique({
            where: { id: Number(productId) },
            include: {movements: true}    
        });
        
        if(!product) 
            return res.status(404).json({message: "Product Not Found!"})

        const currentQuantity = product.movements.reduce((sum, movement) => {
            return movement.type === "STOCK_IN" 
            ?sum+movement.quantity  // Adds stock for Stock_IN
            :sum-movement.quantity; // Subtractss stock for Sale/Manual REmoval
        }, 0);

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