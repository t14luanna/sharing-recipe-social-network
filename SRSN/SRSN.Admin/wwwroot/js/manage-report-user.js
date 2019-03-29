//const reportUserElement = (item, active, action) =>
//    `<tr role="row">
//                                    <td  class="sorting_1">
//                                        ${item.username}
//                                    </td>
//                                    <td>${item.reportedUsername}</td>
//                                    <td>${item.description}</td>
//                                    <td class="active-${item.reportedUserId}">${active}</td>
//                                    <td class="center">${item.createTime}</td>
//                                    <td class="icon-action icon-action-${item.reportedUserId} center" >${action} </td>
//                                </tr>`;
//<tr class="gradeA">
//    <td>Gecko</td>
//    <td>Firefox 1.5</td>
//    <td>Win 98+ / OSX.2+</td>
//    <td class="center">1.8</td>
//    <td class="center">A</td>
////</tr>
//function blockUserFunction(reportedUserId) {

//    swal({
//        title: "Bạn muốn chặn?",
//        text: "Sau khi chặn, người dùng sẽ không thể đăng nhập vào trang web nữa!",
//        icon: "warning",
//        buttons: true,
//        dangerMode: true,
//    })
//        .then((willDeactivate) => {
//            if (willDeactivate) {
//                blockUser(reportedUserId);
//            } else {
//                //do nothing
//            }
//        });

//}
//function unblockUserFunction(reportedUserId) {

//    blockUser(reportedUserId);
//}
//const blockUser = async (reportedUserId) => {
//    var res = await fetch(`${BASE_API_URL}/${ACCOUNT_API_URL}/update-activation?reportedUserId=${reportedUserId}`, {
//        method: "POST",
//        headers: {
//            'Content-Type': 'application/json'
//        }
//    });
//    var data = await res.json();
//    var iconAction = data.active ? `<a onclick="blockUserFunction(${reportedUserId})"><em class="fa fa-lock" title="Chặn người dùng"></em><a>` : `<a onclick="unblockUserFuntion(${reportedUserId})"><em class="fa fa-unlock" title="Bỏ chăn người dùng"></em></a>`;
//    var active = data.active ? `<i class="fa fa-check text-navy"></i> Đang hoạt động` : `<em class="fa fa-lock text-navy"></em> Bị chặn`;
//    if (data.active == true) {
//        //bỏ chặn người dùng
//        $(`.icon-action-${reportedUserId}`).html(iconAction);
//        $(`.active-${reportedUserId}`).html(active);
//    } else if (data.active == false) {
//        swal("Bạn đã chặn thành công người dùng này!", {
//            icon: "success",
//        });
//        $(`.icon-action-${reportedUserId}`).html(iconAction);
//        $(`.active-${reportedUserId}`).html(active);

//    } else {
//        swal("Bạn không thể chặn người dùng này!", {
//            icon: "error",
//        });
//    }

//};
//const refreshPage = async () => {
//    var res = await fetch(`${BASE_API_URL}/${USER_REPORT_USER_API_URL}/get-reported-user`);
//    var data = await res.json();
//    for (var item of data) {
//        var date = new Date(item.createTime);
//        var hr = date.getHours();
//        var min = date.getMinutes();
//        item.createTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + hr + ':' + min;
//        var active = item.active ? `<i class="fa fa-check text-navy"></i> Đang hoạt động` : `<em class="fa fa-lock text-navy"></em> Bị chặn`;
//        var action = item.active ? `<a onclick="blockUserFunction(${item.reportedUserId})"><em class="fa fa-lock" title="Chặn người dùng"></em><a>` : `<a onclick="unblockUserFunction(${item.reportedUserId})"><em class="fa fa-unlock" title="Bỏ chăn người dùng"></em></a>`;
        
//        $("#list-report").append(reportUserElement(item, active, action));
//    }
//}

