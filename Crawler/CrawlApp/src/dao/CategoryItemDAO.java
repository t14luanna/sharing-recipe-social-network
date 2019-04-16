/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dao;

import dto.CategoryItemDTO;
import dto.IngredientDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.json.simple.JSONObject;
import utils.Constants;
import utils.DBUtils;

/**
 *
 * @author LUANNA
 */
public class CategoryItemDAO implements IDAO<CategoryItemDTO>{
    private String table = Constants.TABLE_CATEGORY_ITEM;
    
    public void create(CategoryItemDTO dto) throws SQLException, ClassNotFoundException{
        if(check(dto.getName())){
            return;
        }
        
        Connection connection = DBUtils.getConnection();
        String sql = "Insert into " + table + " (CategoryItemName, CategoryMainID) "
                + " values (?,?) ";

        PreparedStatement statement = connection.prepareStatement(sql);
        try{
            statement.setString(1, dto.getName());
            statement.setInt(2, dto.getMainId());

            int rowCount = statement.executeUpdate();
        } finally{
            statement.close();
            connection.close();
        }
    }
    
    public boolean check(String name) throws SQLException, ClassNotFoundException{
        Connection connection = DBUtils.getConnection();
        String sql = "SELECT *  FROM " + table + " (WHERE CategoryItemName = ?";

        PreparedStatement statement = connection.prepareStatement(sql);
        try{


            statement.setString(1, name);

            ResultSet res = statement.executeQuery();
            if(!res.next()){
                return false;
            }
            
            return true;
        } finally{
            statement.close();
            connection.close();
        }
    }

    @Override
    public void create(JSONObject data) throws SQLException, ClassNotFoundException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
