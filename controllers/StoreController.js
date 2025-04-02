const prisma = require('../db/db_config');

const addstore = async function(req, res) {
    try {
        const { name, location } = req.body;
        const store = await prisma.store.create({
            data: {
                name,
                location
            }
        });
        res.status(200).json({message:'Store Created', store})
 
    } catch (error) {
        res.status(500).json({message: 'Error creating store! '})
    }
}

const viewstores = async function (req, res) {
    try {
        const stores = await prisma.store.findMany();
        res.status(200).json({message: 'The following stores exists in the DB ', stores})
    }
    catch (error) {
        res.status(500).json({message: 'Error Viewing stores! ', error})
    }
}

const getsinglestore = async function (req, res) {
    try {
        const { store_id } = req.params;
        const store = await prisma.store.findUnique({
            where: { id: store_id }  
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        
        res.status(200).json({message: 'Store found', store})

    } catch (error) {
        res.status(500).json({message: 'Error Viewing store! ', error})
    }
}


module.exports = {
    addstore,
    viewstores,
    getsinglestore
}