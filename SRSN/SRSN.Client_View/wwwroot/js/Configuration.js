window.SRSN = window.SRSN || {};

var BASE_API_URL = "http://localhost:44361";
var RECIPE_API_URL = "api/recipe";
var ACCOUNT_API_URL = "api/account";
var CATEGORY_API_URL = "api/category";
var COLLECTION_API_URL = "api/collection";
var COLLECTION_POST_API_URL = "api/collectionpost";
var COMMENT_API_URL = "api/comment";
var INGREDIENTS_API_URL = "api/ingredients";
var LIKE_POST_API_URL = "api/likepost";
var NOTIFICATION_API_URL = "api/notification";
var POST_API_URL = "api/post";
var PRODUCT_API_URL = "api/product";
var RATING_RECIPE_API_URL = "api/ratingrecipe";
var RECIPE_API_URL = "api/recipe";
var RECIPE_INGREDIENT_API_URL = "api/recipeingredient";
var STEPS_OF_RECIPE_API_URL = "api/stepsofrecipe";
var USER_BLOCK_API_URL = "api/userblock";
var USER_FOLLOWING_API_URL = "api/userfollowing";
var USER_REACTION_RECIPE_API_URL = "api/userreactionrecipe";
var USER_REPORT_USER = "api/userreportuser";

var GOOGLE_API_KEY = "AIzaSyBzgvkqSdA28vGw5qvqgJdPp-3_8YEBzFo";
var RECIPE_LEVEL_ENUM = ["", "Dễ", "Trung bình", "Khó"];


var _firebaseConfig = {
    apiKey: "AIzaSyAD2Vqg-rHzg9WJee0Yh0VGH_i_5BQT61E",
    authDomain: "srsnproject.firebaseapp.com",
    databaseURL: "https://srsnproject.firebaseio.com",
    projectId: "srsnproject",
    storageBucket: "srsnproject.appspot.com",
    messagingSenderId: "237911674213"
};

firebase.initializeApp(_firebaseConfig);

SRSN.FIREBASE_DATABASE = SRSN.FIREBASE_DATABASE || {};
SRSN.FIREBASE_DATABASE = firebase.database();
