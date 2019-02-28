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
import utils.DBUtils;

/**
 *
 * @author LUANNA
 */
public class CategoryItemDAO {
    public static void create(CategoryItemDTO dto) throws SQLException, ClassNotFoundException{
        if(check(dto.getName())){
            return;
        }
        
        Connection connection = DBUtils.getConnection();
        String sql = "Insert into CategoryItem (CategoryItemName, CategoryMainID) "
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
    
    public static boolean check(String name) throws SQLException, ClassNotFoundException{
        Connection connection = DBUtils.getConnection();
        String sql = "SELECT *  FROM CategoryItem WHERE CategoryItemName = ?";

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
}
