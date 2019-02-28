using System;
using System.Collections.Generic;
using System.Text;
using ServiceStack.Redis;

namespace SRSN.UserBehavior.Redis
{
    public class RedisUtil 
    {
        private static RedisManagerPool db = null;
        private RedisUtil()
        {

        }
        
        public static RedisManagerPool GetDatabase()
        {
            if(db == null)
            {
                db = new RedisManagerPool("127.0.0.1:6379");
            }
            return db;
        }

    }
}
