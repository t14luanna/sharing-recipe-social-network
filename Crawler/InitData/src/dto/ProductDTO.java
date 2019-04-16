/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dto;

import org.json.simple.JSONObject;

/**
 *
 * @author LUANNA
 */
public class ProductDTO extends IDTO{
    private String price;
    private String image;
    private int brandId;

    public ProductDTO(String name, String price, String image, int brandId) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.brandId = brandId;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public int getBrandId() {
        return brandId;
    }

    public void setBrandId(int brandId) {
        this.brandId = brandId;
    }

    @Override
    protected IDTO parseFromJSON(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
