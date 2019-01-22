using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.Service.Repositories
{

    public interface IUnitOfWork
    {
        void Commit();
        
    }

    public class UnitOfWork
    {
    }
}
