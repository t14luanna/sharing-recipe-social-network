/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package crawlapp;

import dao.IngredientDAO;
import dao.StoreDAO;
import data.BrandDTO;
import dto.IngredientDTO;
import dto.StoreDTO;
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
        crawlAll();
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
        JSONArray result = crawler.getResults();

        StoreDAO dao = new StoreDAO();
        int count = 0;
        for (Iterator iterator = result.iterator(); iterator.hasNext();) {
            count++;
            JSONObject next = (JSONObject) iterator.next();
            String name = (String) next.get("Name");
            String address = (String) next.get("Address");
            StoreDTO dto = new StoreDTO(name, address, brands.get(pos).getId());
            try {
                dao.create(dto);
                System.out.println(count + " : " + next);
            } catch (Exception ex) {
                System.out.println("Error: " + count);
            }
        }
        
        crawler.close();
    }
    
    public static void crawlProduct(int pos){
        Crawler crawler = new Crawler();
        crawler.start(brands.get(pos).getProducts());
        
        JSONArray result = crawler.getResults();

        IngredientDAO dao = new IngredientDAO();
        int count = 0;
        for (Iterator iterator = result.iterator(); iterator.hasNext();) {
            count++;
            JSONObject next = (JSONObject) iterator.next();
            String name = (String) next.get("Name");
            String price = (String) next.get("Price");
            String image = (String) next.get("Image");
            IngredientDTO dto = new IngredientDTO(name, price, image, brands.get(pos).getId());
            try {
                dao.create(dto);
                System.out.println(count + " : " + next);
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
                System.out.println("Error: " + count);
            }
        }
        
        crawler.close();
    }
    
    public static void crawlAll(){
        for (int i = 0; i < brands.size(); i++) {
            crawlProduct(i);
            crawlStore(i);
        }
    }
}
