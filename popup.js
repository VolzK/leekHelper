$(function () {
    getData();
    //定时请求服务器
    setInterval(function () {
        getData()
    }, 10000);

    $("#updateText").click(() => {
        let updateStr = "";
        updateStr += "基金助手：2.2.3\n内容：\n";
        updateStr += "1.优化盈亏计算方法\n";
        updateStr += "基金助手：2.2.2\n内容：\n";
        updateStr += "1.优化盈亏计算方法\n";
        updateStr += "基金助手：2.2.1\n内容：\n";
        updateStr += "1.顶部表头全选框";
        updateStr += "基金助手：2.2.0\n内容：\n";
        updateStr += "1.添加更新说明\n";
        updateStr += "2.动态保存表头显示隐藏\n";
        updateStr += "3.加入份额\n";
        updateStr += "4.加入今日盈亏计算规则\n";
        alert(updateStr);
    })

    //读取文本域默认值
    chrome.extension.sendMessage({'action': 'list'}, function (resp) {
        var data = resp.data;
        var textStr = "";

        if (null == data || data.length == 0) {
            return;
        }

        for (let j = 0; j < data.length; j++) {

            if (j > 0) {
                textStr += "\n";
            }
            //代码:成本价
            textStr += data[j].code + ":" + data[j].cost;
            //份额
            if (null != data[j].portion && undefined != data[j].portion) {
                textStr += ":" + data[j].portion;
            }
        }

        $("#input_box").val(textStr);
    });

    $("#save_button").click(function () {
        var input_box = $("#input_box").val();

        if (input_box == null || input_box == "") {
            return;
        }

        var input_data = [];
        var input_string = input_box.split("\n");

        for (var index = 0; index < input_string.length; index++) {
            var strings = input_string[index];
            var item = strings.split(":");
            input_data.push({
                code: item[0],
                cost: item[1],
                portion: item[2]
            });
        }

        chrome.extension.sendMessage({'action': 'save', 'data': input_data}, function (resp) {
        });
        getData();
    });


    $("#allCheck").click(() => {
        const allCheck = $('#allCheck');
        const list = $('input:checkbox[name="select_click"]');
        for (let i = 0; i < list.length; i++) {
            list[i].checked = allCheck[0].checked;
        }
        const col_data = [];
        if (list.length <= 0) {
            return;
        }
        for (let i = 0; i < list.length; i++) {
            let col = list[i].dataset.col;
            if (list[i].checked === true) {
                $('#fund_table').bootstrapTable('showColumn', col);
            } else {
                $('#fund_table').bootstrapTable('hideColumn', col);
            }
            col_data.push({
                col: col,
                show: list[i].checked
            })
        }
        chrome.storage.local.set({'col_data': col_data});

    })

    $("input:checkbox[name='select_click']").click(() => {
        var list = $('input:checkbox[name="select_click"]');
        var col_data = []
        if (list.length <= 0) {
            return;
        }

        for (let i = 0; i < list.length; i++) {
            let col = list[i].dataset.col;
            console.log(list[i].checked)
            if (list[i].checked == true) {
                $('#fund_table').bootstrapTable('showColumn', col);
            } else {
                $('#fund_table').bootstrapTable('hideColumn', col);
            }
            col_data.push({
                col: col,
                show: list[i].checked
            })
        }

        chrome.storage.local.set({'col_data': col_data});
        //chrome.extension.sendMessage({'action': 'saveCol', 'data': col_data}, function (resp) {});
    })

});

