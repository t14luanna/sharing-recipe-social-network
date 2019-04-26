/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package crawlapp;

import crawler.Root;
import dao.IDAO;
import dao.IngredientDAO;
import dao.ProductDAO;
import dao.StoreDAO;
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
public class Crawler {
    private List<Root> products, stores, ingredients;

    public Crawler(String configPath){
        try{
            setDriverProperty();
            
            JSONParser parser = new JSONParser();

            JSONObject config = (JSONObject) parser.parse(new FileReader(configPath));

            products = getRootList(config, "products");
            stores = getRootList(config, "stores");
            ingredients = getRootList(config, "ingredients");
            
        } catch(Exception e){
            e.printStackTrace();
        }
    }
    
    private void setDriverProperty(){
        File file = new File("chromedriver.exe");
        System.setProperty("webdriver.chrome.driver", file.getAbsolutePath());
    }

    public void crawl(Root root, IDAO dao){
        CrawlSitemap crawler = new CrawlSitemap(dao);
        crawler.start(root);
        crawler.close();
    }
    
    public void crawlAll(){
        for (Root product : products) {
            crawl(product, new ProductDAO());
        }
        for (Root store : stores) {
            crawl(store, new StoreDAO());
        }
        for (Root ingredient : ingredients) {
            crawl(ingredient, new IngredientDAO());
        }
    }
    
    private List<Root> getRootList(JSONObject root, String child){
        JSONArray list = (JSONArray) root.get(child);   
        List<Root> arr = new ArrayList<>();            

        for (Iterator it = list.iterator(); it.hasNext();) {
            JSONObject dtoObj = (JSONObject) it.next();
            Root dto = new Root(dtoObj);
            arr.add(dto);
        }
        
        return arr;
    }
}
