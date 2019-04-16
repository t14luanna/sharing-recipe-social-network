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
public class IngredientDTO extends IDTO {

    public IngredientDTO(String name) {
        this.name = name;
    }

    @Override
    protected IDTO parseFromJSON(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}