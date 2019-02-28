/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package initdata;

import dao.CategoryItemDAO;
import dao.CategoryMainDAO;
import dao.IngredientDAO;
import dto.CategoryItemDTO;
import dto.CategoryMainDTO;
import dto.IngredientDTO;
import java.io.File;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import utils.FileUtils;

/**
 *
 * @author LUANNA
 */
public class InitData {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        initIngredients();
        initCategories();
    }
    
    public static void initCategories(){
        JSONArray categories = FileUtils.readCSV("./data/cooky_category.csv");
        for (Iterator iterator = categories.iterator(); iterator.hasNext();) {
            JSONObject next = (JSONObject) iterator.next();
            if (!next.get("Main").equals("null") && !next.get("Item").equals("")) {
                String mainName = (String) next.get("Main");
                try {
                    CategoryMainDTO dto = new CategoryMainDTO(mainName);
                    int mainId = CategoryMainDAO.findOrCreate(dto);

                    String name = (String) next.get("Item");
                    CategoryItemDTO item = new CategoryItemDTO(name, mainId);
                    CategoryItemDAO.create(item);
                } catch (SQLException ex) {
                    Logger.getLogger(InitData.class.getName()).log(Level.SEVERE, null, ex);
                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(InitData.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
    }
    
    public static void initIngredients(){
     try {
            // TODO code application logic here
            initOrganic("./data/organic");
            initBachhoaxanh("./data/bachhoaxanh");
        } catch (SQLException ex) {
            Logger.getLogger(InitData.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(InitData.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public static void initBachhoaxanh(String directoryName) throws SQLException, ClassNotFoundException{
        File directory = new File(directoryName);
        //get all the files from a directory
        File[] fList = directory.listFiles();
        for (File file : fList){
            if (file.isFile()){
                JSONArray result = FileUtils.readCSV(file.getAbsolutePath());
                for (Iterator iterator = result.iterator(); iterator.hasNext();) {
                    JSONObject next = (JSONObject) iterator.next();
                    String name = null;
                    if (next.get("category") == null) {
                        name = (String) next.get("Category");
                    } else {
                        name = (String) next.get("category");
                    }

                    if (!name.equals("null")) {
                        name = name.replaceAll("\"", "");
                        IngredientDTO dto = new IngredientDTO(name);
                        IngredientDAO.create(dto);
                    }
                }
            }
        }
    }
    
    public static void initOrganic(String directoryName) throws SQLException, ClassNotFoundException{
        File directory = new File(directoryName);
        //get all the files from a directory
        File[] fList = directory.listFiles();
        for (File file : fList){
            if (file.isFile()){
                JSONArray result = FileUtils.readCSV(file.getAbsolutePath());
                for (Iterator iterator = result.iterator(); iterator.hasNext();) {
                    JSONObject next = (JSONObject) iterator.next();
                    String name = null;
                    if (next.get("category") == null) {
                        name = (String) next.get("Category");
                    } else {
                        name = (String) next.get("category");
                    }

                    if (!name.equals("null")) {
                        name = name.replaceAll("\"", "");
                        if (name.contains("-")) {
                            name = name.substring(0, name.indexOf("-")).trim();
                        }
                        
                        if (name.endsWith("ml")) {
                            name = name.substring(0, name.lastIndexOf(" "));
                        } else if (name.endsWith("Lít") || name.endsWith("gram")) {
                            name = name.substring(0, name.lastIndexOf(" "));
                            name = name.substring(0, name.lastIndexOf(" "));
                        } else if (name.endsWith("g") || name.endsWith("G")) {
                            String quantity = name.substring(name.lastIndexOf(" ") + 1, name.length());
                            if (quantity.matches("-?\\d+(\\.\\d+)?g") || quantity.matches("-?\\d+(\\.\\d+)?kg") || quantity.matches("-?\\d+(\\.\\d+)?G")) {
                                name = name.substring(0, name.lastIndexOf(" "));
                            }
                        }
                        IngredientDTO dto = new IngredientDTO(name);
                        IngredientDAO.create(dto);
                    }
                }
            }
        }
    }
}
