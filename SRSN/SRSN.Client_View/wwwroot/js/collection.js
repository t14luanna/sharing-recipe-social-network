const createSingleCollectionElement = (collection) =>
    `<div class="listing custom-listing">
                            <div class="image">
                                <a href="/account/collection-detail/${collection.id}">
                                    <img src="${collection.coverImage}" alt="image" class="custome-image-listing" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';" alt="avatar"/>
                                </a>
                            </div>
                            <div class="detail">
                                <h4><a href="#">${collection.collectionName}</a></h4>
                                <div class="meta-listing">
                                    <ul class="post-meta">
                                        <li class="author"><a href="/account/timeline/${collection.username}">${collection.fullName}</a></li>
                                        <li><i class="fa fa-bookmark" aria-hidden="true"></i> ${collection.saveCount}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>`;
const createSingleOfDayCollectionElement = (collection) => `<img src="${collection.coverImage}" alt="Recipe of the day" onerror="if (this.src != '/recipepress/images/no-image-icon-15.png') this.src = '/recipepress/images/no-image-icon-15.png';" alt="avatar">
                            <div class="recipe-contents-outer">
                                <div class="recipe-contents text-center">
                                    <div class="recipe-content-inner">
                                        <span class="tag">Bộ sưu tập của hôm nay</span>
                                        <h2><a href="#">${collection.collectionName}</a></h2>
                                        <div class="short-separator"></div>
                                       <div class="meta-listing">
                                    <ul class="post-meta" style="margin-bottom:15px">
                                        <li class="author"><a href="/account/timeline/${collection.username}">${collection.fullName}</a></li>
                                        <li><i class="fa fa-bookmark" aria-hidden="true"></i> ${collection.saveCount}</li>
                                    </ul>
                                </div>
                                        <a class="read-more" href="/account/collection-detail/${collection.id}">Xem thêm</a>
                                    </div>
                                </div>
                            </div>`;
const callPopularCollectionPageApi = async () => {
    var res = await fetch(`${BASE_API_URL}/${COLLECTION_API_URL}/read-top-collection`);
    var data = await res.json();
    var count = 0;
    for (var item of data) {
        if (count < 6) {
            count++;
            let element1 = createSingleCollectionElement(item);
            $("#recipe-listing-above").append(element1);
        } else if (count == 6) {
            count++;
            let element3 = createSingleOfDayCollectionElement(item);
            $("#collection-of-day").append(element3);
        } else {
            count++;
            let element2 = createSingleCollectionElement(item);
            $("#recipe-listing-below").append(element2)
        }
    }
};