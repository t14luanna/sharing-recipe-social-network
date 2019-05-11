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
        Connection connection = DBUtils.getConnection();
        String sql = "Insert into " + table + " (StoreBrandId, IngredientId) "
                + " values (?, ?) ";

        PreparedStatement statement = connection.prepareStatement(sql);
        try{


            statement.setInt(1, dto.getBrandId());
            statement.setInt(2, dto.getIngredientId());

            int rowCount = statement.executeUpdate();
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

    @Override
    public boolean check(String name) throws SQLException, ClassNotFoundException {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
