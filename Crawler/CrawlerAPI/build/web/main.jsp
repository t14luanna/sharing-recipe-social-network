<%@page import="org.json.simple.JSONArray"%>
<%@page import="org.json.simple.parser.JSONParser"%>
<%@page import="org.json.simple.JSONObject"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Crawl Service</title>
        <link rel="stylesheet" type="text/css" href="css/main.css"/>
        <link rel="stylesheet" href="css/bootstrap.min.css">
    </head>
    <body>
        
        <div class="container">
            <h2>Crawler Service</h2>

            <ul class="nav nav-tabs" id="nav">
            </ul>

            <div class="tab-content" id="tab-content">
            </div>
        </div>
        
        <!--Script-->
        <c:import var="config" url="/META-INF/config.json"/>
        <%
            String json = (String) pageContext.getAttribute("config");
            JSONObject data = (JSONObject) (new JSONParser()).parse(json);
            JSONArray brands = (JSONArray) data.get("brands");
        %>
        
        <script src="js/jquery.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script type="text/javascript">
            var config = "<c:out value="<%=json%>"/>";
            var data;
            var brands;
            
            function createRow(title, value){
                var tbody = document.createElement("tbody");
                var tr = document.createElement("tr");
                var th = document.createElement("th");
                th.innerHTML = title;
                tr.append(th);
                var td = document.createElement("td");
                td.innerHTML = value;
                tr.append(td);
                tbody.append(tr);
                
                return tbody;
            }
            
            function createType(title, type){
                var div = document.createElement("div");
                
                var h4 = document.createElement("h4");
                h4.innerHTML = title;
                div.append(h4);
                
                return div;
            }
            
            window.onload = () => {
                config = config.replace(/&#034;/g,'"');
                config = config.replace(/&#039;/g,"'");
                data = JSON.parse(config);
                brands = data.brands;
                
                var nav = document.getElementById("nav");
                var tabContent = document.getElementById("tab-content");
                brands.forEach((brand,i) => {
                    //nav
                    var li = document.createElement("li");
                    
                    if(i === 0){
                        li.setAttribute("class","active");
                    }
                    
                    var a = document.createElement("a");
                    a.setAttribute("data-toggle","tab");
                    a.setAttribute("href","#" + brand.id);
                    a.innerHTML = brand.title;
                    li.append(a);
                    
                    nav.append(li);
                    
                    //content
                    var contentDiv = document.createElement("div");
                    contentDiv.setAttribute("id", brand.id);
                    if(i === 0){
                        contentDiv.setAttribute("class", "tab-pane fade in active");
                    } else {
                        contentDiv.setAttribute("class", "tab-pane fade");
                    }
                    
                    var table = document.createElement("table");
                    table.setAttribute("class","table");
                                        
                    table.append(createRow("Id", brand.id));
                    table.append(createRow("Title", brand.title));
                    contentDiv.append(table);
                    
                    tabContent.append(contentDiv);
                })
            };
        </script>
    </body>
</html>
