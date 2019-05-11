/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package crawlapp;

import crawler.ButtonClick;
import crawler.Element;
import crawler.Root;
import dao.IDAO;
import dao.IngredientDAO;
import dto.IngredientDTO;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;
import utils.Constants;

/**
 *
 * @author LUANNA
 */
public class CrawlSitemap {

    private WebDriver driver;
    private String mainURL;
    private Root root;
    private JSONArray results;
    private IDAO dao;
    private List<IngredientDTO> listIngredients;

    public CrawlSitemap(IDAO dao) {
        this.driver = new ChromeDriver();
        this.dao = dao;
        IngredientDAO ingreDAO = new IngredientDAO();
        try {
            this.listIngredients = ingreDAO.getAll();
        } catch (SQLException ex) {
            Logger.getLogger(CrawlSitemap.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(CrawlSitemap.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void start(Root dto) {
        this.root = dto;
        this.results = new JSONArray();
        for (String url : this.root.getUrls()) {
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

    public void crawlElements(List<Element> elements) {
        JSONObject result = new JSONObject();
        String nextURL = null;
        for (Element element : elements) {

            //Script Before Crawl
            List<ButtonClick> beforeLoad = element.getBeforeLoad();
            if (beforeLoad.size() > 0) {
                for (ButtonClick buttonClickDTO : beforeLoad) {
                    boolean hasMore = buttonClickDTO.isHasMore();
                    do {
                        try {
                            WebElement moreBtn = this.driver.findElement(By.xpath(buttonClickDTO.getSelector()));
                            moreBtn.click();
                            while (!waitForJStoLoad());
                        } catch (Exception ex) {
                            hasMore = false;
                        }
                    } while (hasMore);
                }
            }

            //Crawl
            List<String> links = new ArrayList<>();
            if (element.getType().equals("link") && element.getElements().size() > 0) {
                List<WebElement> listResult = driver.findElements(By.xpath(element.getSelector()));
                listResult.forEach((WebElement e) -> {
                    String link;
                    try {
                        if (element.getValueSelector().length() > 0) {
                            link = e.getAttribute(element.getValueSelector());
                        } else {
                            link = e.getText();
                        }
                        if (link != null) {
                            links.add(link);
                        }
                    } catch (Exception err) {

                    }
                });
            } else if (element.getType().equals("group")) {
                List<WebElement> listResult = driver.findElements(By.xpath(element.getSelector()));
                listResult.forEach((WebElement e) -> {
                    JSONObject res = new JSONObject();
                    for (Element el : element.getElements()) {
                        if (el.getType().equals("default")) {
                            String data = el.getValueSelector();
                            res.put(el.getTitle(), data);
                        } else {
                            List<WebElement> listChild = e.findElements(By.xpath(el.getSelector()));
                            listChild.forEach((WebElement child) -> {
                                String data;
                                try {
                                    if (el.getValueSelector().length() > 0) {
                                        data = child.getAttribute(el.getValueSelector());
                                    } else {
                                        data = child.getText();
                                    }
                                    if (data != null) {
                                        res.put(el.getTitle(), data);
                                    }
                                } catch (Exception err) {

                                }
                            });
                        }
                    }
                    results.add(res);
                    if (results.size() == Constants.MAX_SIZE) {
                        save();
                    }
                });
            } else if (element.getType().equals("default")) {
                String data = element.getValueSelector();
                result.put(element.getTitle(), data);
            } else if (element.getType().equals("search")) {

                int storeBrandId = Integer.parseInt(element.getElements().get(2).getValueSelector());

                for (IngredientDTO ingredient : listIngredients) {
                    WebElement search = driver.findElement(By.xpath(element.getSelector()));
                    search.clear();
                    search.sendKeys(ingredient.getName());

                    Element button = element.getElements().get(0);
                    try {
                        WebElement moreBtn = this.driver.findElement(By.xpath(button.getSelector()));
                        moreBtn.click();
                        while (!waitForJStoLoad());
                    } catch (Exception ex) {
                    }

                    Element itemElement = element.getElements().get(1);
                    List<WebElement> item = driver.findElements(By.xpath(itemElement.getSelector()));

                    if (item.size() > 0) {
                        result.put("IngredientId", ingredient.getId());
                        result.put("StoreBrandId", storeBrandId);
                        this.results.add(result.clone());
                        result.clear();
                    }
                    
                    if(results.size() > Constants.MAX_SIZE){
                        save();
                    }
                }

                save();

                return;
            } else {
                List<WebElement> listResult = driver.findElements(By.xpath(element.getSelector()));
                listResult.forEach((WebElement e) -> {
                    String data;
                    try {
                        if (element.getValueSelector().length() > 0) {
                            data = e.getAttribute(element.getValueSelector());
                        } else {
                            data = e.getText();
                        }
                        if (data != null) {
                            result.put(element.getTitle(), data);
                        }
                    } catch (Exception err) {

                    }
                });
            }
            if (element.getNextPage() != null) {
                try {
                    WebElement nextPage = driver.findElement(By.xpath(element.getNextPage().getSelector()));
                    if (nextPage != null) {
                        String linkNextPage;
                        if (element.getValueSelector().length() > 0) {
                            linkNextPage = nextPage.getAttribute(element.getValueSelector());
                        } else {
                            linkNextPage = nextPage.getText();
                        }
                        if (linkNextPage != null) {
                            nextURL = linkNextPage;
                        }
                    }
                } catch (Exception e) {

                }
            }

            for (String link : links) {
                this.setMainURL(link);
                crawlElements(element.getElements());
            }
        }

        if (!result.isEmpty()) {
            this.results.add(result);
        }

        if (results.size() == Constants.MAX_SIZE) {
            save();
        }

        if (nextURL != null) {
            this.setMainURL(nextURL);
            crawlElements(elements);
        }
    }

    public void crawl() {
        if (this.root.getElements().size() > 0) {
            crawlElements(this.root.getElements());
            save();
        }
    }

    private boolean waitForJStoLoad() {
        WebDriverWait wait = new WebDriverWait(driver, 30);
        ExpectedCondition<Boolean> jQueryLoad = new ExpectedCondition<Boolean>() {
            @Override
            public Boolean apply(WebDriver driver) {
                try {
                    return ((Long) ((JavascriptExecutor) driver).executeScript("return jQuery.active") == 0);
                } catch (Exception e) {
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
        wait.until(jsLoad);
        return wait.until(jQueryLoad) && wait.until(jsLoad);
    }

    public void close() {
        this.driver.quit();
    }

    public JSONArray getResults() {
        return results;
    }

    public void save() {
        for (Iterator iterator = results.iterator(); iterator.hasNext();) {
            try {
                dao.create((JSONObject) iterator.next());
            } catch (SQLException ex) {
                Logger.getLogger(CrawlSitemap.class.getName()).log(Level.SEVERE, null, ex);
            } catch (ClassNotFoundException ex) {
                Logger.getLogger(CrawlSitemap.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        results = new JSONArray();
    }

}
