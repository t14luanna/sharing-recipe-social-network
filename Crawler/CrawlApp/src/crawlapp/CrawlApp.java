/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package crawlapp;

import java.util.*;

/**
 *
 * @author LUANNA
 */
public class CrawlApp {

    /**
     * @param args the command line arguments
     */
    
    private static Crawler crawler;
        
    public static void main(String[] args) {
        crawler = new Crawler("config.json");
        Timer timer = new Timer();
  
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        Date time = calendar.getTime();

        timer.schedule(new CrawlTask(),time);
    }
    
    static class CrawlTask extends TimerTask {
      public void run() {
         crawler.crawlAll();
      }
   }
}
