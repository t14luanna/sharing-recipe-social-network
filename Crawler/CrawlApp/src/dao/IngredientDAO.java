/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dao;

import dto.IngredientDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import utils.DBUtils;

/**
 *
 * @author LUANNA
 */
public class IngredientDAO {
    public void create(IngredientDTO dto) throws SQLException, ClassNotFoundException{
        Connection connection = DBUtils.getConnection();
        String sql = "Insert into Ingredient (Name, Price, Image,BrandId) "
                + " values (?, ?, ?, ?) ";

        PreparedStatement statement = connection.prepareStatement(sql);
        try{


            statement.setString(1, dto.getName());
            statement.setString(2, dto.getPrice());
            statement.setString(3, dto.getImage());
            statement.setInt(4, dto.getBrandId());

            int rowCount = statement.executeUpdate();
        } finally{
            statement.close();
            connection.close();
        }

    }
}
