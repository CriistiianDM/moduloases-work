<?php
/**
 * @package		block_ases
 * @subpackage	core.security
 * @author 		Jeison Cardona Gómez
 * @copyright 	(C) 2019 Jeison Cardona Gómez <jeison.cardona@correounivalle.edu.co>
 * @license   	http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


$version = 1; //Current version

require_once( __DIR__ . "/../../../../config.php");
require_once( __DIR__ . "/v" . $version . "/entrypoint.php");

function secure_call( $function_name, $args = [], $alias ){ return make_call( $function_name, $args ); };
//function clear_cache(){	return clear_cache( $function_name, $args ); };

$alias = "say_hello";
function hello_world( $times = 3 ){ 
	for ($i = 0 ; $i < $times; $i++) {
		echo "Hello World!\n";
	}
};

secure_call("hello_world", [3], $alias);

hello_world(14);

?>