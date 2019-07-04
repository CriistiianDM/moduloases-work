<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once (__DIR__ . '/../../../config.php');
require_once(__DIR__ . '/../classes/Programa.php');
require_once(__DIR__ . '/../classes/Facultad.php');
require_once(__DIR__ . '/../classes/Sede.php');
require_once(__DIR__ . '/../classes/Jornada.php');

$programa = new Programa();
$nombre_sede ='CALI';
$nombre_facultad = 'SALUD';
$programa->nombre = 'ESPECIALIZACIÓN EN MEDICINA FAMILIAR';
//@var Sede $sede
$sede = Sede::get_one_by(array(Sede::NOMBRE=>$nombre_sede));
//@var Facultad $facultad
$facultad = Facultad::get_one_by(array(Facultad::NOMBRE=>$nombre_facultad));
if(!$sede) die("No existe la sede con nombre $nombre_sede");
if(!$facultad) die("No existe la facultad con nombre $nombre_facultad");
$programa->id_sede = $sede->id;
$programa->jornada = Jornada::NOCTURNA;
$programa->id_facultad = $facultad->id;
$programa->cod_univalle = 5622;
$programa->codigosnies = 615;

if($programa->save()) {
    echo "El programa $programa->nombre se ha guardado";
} else {
    echo "No se ha podido guardar el programa $programa->nombre";
}

?>