const readTopTenUser = (account) =>
    `<li>
                        <div class="single-chef">
                            <a href="#"><img src="recipepress/images/temp-images/chef-team1.jpg" alt="team" /></a>
                            <div class="chef-detail">
                                <div class="chef-detail-inner">
                                    <h4>${account.FirstName}</h4>
                                    <span class="type">executive chef</span>
                                    <p>
                                        Nam ornare arcu turpis ne congues withCurabitur quis euismod ur.Nam ornare arcu turpis
                                    </p>
                                    <ul class="social-icons-chef">
                                        <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                                        <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                                        <li><a href="#"><i class="fa fa-linkedin"></i></a></li>
                                        <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>`

const callAccountApi = async () => {
    var response = await fetch("https://localhost:44361/api/account/get-top-ten");
    var data = await response.json();
    for (var var item of data) {
        let element = readPopularUser(item);
        $("#chef-team").append(element);
    }
}

$(document).ready(e) => {
    callAccountApi();
}