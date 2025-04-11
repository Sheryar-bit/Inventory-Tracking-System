const redis = require('redis')
require('dotenv').config();

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379
});
// Redis Connection
(
    async function() {
        redisClient.on('error', function(err) {
            console.error('Redis error:', err);
        })

        redisClient.on('ready', function () {
            console.log("Redis Client Connected! ");
            
        })

        await redisClient.connect();
        await redisClient.ping();
    }
)();
//Setting data into cache:
const setCache = async function (key, data, expiry = 300) {
    const value = typeof data === 'string' ? data : JSON.stringify(data);
    await redisClient.set(key, value, { EX: expiry });
}

//Geting data from redis
const getCache = async function (key) {
    const value = await redisClient.get(key);
    if (!value) return null;

    try {
        return JSON.parse(value); 
    } catch (e) {
        return value
    }
}
const deleteCache = async function (key) {
    await redisClient.del(key);
}


module.exports = {
    setCache,
    getCache,
    deleteCache
};