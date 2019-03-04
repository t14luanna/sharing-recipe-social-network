using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace SRSN.UpdateLatLongStore
{
    public class GoogleUtils
    {
        private static string Key = "AIzaSyBzgvkqSdA28vGw5qvqgJdPp-3_8YEBzFo";
        public static GoogleApiBaseResponse<List<PlaceViewModel>> SearchByPlaceName<T>(string placeName)
            where T : class
        {
            string url = $"https://maps.googleapis.com/maps/api/place/textsearch/json?query={placeName}&key={Key}";
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                var res = client.GetAsync("").Result;
                if (res.IsSuccessStatusCode)
                {
                    var content = res.Content.ReadAsStringAsync().Result;
                    var result = JsonConvert.DeserializeObject<GoogleApiBaseResponse<List<PlaceViewModel>>>(content);
                    
                    return result;
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
