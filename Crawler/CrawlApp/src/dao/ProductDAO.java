/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dao;

import dto.IDTO;
import dto.ProductDTO;
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
public class ProductDAO implements IDAO<ProductDTO>{
    private String table = Constants.TABLE_PRODUCT;

    public void create(ProductDTO dto) throws SQLException, ClassNotFoundException{        
        if(check(dto.getName())){
            return;
        }
        Connection connection = DBUtils.getConnection();
        String sql = "Insert into " + table + " (Name, Price, ImageUrl,BrandId) "
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
    
    public boolean check(String name) throws SQLException, ClassNotFoundException{
        Connection connection = DBUtils.getConnection();
        String sql = "SELECT *  FROM " + table + " WHERE Name = ?";

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
        ProductDTO dto = new ProductDTO();
        dto = (ProductDTO) dto.parseFromJSON(data);
        create(dto);
    }
}