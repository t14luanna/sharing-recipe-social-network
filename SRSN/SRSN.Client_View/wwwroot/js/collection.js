const createSingleCollectionElement = (collection) =>
    `<div class="listing">
                            <div class="image">
                                <a href="#">
                                    <img src="${collection.coverImage}" alt="image" />
                                </a>
                            </div>
                            <div class="detail">
                                <h4><a href="#">${collection.collectionName}</a></h4>
                                <div class="meta-listing">
                                    <ul class="post-meta">
                                        <li class="author"><a href="#">${collection.fullName}</a></li>
                                        <li><i class="fa fa-bookmark" aria-hidden="true"></i> ${collection.saveCount}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>`;

const callPopularCollectionPageApi = async () => {
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}/read-top-collection`);
    var data = await res.json();
   
    for (var item of data) {
        count++;
        var noImgUrl = '/recipepress/images/no-image-icon-15.png'
        var image = item.coverImage != null ? item.coverImage : noImgUrl;
        item.coverImage = image;
        let element = createSingleCollectionElement(item);
        $("#recipe-listing-above").append(element);
    }
};