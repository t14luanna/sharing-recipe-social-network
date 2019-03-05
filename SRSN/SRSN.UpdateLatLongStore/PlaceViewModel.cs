using System;
using System.Collections.Generic;
using System.Text;

namespace SRSN.UpdateLatLongStore
{

    public class Location
    {
        public double lat { get; set; }
        public double lng { get; set; }
    }

    public class Northeast
    {
        public double lat { get; set; }
        public double lng { get; set; }
    }

    public class Southwest
    {
        public double lat { get; set; }
        public double lng { get; set; }
    }

    public class Viewport
    {
        public Northeast northeast { get; set; }
        public Southwest southwest { get; set; }
    }

    public class Geometry
    {
        public Location location { get; set; }
        public Viewport viewport { get; set; }
    }

    public class PlusCode
    {
        public string compound_code { get; set; }
        public string global_code { get; set; }
    }

    public class PlaceViewModel
    {
        public string formatted_address { get; set; }
        public Geometry geometry { get; set; }
        public string icon { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string place_id { get; set; }
        public PlusCode plus_code { get; set; }
        public float rating { get; set; }
        public string reference { get; set; }
        public List<string> types { get; set; }
        public int user_ratings_total { get; set; }
    }
}
