/* From http://www.nczonline.net/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing/ */

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}


var d = new Date();
d.setDate(d.getDate()-8);		// Past 7 days
var month = d.getMonth() + 1;
day = d.getDate();

var output = d.getFullYear() + '-' +
    (('' + month).length < 2 ? '0' : '') + month + '-' +
    (('' + day).length < 2 ? '0' : '') + day;
var yesterday = output + 'T00:00:00';

// See http://dev.socrata.com/docs/queries.html on SoQL Clauses

var request_property_violations = createCORSRequest("get", "http://data.kcmo.org/resource/nhtf-e75a.json?$where=case_opened > '" + yesterday + "'"); // $order=neighborhood");
if (request_property_violations) {
    request_property_violations.onload = function () {
        var data = JSON.parse(request_property_violations.responseText);
data.sort(function (a, b) {
  if (a.neighborhood > b.neighborhood) {
    return 1;
  }
  if (a.neighborhood < b.neighborhood) {
    return -1;
  }
  // a must be equal to b
  return 0;
});
//        console.dir(data);

	var last_neighborhood = '';
        var last_opened = '';
        var last_address = '';
        var closed = '';
        for (var i in data) {
            var row = '';
	    if ( last_neighborhood = '' 
            || ( last_neighborhood != data[i]['neighborhood'] && last_opened != data[i]['case_opened'])) {
               row += '<tr>';
               row += '<td colspan=5><b>' + data[i]['neighborhood'] + '</b> - ';
               row += data[i]['case_opened'].substring(0,10) + '</td>';
               row += '</tr>';
               $('#cases > tbody:last').append(row);
               row = '';
               last_neighborhood = data[i]['neighborhood'];
               last_opened = data[i]['case_opened'];
	    }
            row += '<tr>';
	    if ( last_address == '' || last_address != data[i]['address'] ) {
               row += '<td>&nbsp;&nbsp;&nbsp;&nbsp;' + data[i]['address'] + '</td>';
               last_address = data[i]['address'];
            } else {
               row += '<td>&nbsp;&nbsp;</td>';
//               row += '<td>x&nbsp;&nbsp;&nbsp;&nbsp;' + data[i]['address'] + '</td>';
            }
            row += '<td>' + data[i]['violation_description'] + '</td>';
            closed = data[i]['case_closed'];
console.log(closed);
            if ( typeof closed == 'undefined') {
		 closed = '' ; 
            } else {
                 closed = closed.substring(0,10);
            }
            row += '<td>' + closed + '</td>';
            row += '<td>' + data[i]['case_id'] + '</td>';
            row += '<td>' + data[i]['pin'] + '</td>';
            row += '</tr>';

            $('#cases > tbody:last').append(row);

        }
    };
    request_property_violations.send();
}



