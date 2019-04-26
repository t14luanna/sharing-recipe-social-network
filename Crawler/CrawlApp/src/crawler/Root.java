/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package crawler;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author LUANNA
 */
public class Root {
    private int id;
    private String title;
    private List<String> urls;
    private List<Element> elements;

    public Root(JSONObject dto) {
        this.id = Integer.parseInt((String) dto.get("id"));
        this.title = (String) dto.get("title");
        
        try{
            this.urls = new ArrayList<>();
        
            JSONArray listUrl = (JSONArray) dto.get("urls");
            if(listUrl!= null && listUrl.size() > 0){
                for (Iterator iterator = listUrl.iterator(); iterator.hasNext();) {
                    String link = (String) iterator.next();
                    this.urls.add(link);
                }
            }

            this.elements = new ArrayList<Element>();

            JSONArray listElement = (JSONArray) dto.get("elements");
            if(listElement!= null && listElement.size() > 0){
                for (Iterator iterator = listElement.iterator(); iterator.hasNext();) {
                    JSONObject element = (JSONObject) iterator.next();
                    this.elements.add(new Element(element));
                }
            }
        }catch(Exception e){
            
        }
    }

    public List<String> getUrls() {
        return urls;
    }

    public void setUrls(List<String> urls) {
        this.urls = urls;
    }

    public List<Element> getElements() {
        return elements;
    }

    public void setElements(List<Element> elements) {
        this.elements = elements;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

}
