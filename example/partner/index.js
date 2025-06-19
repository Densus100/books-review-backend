

module.exports = (router) => {
    const redisClient = require("../database/Redis");
    // router.get('/partner', (req, res) => {
    //     // create a route for the about path
    //     let jsonResult = [
    //         { id: 1, name: 'John',},
    //         { id: 2, name: 'Doe',},
    //         ]
    //     res.json(jsonResult);
    //     // send a json response to the client
    // });
    
    // router.post('/partner', (req, res) => {
    //     let status_code = 200;
    //     let result = null
    //     try {
            
    //     } catch (error) {
    //         status_code = 400;
    //         result=error;
            
    //     }finally {
    //         res.status(status_code).json({result});
    //     }
    // });

    router.get("/partner", checkMiddleware,
        checkMiddleware2, 
        async (req, res) =>{
            // res.status(200).json({message: "Hello from the partner route"});
            let users = await global.models.Users.findAll();
            res.status(200).json({users});
            // send a json response to the client
        })

    router.post("/partner", 
        checkMiddleware, 
        checkMiddleware2, 
        async (req, res) =>{
            let body = req.body;
            console.log(body);
            try {
                // await global.models.Users.create({
                //     username: body.username,
                //     password: body.password,
                //     address: body.address
                // });
                await global.models.Users.bulkCreate(body);
                res.status(200).json({message: "Successfully created user"});
            }catch (error) {
                console.log(error);
                res.status(400).json({error});
            }
        })


    router.get("/redis", async (req, res) =>{
        let body = req.body;
        let redis = await redisClient();
        // set a key in redis
        await redis.set("test", JSON.stringify(body));

        res.status(200).json("ok");
    })

    router.get("/redis-get", async (req, res) =>{
        let redis = await redisClient();
        // get the key from redis
        let value = await redis.get("test");
        res.status(200).json(JSON.parse(value));
    })


    router.get("/gettoken",checkMiddleware2, async (req, res) =>{
        
        res.status(200).json({"token": "nurosoft"});
        // send a json response to the client
    })

    function checkMiddleware(req, res, next) {
        console.log("Middleware called");

        let headers = req.headers;
        console.log(headers);
        let token = headers["authorization"];
        if (token != "nurosoft") {
            return res.status(401).json({ message: "Bukan Nurosoft" });
        }
        // check if the token is valid
  

        next(); // Call the next middleware or route handler
    }

    function checkMiddleware2(req, res, next) {
        console.log("Middleware 2 called");
        next(); // Call the next middleware or route handler
    }

}