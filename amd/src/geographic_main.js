 /**
 * Load and save geographic information
 * @module amd/src/geographic_main
 * @author Jhonier Andrés Calero Rodas
 * @author Jorge Eduardo Mayor Fernández
 * @copyright  2018 Jhonier A. Calero <jhonier.calero@correounivalle.edu.co>
 * @copyright  2019 Jorge Eduardo Mayor <mayor.jorge@correounivalle.edu.co>
 * @license  http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */ 

define(['jquery', 'block_ases/bootstrap', 'block_ases/sweetalert', 'block_ases/jqueryui', 'block_ases/student_profile_main'], function($, bootstrap, sweetalert, jqueryui, student_profile) {

    return {

        init: function(){
            
            var id_ases = $('#id_ases').val();
            var student_marker;

            load_geographic_info();

            /**
             * Executes the method search_direction() by pressing the button search.
             */
            $("#button_search_geographic").click(function () {
                search_direction();
            });

            /**
             * Executes the method search_direction() by pressing the enter key.
             */
            $("#geographic_direccion").keypress(function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13') {
                    search_direction();
                }
            });

            $('#button_edit_geographic').on('click', function(){
                $('#button_edit_geographic').attr('hidden', true);
                $('#div_save_buttons').removeAttr('hidden');
                $('#select_neighborhood').removeAttr('disabled');
                $('#select_geographic_risk').removeAttr('disabled');
                $('#latitude').removeAttr('disabled');
                $('#longitude').removeAttr('disabled');
                $('#geographic_direccion').removeAttr('disabled');
                $('#button_search_geographic').removeAttr('hidden');
                $('#geographic_ciudad').removeAttr('disabled');
                $('#geographic_checkbox_vive_lejos').removeAttr('disabled');
                $('#geographic_checkbox_zona_riesgo').removeAttr('disabled');
                $('#nivel_bajo').removeAttr('disabled');
                $('#nivel_medio').removeAttr('disabled');
                $('#nivel_alto').removeAttr('disabled');
                $('#geographic_text_area').removeAttr('disabled');

                var latitude = $('#latitude').val();
                var longitude = $('#longitude').val();
                student_marker = student_profile.edit_map(latitude, longitude);
            });

            $('#button_cancel_geographic').on('click', function(){
                $('#button_edit_geographic').removeAttr('hidden');
                $('#div_save_buttons').attr('hidden', true);
                $('#select_neighborhood').attr('disabled', true);
                $('#select_geographic_risk').attr('disabled', true);
                $('#latitude').attr('disabled', true);
                $('#longitude').attr('disabled', true);
                $('#geographic_direccion').attr('disabled', true);
                $('#button_search_geographic').attr('hidden', true);
                $('#geographic_ciudad').attr('disabled', true);
                $('#geographic_checkbox_vive_lejos').attr('disabled', true);
                $('#geographic_checkbox_zona_riesgo').attr('disabled', true);
                $('#nivel_bajo').attr('disabled', true);
                $('#nivel_medio').attr('disabled', true);
                $('#nivel_alto').attr('disabled', true);
                $('#inmigrante').attr('disabled', true);
                $('#geographic_text_area').attr('disabled', true);

                var ciudad_est = document.getElementById('geographic_ciudad').value;
                var latitude = $('#latitude').val();
                var longitude = $('#longitude').val();

                if (ciudad_est == 1079) {

                    document.getElementById('mapa').innerHTML = "<iframe class='col-xs-12 col-sm-12 col-md-12 col-lg-12' height='396' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/directions?key=AIzaSyAoE-aPVfruphY4V4BbE8Gdwi93x-5tBTM&origin=" + latitude + "," + longitude + "&destination=3.3759493,-76.5355789&mode=transit'></iframe>";

                } else {

                    document.getElementById('mapa').innerHTML = "<iframe class='col-xs-12 col-sm-12 col-md-12 col-lg-12' height='396' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/directions?key=AIzaSyAoE-aPVfruphY4V4BbE8Gdwi93x-5tBTM&origin=" + latitude + "," + longitude + "&destination=3.3759493,-76.5355789&mode=driving'></iframe>";
                }
            });

            $('#button_save_geographic').on('click', function(){

                var latitude = $('#latitude').val();
                var longitude = $('#longitude').val();
                var address = $('#geographic_direccion').val();
                var city = $('#geographic_ciudad').val();
                var duration = 0;
                var distance = 0;
                var mode;
                document.getElementById('direccion_res').value = address;
                document.getElementById('municipio_act').value = city;
                
                var ciudad = document.getElementById("geographic_ciudad");
                var selectedCity = ciudad.options[ciudad.selectedIndex].text;
                var query = address + " " + selectedCity;

                var request = {
                    query: query,
                    fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
                };

                var destination;
                var map = document.getElementById('mapa');
                var directionsService = new google.maps.DirectionsService();
                service = new google.maps.places.PlacesService(map);
                service.findPlaceFromQuery(request, callback);
                
                function callback(results) {

                    if (results != null) {
                        destination = results[0];
                    }
                }

                /**
                 * Sets the latitude and longitude due to the changes on the
                 * google map.
                 */
                if (destination != null) {
                    latitude = destination.geometry.location.lat();
                    longitude = destination.geometry.location.lng();                    
                } else {
                    latitude = student_marker.getPosition().lat();
                    longitude = student_marker.getPosition().lng();
                }

                document.getElementById('latitude').value = latitude;
                document.getElementById('longitude').value = longitude;

                var latLng_estudiante = new google.maps.LatLng(latitude, longitude);
                var latLng_univalle = new google.maps.LatLng(3.3759493, -76.5355789);
                
                /**
                 * Repaints the map after editing the student's marker.
                 * DO NOT delete the variable 'mapa'.
                 */
                if(city == 1079){
                    var mapa = document.getElementById('mapa').outerHTML;
                    document.getElementById('geographic_map').innerHTML = mapa;
                    document.getElementById('mapa').innerHTML = "<iframe class='col-xs-12 col-sm-12 col-md-12 col-lg-12' height='396' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/directions?key=AIzaSyAoE-aPVfruphY4V4BbE8Gdwi93x-5tBTM&origin=" + latitude + "," + longitude + "&destination=3.3759493,-76.5355789&mode=transit'></iframe>";
                    mode='TRANSIT';
                } else {
                    var mapa = document.getElementById('mapa').outerHTML;
                    document.getElementById('geographic_map').innerHTML = mapa;
                    document.getElementById('mapa').innerHTML = "<iframe class='col-xs-12 col-sm-12 col-md-12 col-lg-12' height='396' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/directions?key=AIzaSyAoE-aPVfruphY4V4BbE8Gdwi93x-5tBTM&origin=" + latitude + "," + longitude + "&destination=3.3759493,-76.5355789&mode=driving' allowfullscreen></iframe>";
                    mode = 'DRIVING';
                }

                //Instancies a route.
                var route_request = {
                    origin: latLng_estudiante, 
                    destination: latLng_univalle,
                    travelMode: mode
                };

                //Calculates the distance and the duration due to the specified route.
                directionsService.route(route_request, function(response, status) {

                    var legs = response.routes[0].legs[0];

                    distance = legs.distance.value;
                    duration = legs.duration.value;
                    save_geographic_info(id_ases, latitude, longitude, duration, distance, address, city);
                    
                });
            });

            /**
             * @method search_direction
             * @desc Searches the specified address in '#geographic_direccion' and sets the stundent's marker there.
             * @return {void}
             */
            function search_direction () {
                var geocoder = new google.maps.Geocoder();
                var select = document.getElementById('geographic_ciudad');
                var input_address = $('#geographic_direccion').val() + " " + select.options[select.selectedIndex].text + " " + "Colombia";
                geocoder.geocode({
                    "address": input_address
                }, function(results) {
                    if (results[0]) {
                        var latitud = results[0].geometry.location.lat();
                        var longitud = results[0].geometry.location.lng();
                        student_marker = student_profile.edit_map(latitud, longitud);
                        document.getElementById('latitude').value = latitud;
                        document.getElementById('longitude').value = longitud;
                        console.log("Dirección: " + results[0].formatted_address + " Coordenadas: " + results[0].geometry.location);
                    } else {
                        console.log("No se encontraron resultados");
                    }
                });
            }

            /**
             * @method load_geographic_info
             * @desc Loads all geographic info of a student given his id. Current processing on geographic_serverproc.php
             * @param {id} id_ases ASES student id
             * @return {void}
             */
            function load_geographic_info(id_ases){
                $.ajax({
                    type: "POST",
                    data: {
                        func: 'load_geographic_info',
                        id_ases: id_ases
                    },
                    url: "../managers/student_profile/geographic_serverproc.php",
                    success: function(msg) {

                        // var data = JSON.parse(msg.info);

                        // var vive_lejos = data.vive_lejos;
                        // var vive_zona_riesgo = data.vive_zona_riesgo;
                        // var nativo = data.nativo;
                        // var nivel_riesgo = data.nivel_riesgo;
                        // var observaciones = data.observaciones;

                        // document.getElementById("vive_lejos").checked = (vive_lejos)?true:false;
                        // //$("#vive_lejos").prop("checked", vive_zona_riesgo);

                         console.log("msg.text");
                    },
                    dataType: "json", //Json format
                    cache: "false",
                    error: function(msg) {
                        console.log("msg");
                    }
                });
            }

            /**
             * @method save_geographic_info
             * @desc Saves a student geographic information. Current processing on geographic_serverproc.php
             * @param {integer} id_ases ASES student id
             * @param {float} latitude latitude coordenate
             * @param {float} longitude longitude coordenate
             * @param {id} duration 
             * @param {id} distance 
             * @param {id} address current student's residencial address
             * @param {id} city current student's residencial city
             */
            function save_geographic_info(id_ases, latitude, longitude, duration, distance, address, city){
                
                var neighborhood = $('#select_neighborhood').val();
                var geographic_risk = $('#select_geographic_risk').val();
                var observaciones = $('#geographic_text_area').val();
                var vive_lejos = $('#geographic_checkbox_vive_lejos').prop("checked");
                var vive_zona_riesgo = $('#geographic_checkbox_zona_riesgo').prop("checked");
                var nativo = $('input[name=geographic_origen]:checked').val();
                var nivel_riesgo = $('input[name=geographic_nivel_riesgo]:checked').val();

                console.log(id_ases+"\n");

                $.ajax({
                    type: "POST",
                    data: JSON.stringify({
                        "func": 'save_geographic_info',
                        "params": [id_ases, latitude, longitude, neighborhood,
                                    duration, distance, address, city,
                                    observaciones, vive_lejos, vive_zona_riesgo,
                                    nativo, nivel_riesgo],
                        /*
                        id_ases: id_ases,
                        latitude: latitude,
                        longitude: longitude,
                        neighborhood: neighborhood,
                        geographic_risk: geographic_risk,
                        duration: duration,
                        distance: distance,
                        address: address,
                        city: city,
                        observaciones: observaciones,
                        vive_lejos: vive_lejos,
                        vive_zona_riesgo: vive_zona_riesgo,
                        nativo: nativo,
                        nivel_riesgo: nivel_riesgo*/
                    }),
                    url: "../managers/student_profile/geographic_api.php",
                    success: function(msg) {
                        if(msg.status_code == 0) {
                            swal(
                                msg.title,
                                msg.text,
                                msg.type);
                        } else {
                            console.log(msg);
                        }
                        
                        $('#button_edit_geographic').removeAttr('hidden');
                        $('#div_save_buttons').attr('hidden', true);
                        $('#select_neighborhood').attr('disabled', true);
                        $('#select_geographic_risk').attr('disabled', true);
                        $('#latitude').attr('disabled', true);
                        $('#longitude').attr('disabled', true);
                        $('#geographic_direccion').attr('disabled', true);
                        $('#button_search_geographic').attr('hidden', true);
                        $('#geographic_ciudad').attr('disabled', true);
                        $('#geographic_checkbox_vive_lejos').attr('disabled', true);
                        $('#geographic_checkbox_zona_riesgo').attr('disabled', true);
                        $('#nivel_bajo').attr('disabled', true);
                        $('#nivel_medio').attr('disabled', true);
                        $('#nivel_alto').attr('disabled', true);
                        $('#geographic_text_area').attr('disabled', true);
                    },
                    dataType: "json",
                    cache: "false",
                    error: function(msg) {
                        console.log(msg);
                    }
                });
            }
        }
    }
})