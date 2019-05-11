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
    private int ingredientId;
    private int brandId;

    public ProductDTO() {
    }

    public ProductDTO(int ingredientId, int brandId) {
        this.ingredientId = ingredientId;
        this.brandId = brandId;
    }

    public int getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(int ingredientId) {
        this.ingredientId = ingredientId;
    }

    public int getBrandId() {
        return brandId;
    }

    public void setBrandId(int brandId) {
        this.brandId = brandId;
    }

    @Override
    public IDTO parseFromJSON(JSONObject data) {
        int brandId = (int) data.get("StoreBrandId");
        int ingredientId = (int) data.get("IngredientId");
        
        return new ProductDTO(ingredientId, brandId);
    }
    
}
