/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package data;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

/**
 *
 * @author LUANNA
 */
public class ElementDTO {
    private String title;
    private String type;
    private String selector;
    private String valueSelector;
    private List<ElementDTO> elements;
    private List<ButtonClickDTO> beforeLoad;
    private ElementDTO nextPage;

    public ElementDTO() {
    }
    
    public ElementDTO(JSONObject dto){
        this.title = (String) dto.get("title");
        this.type = (String) dto.get("type");
        this.selector = (String) dto.get("selector");
        this.valueSelector = (String) dto.get("value");
        this.elements = new ArrayList<ElementDTO>();
        
        JSONArray listElement = (JSONArray) dto.get("elements");
        if(listElement!= null && listElement.size() > 0){
            for (Iterator iterator = listElement.iterator(); iterator.hasNext();) {
                JSONObject element = (JSONObject) iterator.next();
                this.elements.add(new ElementDTO(element));
            }
        }
        
        this.beforeLoad = new ArrayList<ButtonClickDTO>();

        JSONArray btns = (JSONArray) dto.get("beforeLoad");
        if(btns!=null && btns.size() > 0){
            for (Iterator iterator = btns.iterator(); iterator.hasNext();) {
                JSONObject btn = (JSONObject) iterator.next();
                this.beforeLoad.add(new ButtonClickDTO(btn));
            }
        }
        
        JSONObject nextPage = (JSONObject) dto.get("nextPage");
        if(nextPage != null){
            this.nextPage = new ElementDTO(nextPage);
        }
    }

    public ElementDTO(String title, String type, String selector) {
        this.title = title;
        this.type = type;
        this.selector = selector;
    }

    public ElementDTO(String title, String type, String selector, String valueSelector, List<ElementDTO> elements, List<ButtonClickDTO> beforeLoad) {
        this.title = title;
        this.type = type;
        this.selector = selector;
        this.valueSelector = valueSelector;
        this.elements = elements;
        this.beforeLoad = beforeLoad;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSelector() {
        return selector;
    }

    public void setSelector(String selector) {
        this.selector = selector;
    }

    public List<ElementDTO> getElements() {
        return elements;
    }

    public void setElements(List<ElementDTO> elements) {
        this.elements = elements;
    }

    public String getValueSelector() {
        return valueSelector;
    }

    public void setValueSelector(String valueSelector) {
        this.valueSelector = valueSelector;
    }

    public List<ButtonClickDTO> getBeforeLoad() {
        return beforeLoad;
    }

    public void setBeforeLoad(List<ButtonClickDTO> beforeLoad) {
        this.beforeLoad = beforeLoad;
    }

    public ElementDTO getNextPage() {
        return nextPage;
    }

    public void setNextPage(ElementDTO nextPage) {
        this.nextPage = nextPage;
    }
    
}
