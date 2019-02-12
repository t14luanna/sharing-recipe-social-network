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
}
