using System;
using System.Collections.Generic;
using System.Text;
using ServiceStack.Redis;

namespace SRSN.UserBehavior.Redis
{
    public class RedisUtil
    {
        public static readonly string CONNECTION_STR = "127.0.0.1:6379";
        private static readonly PooledRedisClientManager redisManager = new PooledRedisClientManager(CONNECTION_STR);
        private RedisUtil()
        {

        }

        public static IRedisClient GetRedisClient()
        {
            var client = redisManager.GetClient();
            return client;
        }

    }

    #region old codes ( ASP NET CORE REDIS )
    //public class RedisUtil 
    //{
    //    private readonly IDatabase db = null;
    //    private RedisUtil()
    //    {

    //    }

    //    public static RedisManagerPool GetDatabase()
    //    {
    //        // hien tai thi minh dung singleton nen nguyen application co 1 RedisMaanagerPool
    //        // nen gio muon renew khi het quota 
    //        // chac phai ket noi lai vay se bo singleton di

    //        if(db == null)
    //        {
    //            db = new RedisManagerPool("127.0.0.1:6379");
    //        }
    //        return db;
    //    }

    //}

    //public class RedisFactory
    //{
    //    public readonly static string CONNECTION_STR = "127.0.0.1:6379";
    //    public static RedisManagerPool CreateRedisManagerPool()
    //    {
    //        var result = new RedisManagerPool(CONNECTION_STR);
    //        return result;
    //    }
    //} 
    #endregion
}
