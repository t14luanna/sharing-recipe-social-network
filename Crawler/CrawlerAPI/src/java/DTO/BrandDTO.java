/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DTO;

/**
 *
 * @author LUANNA
 */
public class BrandDTO {
    private StoreDTO stores;
    private ProductDTO products;

    public BrandDTO() {
    }

    public BrandDTO(StoreDTO stores, ProductDTO products) {
        this.stores = stores;
        this.products = products;
    }

    public StoreDTO getStores() {
        return stores;
    }

    public ProductDTO getProducts() {
        return products;
    }
    
}
