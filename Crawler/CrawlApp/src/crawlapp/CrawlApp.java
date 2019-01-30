/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package crawlapp;

import data.BrandDTO;
import data.CategoryDTO;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/**
 *
 * @author LUANNA
 */
public class CrawlApp {

    /**
     * @param args the command line arguments
     */
    
    private static List<BrandDTO> brands;
    
    public static void main(String[] args) {
        init();
        crawlProduct(1);
    }
    
    public static void init(){
        try{
            setDriverProperty();
            
            brands = new ArrayList<>();
            
            JSONParser parser = new JSONParser();

            JSONObject config = (JSONObject) parser.parse(new FileReader("config.json"));

            JSONArray brandsArr = (JSONArray) config.get("brands");            

            JSONObject results = new JSONObject();
            for (Iterator it = brandsArr.iterator(); it.hasNext();) {
                JSONObject brandObj = (JSONObject) it.next();
                BrandDTO brand = new BrandDTO(brandObj);
                brands.add(brand);
            }
        } catch(Exception e){
            e.printStackTrace();
        }
    }
    
    public static void setDriverProperty(){
        File file = new File("chromedriver.exe");
        System.setProperty("webdriver.chrome.driver", file.getAbsolutePath());
    }
    
    public static void crawlStore(int pos){
        Crawler crawler = new Crawler();
        crawler.start(brands.get(pos).getStores());
        crawler.close();
    }
    
    public static void crawlProduct(int pos){
        Crawler crawler = new Crawler();
        crawler.start(brands.get(pos).getProducts());
        crawler.close();
    }
}
