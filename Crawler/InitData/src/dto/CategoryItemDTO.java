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
public class CategoryItemDTO extends IDTO{
    private int mainId;

    public CategoryItemDTO(String name, int mainId) {
        this.name = name;
        this.mainId = mainId;
    }

    public int getMainId() {
        return mainId;
    }

    public void setMainId(int mainId) {
        this.mainId = mainId;
    }

    @Override
    protected IDTO parseFromJSON(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
