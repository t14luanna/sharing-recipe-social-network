using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Discovery.v1;
using Google.Apis.Discovery.v1.Data;
using Google.Apis.Services;
using Newtonsoft.Json;
using SRSN.UpdateLatLongStore.Entities.Services;

namespace SRSN.UpdateLatLongStore
{
    /// <summary>
    /// This example uses the discovery API to list all APIs in the discovery repository.
    /// https://developers.google.com/discovery/v1/using.
    /// <summary>
    public class Program
    {
        //[STAThread]
        public static void Main(string[] args)
        {
            Console.OutputEncoding = Encoding.UTF8;
            using (var unitOfWork = new UnitOfWork())
            {
                var storeService = new StoreService(unitOfWork);
                var data = storeService.GetListAddress().Result;
                Console.WriteLine($"Begin update on {data.Count} items...");
                foreach(var item in data)
                {
                    Console.WriteLine($"\nItem {data.IndexOf(item)+1}");
                    try
                    {
                        var trueAddress = item.Name;
                        var result = GoogleUtils.SearchByPlaceName<List<PlaceViewModel>>(trueAddress);
                        if(result.results.Count > 0)
                        {
                            var placeInformation = result.results[0];
                            item.Lat = placeInformation.geometry.location.lat;
                            item.Long = placeInformation.geometry.location.lng;
                            storeService.UpdateLatLong(item);
                            Console.ForegroundColor = ConsoleColor.Green;
                            Console.WriteLine($"Update lat long {item.Name}");
                            Console.WriteLine($"Search Value: {trueAddress}");
                            Console.WriteLine("successfully!");
                        }
                        else
                        {
                            trueAddress = item.Address.Substring(0, item.Address.IndexOf("("));
                            result = GoogleUtils.SearchByPlaceName<List<PlaceViewModel>>(trueAddress);
                            if (result.results.Count > 0)
                            {
                                var placeInformation = result.results[0];
                                item.Lat = placeInformation.geometry.location.lat;
                                item.Long = placeInformation.geometry.location.lng;
                                storeService.UpdateLatLong(item);
                                Console.ForegroundColor = ConsoleColor.Green;
                                Console.WriteLine($"Update lat long {item.Name}");
                                Console.WriteLine($"Search Value: {trueAddress}");
                                Console.WriteLine("successfully!");
                            }
                            else
                            {
                                Console.ForegroundColor = ConsoleColor.Red;
                                Console.WriteLine($"Update lat long {item.Name}");
                                Console.WriteLine($"Adress: {trueAddress}");
                                Console.WriteLine("failed!");
                            }
                        }

                    }
                    catch (Exception)
                    {

                    }
                }

              
            }
            Console.ReadKey();
        }
    }
}