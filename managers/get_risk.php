<<<<<<< HEAD
<?php

require_once('query.php');

if(isset($_POST['id'])){
    
    $array = getRiskByStudent($_POST['id']);
    
    echo json_encode($array);
=======
<?php

require_once('query.php');

if(isset($_POST['id'])){
    
    $array = getRiskByStudent($_POST['id']);
    
    echo json_encode($array);
>>>>>>> db_management
}