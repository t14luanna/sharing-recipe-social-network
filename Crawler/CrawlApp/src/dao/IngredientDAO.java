/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dao;

import dto.IngredientDTO;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.json.simple.JSONObject;
import utils.Constants;
import utils.DBUtils;

/**
 *
 * @author LUANNA
 */
public class IngredientDAO  implements IDAO<IngredientDTO>{
    private String table = Constants.TABLE_INGREDIENTS;

    public void create(IngredientDTO dto) throws SQLException, ClassNotFoundException{
        if(check(dto.getName())){
            return;
        }
        Connection connection = DBUtils.getConnection();
        String sql = "Insert into " + table + " (IngredientName) "
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
        String sql = "SELECT *  FROM " + table + " WHERE IngredientName = ?";

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
    
    public List<IngredientDTO> getAll() throws SQLException, ClassNotFoundException{
        List<IngredientDTO> list = new ArrayList<>();
        
        Connection connection = DBUtils.getConnection();
        String sql = "SELECT *  FROM " + table;

        PreparedStatement statement = connection.prepareStatement(sql);
        try{


            ResultSet res = statement.executeQuery();
            while(res.next()){
                int id = res.getInt("Id");
                String name = res.getString("IngredientName");
                list.add(new IngredientDTO(id, name));
            }
            
            return list;
        } finally{
            statement.close();
            connection.close();
        }
    }

    @Override
    public void create(JSONObject data) throws SQLException, ClassNotFoundException {
        IngredientDTO dto = new IngredientDTO();
        dto = (IngredientDTO) dto.parseFromJSON(data);
        create(dto);
    }
}
