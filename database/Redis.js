const redis = require('redis');


// const redisClient = redis.createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
// });
// create a new instance of redis
// redisClient.connect();

let client;

async function redisClient() {
    if (client) return client;
    // check if the client is already connected
    // create a new instance of redis
    client = redis.createClient({
        url: `redis://${process.env.DB_REDIS_HOST}:${process.env.DB_REDIS_PORT}`,
    });
    await client.connect();
    return client;
}

module.exports = redisClient;