/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dao;

import dto.IDTO;
import java.sql.SQLException;
import org.json.simple.JSONObject;

/**
 *
 * @author LUANNA
 */
public interface IDAO <T extends IDTO> {
    public boolean check(String name) throws SQLException, ClassNotFoundException;
    public void create(T dto) throws SQLException, ClassNotFoundException;
    public void create(JSONObject data) throws SQLException, ClassNotFoundException;
}
