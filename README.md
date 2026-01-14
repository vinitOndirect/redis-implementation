Redis overview- 

Redis is an in-memory storage used for the backend in this case. 
In-memory being- it stores data in the RAM for faster access.
RAM is volatile so the data wont be persisted. The data also accepts a param for the expiration time TTL 
Redis as an applicaton also runs on its own PORT- defaulting for 6379


Redis is used in this application for 2 purposes- 

1. Caching
2. Rate limiting

Boiler Plate code- Initializing an instance of REDIS in a seperate folder.  

**RATE LIMITING**

<img width="499" height="314" alt="image" src="https://github.com/user-attachments/assets/d230bee1-5c7d-4900-ae6f-7a6bf16c1ab2" />

**Caching**

Client -> Backend /get API -> checks if key exists in Redis
                                  |                  |
                          yes -> return data      no-> fetch from db -> cache it for later calls -> return data    

Base syntax for redis- 

await redisClient.set(cacheKey, JSON.stringify(todos), "EX", 60);

await redisClient.get(cacheKey);

await redisClient.del("todos:all");

await redisClient.set(`todo:${id}`, JSON.stringify(toBeUpdated), "EX", 60);



