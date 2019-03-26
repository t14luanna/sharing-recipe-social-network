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
                                        <li class="author"><a href="#">${collection.fullName}</a></li>
                                        <li><i class="fa fa-bookmark" aria-hidden="true"></i> ${collection.saveCount}</li>
                                    </ul>
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
        } else {
            count++;
            let element2 = createSingleCollectionElement(item);
            $("#recipe-listing-below").append(element2)
        }
    }
};