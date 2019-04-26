/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dao;

import dto.CategoryMainDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import utils.DBUtils;

/**
 *
 * @author LUANNA
 */
public class CategoryMainDAO implements IDAO<CategoryMainDTO>{
    public void create(CategoryMainDTO dto) throws SQLException, ClassNotFoundException{
        if(check(dto.getName())){
            return;
        }
        Connection connection = DBUtils.getConnection();
        String sql = "Insert into CategoryMain (CategoryName) "
                + " values (?) ";

        PreparedStatement statement = connection.prepareStatement(sql);
        try{


            statement.setString(1, dto.getName());

            int rowCount = statement.executeUpdate();
        } finally{
            statement.close();
            connection.close();
        }
    }
    
    public boolean check(String name) throws SQLException, ClassNotFoundException{
        Connection connection = DBUtils.getConnection();
        String sql = "SELECT *  FROM CategoryMain WHERE CategoryName = ?";

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

    public int findOrCreate(CategoryMainDTO dto) throws SQLException, ClassNotFoundException{
        Connection connection = DBUtils.getConnection();
        String sql = "SELECT *  FROM CategoryMain WHERE CategoryName = ?";

        PreparedStatement statement = connection.prepareStatement(sql);
        try{


            statement.setString(1, dto.getName());

            ResultSet res = statement.executeQuery();
            if(res.next()){
                return res.getInt("Id");
            } else {
                create(dto);
                res = statement.executeQuery();
                return res.getInt("Id");
            }
        } finally{
            statement.close();
            connection.close();
        }
    }

}
