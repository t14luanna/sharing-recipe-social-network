/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.util.Iterator;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author LUANNA
 */
public class BrandDTO {
    private int id;
    private String title;
    private CategoryDTO products,stores;

    public BrandDTO(JSONObject brand) {
        this.id = Integer.parseInt((String) brand.get("id"));
        this.title = (String) brand.get("title");
        
        this.products = new CategoryDTO((JSONObject) brand.get("products"));
        this.stores = new CategoryDTO((JSONObject) brand.get("stores"));
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

    public CategoryDTO getProducts() {
        return products;
    }

    public void setProducts(CategoryDTO products) {
        this.products = products;
    }

    public CategoryDTO getStores() {
        return stores;
    }

    public void setStores(CategoryDTO stores) {
        this.stores = stores;
    }
    
}
