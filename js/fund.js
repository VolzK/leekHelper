;(function () {
    var NOW_URL = window.location.href;
    var FAVOR_URL = "https://favor.fund.eastmoney.com";

    if (NOW_URL.indexOf(FAVOR_URL) != -1) {

        setTimeout(function () {
            showPosition();
        }, 2000);

    }

    /**
     * 展示持仓成本
     */
    function showPosition() {

        chrome.extension.sendMessage({'action': 'list'}, function (resp) {
            var data = {};
            
            if (resp.data) {
                data = resp.data;
            }
            
            var $cost_th = $('<th class="zf"> 持仓成本 </th>');
            var $earning_th = $('<th class="zf"> 单位收益 </th>');
            var $reckon_earning_th = $('<th class="zf"> 估算收益 </th>');
            $("table[class*=js-fundlist-table]>thead>tr>th:eq(4)")
                .after($reckon_earning_th)
                .after($earning_th)
                .after($cost_th);
        
            $("table[class*=js-fundlist-table]>tbody>tr").each(function() {
                var fundcode = $(this).attr("data-fundcode");
                var $now_price = $($(this).children("td").get(4));
                var $reckon_price = $($(this).children("td").get(2));
                var now_price = $now_price.attr("data-sortvalue");
                var reckon_price = $reckon_price.html();
                var price = data[fundcode];
                var cost_td = '<td class="zf">0.000</td>';
                var earning_td = '<td class="zf">0.000</td>';
                var reckon_earning_td = '<td class="zf">0.000</td>';
        
                if (price != undefined && price != null) {
                    var count = (parseInt(now_price * 10000) - parseInt(price * 10000)) / 10000;
                    var reckon_count = (parseInt(reckon_price * 10000) - parseInt(price * 10000)) / 10000;

                    cost_td = cost_td.replace("0.000", price);
        
                    if (count < 0) {
                        earning_td = '<td class="zf ep-green">0.000</td>';
        
                    } else if (count > 0) {
                        earning_td = '<td class="zf ep-red">0.000</td>';
                    }
        
                    earning_td  = earning_td.replace("0.000", count);

                    if (reckon_count < 0) {
                        reckon_earning_td = '<td class="zf ep-green">0.000</td>';
        
                    } else if (reckon_count > 0) {
                        reckon_earning_td = '<td class="zf ep-red">0.000</td>';
                    }
        
                    reckon_earning_td  = reckon_earning_td.replace("0.000", reckon_count);
                }
        
                var $cost_td = $(cost_td);
                var $earning_td = $(earning_td);
                var $reckon_earning_td = $(reckon_earning_td);
                $now_price
                    .after($reckon_earning_td)
                    .after($earning_td)
                    .after($cost_td);
            });

        });

    }

})();