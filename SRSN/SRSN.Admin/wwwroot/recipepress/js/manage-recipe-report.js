/*var getAllRecipeReport = async () => {
    var res = await fetch(`${BASE_API_URL}/api/userreportrecipe/get-all-reported-recipe`);
    var data = await res.json();
    if (data && data.length > 0) {
        $('#list-report').empty();
        for (var item of data) {
            if (item.isActive) {
                var reportItem = reportRecipeElement(item);
                $('#list-report').append(reportItem);
            }
        }
    }
    $('.deactive').on('click', async function () {
        var id = $(this).siblings('input').val();
        var result = await fetch(`${BASE_API_URL}/api/userreportrecipe/deactive-report-recipe?id=${id}`);
        console.log(result.json());
        if (result.json()) {
            alert('Đã xử lý thành công');
            getAllRecipeReport();
        }
    });
};

const reportRecipeElement = (item) =>
    `<tr>
                                    <td>
                                        ${item.username}
                                    </td>
                                    <td>${item.recipeReported}</td>
                                    <td>${item.description}</td>
                                    <td><i class="fa fa-check text-navy"></i> Đang hoạt động</td>
                                    <td>${item.createTime}</td>
                                    <td class="deactive"> <em class="fa fa-lock" style="cursor: pointer"></em></td>
                                    <input type="hidden" value="${item.id}">
                                </tr>`;
                                */