/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package crawler;

import org.json.simple.JSONObject;

/**
 *
 * @author LUANNA
 */
public class ButtonClick {
    private String selector;
    private boolean hasMore;

    public ButtonClick() {
    }

    public ButtonClick(JSONObject dto){
        this.selector = (String) dto.get("selector");
        this.hasMore = (boolean) dto.get("hasMore");
    }
    
    public ButtonClick(String selector, boolean hasMore) {
        this.selector = selector;
        this.hasMore = hasMore;
    }

    public String getSelector() {
        return selector;
    }

    public void setSelector(String selector) {
        this.selector = selector;
    }

    public boolean isHasMore() {
        return hasMore;
    }

    public void setHasMore(boolean hasMore) {
        this.hasMore = hasMore;
    }
}
