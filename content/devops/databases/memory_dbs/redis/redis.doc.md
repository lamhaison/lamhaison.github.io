---
section: Redis

id: redis-commands-reference
pageUrl: https://lamhaison.github.io
pageLabel: Redis Commands Reference
tags: [redis, commands, reference, database, memory, cache, debugging]
---

## Q: **[redis - commands - debugging - reference] What are the essential Redis commands and connection testing?**

Comprehensive reference for Redis commands organized by category with real-world examples for connection testing, key management, and data operations.

### Connection & Debugging

#### Testing Redis Connection with Telnet

Test connectivity to your Redis instance using telnet protocol.

```bash
# Install telnet (if not already installed)
sudo apt-get install telnet

# Connect to Redis instance
telnet instance-ip-address 6379

# In the telnet session, enter some Redis commands:
PING                  # Response: PONG
SET HELLO WORLD       # Response: +OK
GET HELLO             # Response: WORLD
DEL HELLO             # Response: :1 (number of deleted keys)
GET HELLO             # Response: $-1 (nil, key doesn't exist)
quit                  # Exit telnet session
```

#### Redis CLI Connection

Connect and test Redis using the official redis-cli tool.

```bash
# Connect to local Redis instance
redis-cli

# Connect to remote Redis instance
redis-cli -h instance-ip-address -p 6379

# Run command directly without entering CLI
redis-cli -h instance-ip-address PING

# Check connection with password
redis-cli -h instance-ip-address -a your-password PING
```

### Key Management

#### `SET` - Store Key-Value

Set a key-value pair with optional expiration.

```bash
SET key value              # Set key to value
SET key value EX 3600      # Set with 60-minute expiration
SET key value PX 3600000   # Set with millisecond expiration
SET key value NX           # Set only if key doesn't exist
SET key value XX           # Set only if key exists
```

#### `GET` - Retrieve Value

Retrieve the value of a key.

```bash
GET key                    # Get value of key
GET non-existent-key       # Returns nil if key doesn't exist
```

#### `DEL` - Delete Keys

Delete one or more keys.

```bash
DEL key1                   # Delete single key
DEL key1 key2 key3         # Delete multiple keys
DEL non-existent-key       # Returns 0 (no keys deleted)
```

#### `EXISTS` - Check Key Existence

Check if one or more keys exist.

```bash
EXISTS key1                # Returns 1 if exists, 0 if not
EXISTS key1 key2 key3      # Returns count of existing keys
```

#### `EXPIRE` - Set Key Expiration

Set or modify key expiration time.

```bash
EXPIRE key 3600            # Set expiration to 60 minutes
PEXPIRE key 3600000        # Set expiration in milliseconds
TTL key                    # Get remaining time in seconds
PTTL key                   # Get remaining time in milliseconds
PERSIST key                # Remove expiration from key
```

### Data Inspection

#### `KEYS` - Find Keys

Search for keys matching a pattern (use with caution in production).

```bash
KEYS *                     # List all keys
KEYS user:*                # Find keys starting with "user:"
KEYS *session*             # Find keys containing "session"
DBSIZE                     # Count total number of keys
```

#### `TYPE` - Get Value Type

Check the data type of a key.

```bash
TYPE key                   # Returns: string, list, set, zset, hash, etc.
```

#### `INFO` - Server Information

Get Redis server statistics and information.

```bash
INFO                       # All server information
INFO server                # Server details
INFO memory                # Memory usage
INFO stats                 # Command statistics
INFO replication           # Master/slave information
```

### References
* [Testing connection of Redis using telnet](https://cloud.google.com/memorystore/docs/redis/create-instance-console?_gl=1*ff61ve*_up*MQ..&gclid=Cj0KCQjwiMmwBhDmARIsABeQ7xTZXWqPYAjyHWLjqWHgLxtvRxeF2_Uty8ZzYFOiHxBij0_w9ANSl04aAi1wEALw_wcB&gclsrc=aw.ds)
* [Redis Official Documentation](https://redis.io/documentation)
* [Redis Commands](https://redis.io/commands/)
* [Google Cloud Memorystore for Redis](https://cloud.google.com/memorystore/docs/redis)

## Q: **[redis - caching - patterns - best-practices - pattern] What are the common Redis caching patterns and strategies?**

Redis caching patterns help optimize application performance and data consistency. Common patterns include Cache-Aside, Write-Through, and Write-Behind.

### Cache-Aside (Lazy Loading)

Load data into cache only when necessary. Application checks cache first, and if data is missing, loads from database.

```
1. Application requests data from cache
2. Cache miss → Application loads from database
3. Application stores data in cache
4. Next requests get data from cache
```

**Pros:**
- Simple to implement
- Only cached data is truly relevant
- Resilient to cache failures

**Cons:**
- Cache misses cause application delay
- Stale data possible if database changes
- Cache stampede risk (many clients fetch same data)

### Write-Through

Data is written to both cache and database simultaneously.

```
1. Application writes to cache
2. Cache writes to database (synchronously)
3. Acknowledgment returned to application
```

**Pros:**
- Data consistency guaranteed
- Simple to understand
- No stale data

**Cons:**
- Slower write operations
- Write latency depends on database
- Wasted cache space for never-read data

### Write-Behind (Write-Back)

Data is written to cache first, database updated asynchronously.

```
1. Application writes to cache
2. Cache returns immediately (before DB write)
3. Background job writes to database
```

**Pros:**
- Fast write operations
- Good for write-heavy workloads
- Batches can be optimized

**Cons:**
- Risk of data loss if cache fails
- Complex to implement correctly
- Potential data inconsistency during failures

### References

* [Caching Patterns - AWS Whitepaper](https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html)
* [Redis Caching Best Practices](https://redis.io/docs/management/persistence/)
* [Cache Stampede Problem](https://en.wikipedia.org/wiki/Cache_stampede)