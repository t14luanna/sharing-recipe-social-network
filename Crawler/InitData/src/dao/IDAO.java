/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dao;

import dto.IDTO;
import java.sql.SQLException;

/**
 *
 * @author LUANNA
 */
public interface IDAO <T extends IDTO> {
    public abstract boolean check(String name) throws SQLException, ClassNotFoundException;
    public abstract void create(T dto) throws SQLException, ClassNotFoundException;
}
