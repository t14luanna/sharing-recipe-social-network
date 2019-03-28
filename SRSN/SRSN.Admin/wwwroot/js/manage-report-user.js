const reportUserElement = (item) =>
    `<tr>
                                    <td>
                                        ${item.username}
                                    </td>
                                    <td>${item.reportedUsername}</td>
                                    <td>${item.description}</td>
                                    <td><i class="fa fa-check text-navy"></i> Đang hoạt động</td>
                                    <td>${item.createTime}</td>
                                    <td> <em class="fa fa-lock"></em> <em class="fa fa-unlock"></em></td>
                                </tr>`;