function getData() {
    var codes = "";

    chrome.extension.sendMessage({'action': 'list'}, function (resp) {
        var data = resp.data;

        if (null == data || data.length == 0) {
            return;
        }

        for (let j = 0; j < data.length; j++) {

            if (j > 0) {
                codes += "_";
            }

            codes += data[j].code;
        }

        $.ajax({
            type: "GET",
            url: "http://fund.52sar.cn/getData?codes=" + codes,
            success: function (result) {
                var timeDom = $("#updateTime");
                timeDom.text("(" + result.Expansion.updateTime + "更新)");

                $('#fund_table').bootstrapTable({
                    striped: false,                      //是否显示行间隔色
                    cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: false,                   //是否显示分页（*）
                    sortable: true,                     //是否启用排序
                    sortOrder: "desc",                	//排序方式
                    search: false,
                    uniqueId: "FCODE",
                    columns: [
                        {
                            title: '代码',
                            field: 'FCODE',
                            align: 'left',
                            formatter: function (value, row, index) { // 处理该行数据
                                let FNAME = row.SHORTNAME;
                                // if (FNAME.length > 10) {
                                //     FNAME = FNAME.substring(0, 10)
                                // }
                                return value;
                            },
                            cellStyle: function (value, row, index) {
                                if (row.gszzl.indexOf("-") < 0) {
                                    return {css: {"color": "red"}}
                                } else {
                                    return {css: {"color": "green"}}
                                }
                            }
                        }, {
                            title: '基金',
                            field: 'FNAME',
                            align: 'left',
                            formatter: function (value, row, index) { // 处理该行数据
                                let FNAME = row.SHORTNAME;
                                // if (FNAME.length > 10) {
                                //     FNAME = FNAME.substring(0, 10)
                                // }
                                return FNAME;
                            },
                            cellStyle: function (value, row, index) {
                                if (row.gszzl.indexOf("-") < 0) {
                                    return {css: {"color": "red"}}
                                } else {
                                    return {css: {"color": "green"}}
                                }
                            }
                        },
                        {
                            title: '估值',
                            field: 'gsz',
                            align: 'left',
                            cellStyle: function (value, row, index) {
                                if (row.gszzl.indexOf("-") < 0) {
                                    return {css: {"color": "red"}}
                                } else {
                                    return {css: {"color": "green"}}
                                }
                            }
                        },
                        {
                            title: '涨跌',
                            field: 'gszzl',
                            align: 'left',
                            sortable: true,
                            formatter: function (value, row, index) { // 处理该行数据
                                if (value.indexOf("-") < 0) {
                                    value = '+' + value;
                                }
                                return value + "%";
                            },
                            cellStyle: function (value, row, index) {
                                if (row.gszzl.indexOf("-") < 0) {
                                    return {css: {"color": "red"}}
                                } else {
                                    return {css: {"color": "green"}}
                                }
                            }
                        },
                        {
                            title: '净值',
                            field: 'DWJZ',
                            align: 'left'
                        },
                        {
                            title: '成本',
                            field: 'cost',
                            align: 'left'
                        },
                        {
                            title: '差价',
                            field: 'costZDZ',
                            align: 'left',
                            sortable: true,
                            cellStyle: function (value, row, index) {
                                if (value.indexOf("-") < 0) {
                                    return {css: {"color": "red"}}
                                } else {
                                    return {css: {"color": "green"}}
                                }
                            }
                        },
                        {
                            title: '成本涨跌',
                            field: 'costZDF',
                            align: 'left',
                            sortable: true,
                            formatter: function (value, row, index) { // 处理该行数据
                                if (value.indexOf("-") < 0) {
                                    value = '+' + value;
                                }
                                return value + "%";
                            },
                            cellStyle: function (value, row, index) {
                                if (value.indexOf("-") < 0) {
                                    return {css: {"color": "red"}}
                                } else {
                                    return {css: {"color": "green"}}
                                }
                            }
                        },
                        {
                            title: '份额',
                            field: 'portion',
                            align: 'left',
                            sortable: true
                        },
                        {
                            title: '今日盈亏',
                            field: 'JRYK',
                            align: 'left',
                            sortable: true,
                            cellStyle: function (value, row, index) {
                                if (value.indexOf("-") < 0) {
                                    return {css: {"color": "red"}}
                                } else {
                                    return {css: {"color": "green"}}
                                }
                            }
                        }
                    ]

                });

                //数据计算，方便排序
                var listData = result.Data.KFS;
                let todayTotalCount = 0;
                let date = new Date();
                let time = date.toLocaleDateString().split('/').map(s => {
                    return s.length < 2 ? '0' + s : s
                }).join("-");
                for (let x = 0; x < listData.length; x++) {
                    let item = data.filter(item => {
                        return item.code == listData[x].FCODE;
                    })[0];
                    let cost = item.cost;
                    if (cost == undefined || cost == null || cost == "" || parseFloat(cost).toFixed(2) == 0.00) {
                        cost = listData[x].gsz
                    }
                    listData[x].cost = cost;
                    listData[x].portion = item.portion;

                    var reckon_count = (parseInt(listData[x].gsz * 10000) - parseInt(cost * 10000));
                    var costZDZ = (reckon_count / 10000).toFixed(4);
                    var costZDF = (reckon_count / parseInt(cost * 10000) * 100).toFixed(2);
                    listData[x].costZDZ = costZDZ;
                    listData[x].costZDF = costZDF;

                    listData[x].JRYK = (listData[x].DWJZ * item.portion * listData[x].gszzl / 100).toFixed(2);
                    /** listData[x].JRYK = (listData[x].RZDE * item.portion).toFixed(2);
                     //9.15集合竞价 - 15.00收盘
                     if ((Number(date.getHours()) == 9 && Number(date.getMinutes()) >= 15) || (Number(date.getHours()) > 9 && Number(date.getHours()) < 15)) {
                        listData[x].JRYK = (listData[x].DWJZ * item.portion * listData[x].gszzl / 100).toFixed(2);
                    } else if (Number(date.getHours()) >= 15) {
                        //15.00 - 24.00
                        if (time == listData[x].FSRQ) {

                        }
                    }
                     console.log(listData[x]);
                     */
                    todayTotalCount = todayTotalCount + Number(listData[x].JRYK);
                }

                if (String(todayTotalCount).indexOf('-') < 0) {
                    $('#todayTotalCount').css('color', 'red')
                } else {
                    $('#todayTotalCount').css('color', 'green')
                }
                $('#todayTotalCount').html(todayTotalCount.toFixed(2));
                $('#fund_table').bootstrapTable('load', listData);
                $('#fund_table').bootstrapTable('hideLoading');

                //设置列项显示默认值
                chrome.storage.local.get('col_data', function (items) {
                    //配置表项打勾
                    var list = $('input:checkbox[name="select_click"]');
                    var data = items.col_data;
                    if (null == data || data.length == 0) {
                        return;
                    }

                    for (let j = 0; j < data.length; j++) {
                        if (data[j].show == true) {
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].dataset.col == data[j].col) {
                                    list[i].checked = true;
                                }
                            }
                            $('#fund_table').bootstrapTable('showColumn', data[j].col);
                        } else {
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].dataset.col == data[j].col) {
                                    list[i].checked = false;
                                }
                            }
                            $('#fund_table').bootstrapTable('hideColumn', data[j].col);
                        }
                    }

                })
            },
            //请求失败，包含具体的错误信息
            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    });
}
