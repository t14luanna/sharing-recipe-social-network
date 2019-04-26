/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dto;

import dao.StoreDAO;
import org.json.simple.JSONObject;

/**
 *
 * @author LUANNA
 */
public class StoreDTO extends IDTO {
    private String address;
    private int brandId;

    public StoreDTO() {
    }

    public StoreDTO(String name, String address, int brandId) {
        this.name = name;
        this.address = address;
        this.brandId = brandId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getBrandId() {
        return brandId;
    }

    public void setBrandId(int brandId) {
        this.brandId = brandId;
    }

    @Override
    public IDTO parseFromJSON(JSONObject data) {
        String name = (String) data.get("Name");
        String address = (String) data.get("Address");
        int brandId = Integer.parseInt((String) data.get("BrandId"));
        
        if(name != null && address != null){
            return new StoreDTO(name, address, brandId);
        }
        
        return null;
    }
    
}
