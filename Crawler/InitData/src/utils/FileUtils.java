/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author LUANNA
 */
public class FileUtils {
    public static String read(String uri) throws IOException{
        File file = new File(uri); 
  
        BufferedReader br = new BufferedReader(new FileReader(file)); 

        String st;
        StringBuilder s = new StringBuilder();
        while ((st = br.readLine()) != null) {
            s.append(st);
        } 
        
        return s.toString();
    }

    public static JSONArray readCSV(String uri){
        JSONArray result = new JSONArray();
        
        String line = "";
        String cvsSplitBy = "\",\"";

        try (BufferedReader br = new BufferedReader(new FileReader(uri))) {

            line = br.readLine();

            String[] names = line.split(",");

            while ((line = br.readLine()) != null) {

                JSONObject lineValue = new JSONObject();
                
                // use comma as separator
                String[] values = line.split(cvsSplitBy);

                for (int i = 0; i < names.length; i++) {
                    values[i] = values[i].replaceAll("\"", "");
                    lineValue.put(names[i], values[i]);
                }
                
                result.add(lineValue);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return result; 
    }
}
