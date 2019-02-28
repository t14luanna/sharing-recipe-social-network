using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRSN.ClientApi.Redis
{
    public class RedisUtil
    {
        private static RedisManagerPool db = null;
        private RedisUtil()
        {

        }
        public static RedisManagerPool GetDatabase()
        {
            if (db == null)
            {
                db = new RedisManagerPool("127.0.0.1:6379");
            }
            return db;
        }
    }
}
