/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package crawlapp;

import data.CategoryDTO;
import data.ButtonClickDTO;
import data.ElementDTO;
import java.util.ArrayList;
import java.util.List;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 *
 * @author LUANNA
 */
public class Crawler {
    private WebDriver driver;
    private String mainURL;
    private CategoryDTO brand;
    private JSONArray results;

    public Crawler() {
        this.driver = new ChromeDriver();
    }
    
    public void start(CategoryDTO dto){
        this.brand = dto;
        this.results = new JSONArray();
        for (String url : this.brand.getUrls()) {
            this.setMainURL(url);
            crawl();
        }
    }

    public String getMainURL() {
        return mainURL;
    }

    public void setMainURL(String mainURL) {
        this.mainURL = mainURL;
        this.driver.get(mainURL);
    }

    public void crawlElements(List<ElementDTO> elements){
        JSONObject result = new JSONObject();
        String nextURL = null;
        for (ElementDTO element : elements) {
            
            //Script Before Crawl
            List<ButtonClickDTO> beforeLoad = element.getBeforeLoad();
            if(beforeLoad.size() > 0){
                for (ButtonClickDTO buttonClickDTO : beforeLoad) {
                    boolean hasMore = buttonClickDTO.isHasMore();
                    do{
                        try{
                            WebElement moreBtn = this.driver.findElement(By.xpath(buttonClickDTO.getSelector()));
                            moreBtn.click();
                            while(!waitForJStoLoad());
                        }catch(Exception ex){
                            hasMore = false;
                        }
                    }while(hasMore);
                }
            }
            
            //Crawl
            List<String> links = new ArrayList<>();
            List<WebElement> listResult = driver.findElements(By.xpath(element.getSelector()));
            if(element.getType().equals("link") && element.getElements().size() > 0){
                listResult.forEach((WebElement e) -> {
                    String link;
                    try{
                        if(element.getValueSelector().length() > 0){
                            link = e.getAttribute(element.getValueSelector());
                        } else {
                            link = e.getText();
                        }
                        if(link != null){
                            links.add(link);
                        }
                    } catch(Exception err){
                        
                    }
                });                                
            } else {
                listResult.forEach((WebElement e) -> {                                        
                    String data;
                    try{
                        if(element.getValueSelector().length() > 0){
                            data = e.getAttribute(element.getValueSelector());
                        } else {
                            data = e.getText();
                        }
                        if(data != null){
                            result.put(element.getTitle(), data);
                        }
                    } catch(Exception err){
                        
                    }
                });
            }
            if(element.getNextPage() != null){
                try{
                    WebElement nextPage = driver.findElement(By.xpath(element.getNextPage().getSelector()));
                    if(nextPage != null){
                        String linkNextPage;
                        if(element.getValueSelector().length() > 0){
                            linkNextPage = nextPage.getAttribute(element.getValueSelector());
                        } else {
                            linkNextPage = nextPage.getText();
                        }
                        if(linkNextPage != null){
                            nextURL = linkNextPage;
                        }
                    }
                } catch(Exception e){
                    
                }
            }

            for (String link : links) {
                this.setMainURL(link);
                crawlElements(element.getElements());                    
            }                       
        }
        
        this.results.add(result);
        
        if(nextURL != null){
            this.setMainURL(nextURL);
            crawlElements(elements);
        }
    }
    
    public void crawl(){
        if(this.brand.getElements().size() > 0){
            crawlElements(this.brand.getElements());
        }
    }
    
    private boolean waitForJStoLoad(){
        WebDriverWait wait = new WebDriverWait(driver, 30);
        
        ExpectedCondition<Boolean> jQueryLoad = new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver driver) {
                try{
                    return ((Long) ((JavascriptExecutor) driver).executeScript("return jQuery.active") == 0);
                } catch(Exception e){
                    return true;
                }
            }
        };
        
        ExpectedCondition<Boolean> jsLoad = new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver driver) {
                return ((JavascriptExecutor) driver).executeScript("return document.readyState").toString().equals("complete");
            }
        };
        
        return wait.until(jQueryLoad) && wait.until(jsLoad);
    }
    
    public void close(){
        this.driver.quit();
    }

    public JSONArray getResults() {
        return results;
    }

}
