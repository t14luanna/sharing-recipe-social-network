package dao;

import dto.StoreDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import utils.DBUtils;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author LUANNA
 */
public class StoreDAO {
    public void create(StoreDTO dto) throws SQLException, ClassNotFoundException{
        Connection connection = DBUtils.getConnection();
        String sql = "Insert into Store (Name, Address,BrandId) "
                + " values (?, ?, ?) ";

        PreparedStatement statement = connection.prepareStatement(sql);
        try{


            statement.setString(1, dto.getName());
            statement.setString(2, dto.getAddress());
            statement.setInt(3, dto.getBrandId());

            int rowCount = statement.executeUpdate();
        } finally{
            statement.close();
            connection.close();
        }

    }
}
