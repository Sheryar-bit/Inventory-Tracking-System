const prisma = require('../db/db_config');
const { getCache, setCache, deleteCache } = require('../middleware/Cache'); 

// Create a store
const addstore = async (req, res) => {
  try {
    const { name, location } = req.body;

    const store = await prisma.store.create({
      data: { name, location }
    });

    
    await setCache('stores:all', null);

    res.status(200).json({ message: 'Store Created', store });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating store!', error });
  }
};


const viewstores = async (req, res) => {
  try {
    const key = 'stores:all';

    let stores = await getCache(key);
    if (stores) {
      return res.status(200).json({ message: 'Fetched from cache', stores });
    }

    stores = await prisma.store.findMany();

    await setCache(key, stores);

    res.status(200).json({ message: 'Fetched from DB', stores });
  } catch (error) {
    res.status(500).json({ message: 'Error viewing stores!', error });
  }
};


const getsinglestore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const key = `store:${storeId}`;

    let store = await getCache(key);
    if (store) {
      return res.status(200).json({ message: 'Fetched from cache', store });
    }

    store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    await setCache(key, store);

    res.status(200).json({ message: 'Fetched from DB', store });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error viewing store!', error });
  }
};

const getStoreStock = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const stock = await prisma.storeStock.findMany({
      where: { storeId },
      include: {
        product: {
          select: {
            name: true,
            sku: true
          }
        }
      }
    });

    res.status(200).json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching store stock' });
  }
};


const updatestore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { name, location } = req.body;

    const store = await prisma.store.update({
      where: { id: storeId },
      data: { name, location }
    });

    await setCache(`store:${storeId}`, null);
    await setCache('stores:all', null);

    res.status(200).json({ message: 'Store updated', store });
  } catch (error) {
    res.status(500).json({ message: 'Error updating store!', error });
  }
};

// Delete store and invalidate cache
const deletestore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await prisma.store.delete({
      where: { id: storeId }
    });

    await setCache(`store:${storeId}`, null);
    await setCache('stores:all', null);

    res.status(200).json({ message: 'Store deleted', store });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting store!', error });
  }
};

module.exports = {
  addstore,
  viewstores,
  getsinglestore,
  getStoreStock,
  updatestore,
  deletestore
};





















// const prisma = require('../db/db_config');

// const addstore = async function(req, res) {
//     try {
//         const { name, location } = req.body;
//         const store = await prisma.store.create({
//             data: {
//                 name,
//                 location
//             }
//         });
//         res.status(200).json({message:'Store Created', store})
 
//     } catch (error) {
//         res.status(500).json({message: 'Error creating store! '})
//     }
// }

// const viewstores = async function (req, res) {
//     try {
//         const stores = await prisma.store.findMany();
//         res.status(200).json({message: 'The following stores exists in the DB ', stores})
//     }
//     catch (error) {
//         res.status(500).json({message: 'Error Viewing stores! ', error})
//     }
// }

// const getsinglestore = async function (req, res) {
//     try {
//         const { store_id } = req.params;
//         const store = await prisma.store.findUnique({
//             where: { id: store_id }  
//         });

//         if (!store) {
//             return res.status(404).json({ message: 'Store not found' });
//         }

//         res.status(200).json({message: 'Store found', store})

//     } catch (error) {
//         res.status(500).json({message: 'Error Viewing store! ', error})
//     }
// }

// const getStoreStock = async (req, res) => {
//   try {
//     const { storeId } = req.params;

//     // 1. Validate store exists
//     const store = await prisma.store.findUnique({
//       where: { id: storeId }
//     });

//     if (!store) {
//       return res.status(404).json({ message: "Store not found" });
//     }

//     // 2. Get all stock for this store
//     const stock = await prisma.storeStock.findMany({
//       where: { storeId },
//       include: {
//         product: {
//           select: {
//             name: true,
//             sku: true
//           }
//         }
//       }
//     });

//     res.status(200).json(stock);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching store stock" });
//   }
// };


// module.exports = {
//     addstore,
//     viewstores,
//     getsinglestore,
//     getStoreStock
// }