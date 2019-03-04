using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.UpdateLatLongStore
{

    public class GoogleApiBaseResponse<T> 
        where T : class
    {
        public List<object> html_attributions { get; set; }
        public T results { get; set; }
        public string status { get; set; }
    }

}
