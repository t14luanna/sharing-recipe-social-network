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

    public IngredientDTO() {
    }

    public IngredientDTO(String name) {                
        this.name = name;
    }

    @Override
    public IDTO parseFromJSON(JSONObject data) {
        String name = validationName((String) data.get("Name"));
        
        if(name != null){
            return new IngredientDTO(name);
        }
        
        return null;
    }
    
    private String validationName(String name){
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
        return name;
    }
}