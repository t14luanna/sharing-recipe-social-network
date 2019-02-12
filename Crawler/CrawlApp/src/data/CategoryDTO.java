/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author LUANNA
 */
public class CategoryDTO {
    private List<String> urls;
    private List<ElementDTO> elements;

    public CategoryDTO() {
    }

    public CategoryDTO(JSONObject dto){
        this.urls = new ArrayList<>();
        
        JSONArray listUrl = (JSONArray) dto.get("urls");
        if(listUrl!= null && listUrl.size() > 0){
            for (Iterator iterator = listUrl.iterator(); iterator.hasNext();) {
                String link = (String) iterator.next();
                this.urls.add(link);
            }
        }
        
        this.elements = new ArrayList<ElementDTO>();
        
        JSONArray listElement = (JSONArray) dto.get("elements");
        if(listElement!= null && listElement.size() > 0){
            for (Iterator iterator = listElement.iterator(); iterator.hasNext();) {
                JSONObject element = (JSONObject) iterator.next();
                this.elements.add(new ElementDTO(element));
            }
        }
    }

    public List<String> getUrls() {
        return urls;
    }

    public void setUrls(List<String> urls) {
        this.urls = urls;
    }

    public List<ElementDTO> getElements() {
        return elements;
    }

    public void setElements(List<ElementDTO> elements) {
        this.elements = elements;
    }
    
}