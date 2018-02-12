<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.


/**
 * Talentos Pilos
 *
 * @author     Esteban Aguirre Martinez
 * @package    block_ases
 * @copyright  2017 Esteban Aguirre Martinez <estebanaguirre1997@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
 
// Standard GPL and phpdocs
require_once(__DIR__ . '/../../../config.php');
require_once($CFG->libdir.'/adminlib.php');
require_once('../managers/pilos_tracking/tracking_functions.php');
require_once('../managers/instance_management/instance_lib.php');
require_once ('../managers/permissions_management/permissions_lib.php');
require_once ('../managers/role_management/role_management_lib.php');

require_once ('../managers/validate_profile_action.php');
require_once ('../managers/menu_options.php');

require_once ('../managers/lib/student_lib.php');


include('../lib.php');
include("../classes/output/renderer.php");
include("../classes/output/report_trackings_page.php");

global $PAGE, $USER;

$title = "estudiantes";
$pagetitle = $title;
$courseid = required_param('courseid', PARAM_INT);
$blockid = required_param('instanceid', PARAM_INT);

require_login($courseid, false);


// Instance is consulted for its registration
if(!consult_instance($blockid)){
    header("Location: instance_configuration.php?courseid=$courseid&instanceid=$blockid");
}


$contextcourse = context_course::instance($courseid);
$contextblock =  context_block::instance($blockid);
$PAGE->set_context($contextcourse);


$url = new moodle_url("/blocks/ases/view/report_tackings.php",array('courseid' => $courseid, 'instanceid' => $blockid));


//Navigation setup
$coursenode = $PAGE->navigation->find($courseid, navigation_node::TYPE_COURSE);
$blocknode = navigation_node::create($title,$url, null, 'block', $blockid);
$coursenode->add_node($blocknode);
$blocknode->make_active();

//Menu items are created
$menu_option = create_menu_options($USER->id, $blockid, $courseid);

// Creates a class with information that'll be send to template
$data = 'data';
$data = new stdClass;

// Evaluates if user role has permissions assigned on this view
$actions = authenticate_user_view($USER->id, $blockid);
$data = $actions;
$data->menu = $menu_option;



//Getting role, username and email from current connected user

$userrole = get_id_rol($USER->id,$blockid);
$usernamerole= get_name_rol($userrole);
$username = $USER->username;
$email = $USER->email;

$seguimientotable ="";
$globalArregloPares = [];
$globalArregloGrupal =[];
$table="";
$table_periods="";

$periods = get_semesters();

// Getting last semester date range 
$intervalo_fechas[0] = reset($periods)->fecha_inicio;
$intervalo_fechas[1] =reset($periods)->fecha_fin;
$intervalo_fechas[2] =reset($periods)->id;


//organiza el select de periodos.
// Sort periods Select
$table_periods.=get_period_select($periods);

if($usernamerole=='monitor_ps'){

    //Obtener los estudiantes que tienen seguimiento en ese intervalo de fecha dado el monitor

    $monitor_id =$USER->id;
    $students_by_monitor=get_students_of_monitor($monitor_id,$blockid);
    $table_monitor="";



    foreach ($students_by_monitor as $student) {
        $student_code= get_user_moodle($student->id_estudiante);
        $panel .= "<div class='panel panel-default'>";
            $panel .= "<a data-toggle='collapse' class='student collapsed btn btn-danger btn-univalle btn-card collapsed' data-parent='#accordion_students' style='text-decoration:none' href='#student" .$student_code->username."'>";
            $panel .= "<div class='panel-heading heading_students_tracking'>";
            $panel .= "<h4 class='panel-title'>";
            $panel .= "$student_code->firstname $student_code->lastname";
            $panel .= "<span class='glyphicon glyphicon-chevron-left'></span>";
            $panel .= "</h4>"; //End panel-title
            $panel .= "</div>"; //End panel-heading
            $panel .= "</a>";

            $panel .= "<div id='student$student_code->username'  class='show collapse_v2 collapse' role='tabpanel' aria-labelledby='headingstudent$student_code->username' aria-expanded='true'>";
            $panel .= "<div class='panel-body'>";

            $panel .= "</div>"; // End panel-body
            $panel .= "</div>"; // End collapse
            $panel .= "</div>"; // End panel-collapse
    }

    $table.=$panel;


    
    // $array_peer_trackings_dphpforms = json_decode($array_peer_trackings_dphpforms);




    // All students from a monitor are retrieved in the instance and the array that will be transformed in toogle is sorted.
    $seguimientos = monitorUser($globalArregloPares,$globalArregloGrupal,$USER->id,0,$blockid,$userrole,$intervalo_fechas);
    //$table.=has_tracking($seguimientos);

}elseif($usernamerole=='practicante_ps'){


    
    // All students from a practicant (practicante) are retrieved in the instance and the array that will be transformed in toogle is sorted.
    $seguimientos =practicanteUser($globalArregloPares,$globalArregloGrupal,$USER->id,$blockid,$userrole,$intervalo_fechas);
    $table.=has_tracking($seguimientos);

}elseif($usernamerole=='profesional_ps'){


    
    // All students from a professional (profesional) are retrieved in the instance and the array that will be transformed in toogle is sorted.
    $seguimientos = profesionalUser($globalArregloPares,$globalArregloGrupal,$USER->id,$blockid,$userrole,$intervalo_fechas);
    $table.=has_tracking($seguimientos);

}elseif($usernamerole=='sistemas' or $username == "administrador" or $username == "sistemas1008" or $username == "Administrador"){

    //Gets all existent periods and roles containing "_ps"
    $roles = get_rol_ps();

    //Obtains the people who are in the last added semester in which their roles ended up with "_ps"
    $people = get_people_onsemester(reset($periods)->id,$roles,$blockid);


    //Sorts People 'select'
    $table_periods.=get_people_select($people);

}
$table_permissions=show_according_permissions($table,$actions);

$data->table_periods =$table_periods;
$data->table=$table_permissions;

$PAGE->requires->css('/blocks/ases/style/jqueryui.css', true);
$PAGE->requires->css('/blocks/ases/style/styles_pilos.css', true);
$PAGE->requires->css('/blocks/ases/style/bootstrap.min.css', true);
$PAGE->requires->css('/blocks/ases/style/sweetalert.css', true);
$PAGE->requires->css('/blocks/ases/style/sweetalert2.css', true);
$PAGE->requires->css('/blocks/ases/style/sugerenciaspilos.css', true);
$PAGE->requires->css('/blocks/ases/style/forms_pilos.css', true);
$PAGE->requires->css('/blocks/ases/style/c3.css', true);
$PAGE->requires->css('/blocks/ases/style/student_profile_risk_graph.css', true);
$PAGE->requires->css('/blocks/ases/js/select2/css/select2.css', true);
$PAGE->requires->css('/blocks/ases/style/side_menu_style.css', true);
//Pendiente para cambiar el idioma del nombre del archivo junto con la estructura de
//su nombramiento.
$PAGE->requires->css('/blocks/ases/style/creadorFormulario.css', true);

$PAGE->requires->js_call_amd('block_ases/pilos_tracking_main','init');
$PAGE->set_url($url);
$PAGE->set_title($title);

$output = $PAGE->get_renderer('block_ases');

echo $output->header();
$report_trackings_page = new \block_ases\output\report_trackings_page($data);
echo $output->render($report_trackings_page);
echo $output->footer();