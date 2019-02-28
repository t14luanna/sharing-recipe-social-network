using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.DatabaseManager.Redis
{
    public class RedisUtil
    {
        
        private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
        {
            string cacheConnection = "localhost:6379";
            return ConnectionMultiplexer.Connect(cacheConnection);
        });

        public static ConnectionMultiplexer Connection
        {
            get
            {
                return lazyConnection.Value;
            }
        }
    }
}
