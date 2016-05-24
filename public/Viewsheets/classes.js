$(document).ready(function() {

    $.get('areas.json').done(function(data) {
        var areas = data.features;
        for (var i = 0; i < areas.length; i++) {
            $(".area-list").append("<option>" + areas[i].properties.name + "</option>")
        }
    })
    var json = localStorage.getItem('routes')
    var localData;
    if (json) {
        localData = JSON.parse(json)
    }
    $.each(localData, function(key, value) {
        $(".area-list").append("<option>" + value.area + "</option>")
        $('.area-list').change(function() {
            var selected = $('.area-list option:selected').text();

            if (selected == value.area) {

                $('#pop-up').append('<p>' + 'Route Name:' + " " + value.routeName + '</p><br>' + '<p>' + 'Beta:' + " " + value.beta + '</p><br>' + 'Grade:' + " " + value.grade + '</p>')
                $('#pop-up').show()
                $('#close').show()

            } else {
                alert('Must add routes to area')
            }
            $('#close').click(function() {
                $('#pop-up').empty();
                $('#pop-up').hide();
                $('#close').hide();
            })
            console.log(selected)
        })

    })



    //Local Storage
    function getRoutes() {
        var routes = localStorage.getItem('routes')
        if (routes) {
            return JSON.parse(routes)
        } else {
            return []
        }
    }

    function addRoute(route) {
        var routes = getRoutes()
        routes.push(route)
        var jsonStrR = JSON.stringify(routes)
        localStorage.setItem('routes', jsonStrR)
    }

})
