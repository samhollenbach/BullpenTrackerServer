<?php
/**
 * Created by PhpStorm.
 * User: samhollenbach
 * Date: 1/30/18
 * Time: 5:31 PM
 */
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$b_id = $db -> quote($_POST['b_id']);
$max_ab = $db-> select("SELECT MAX(ab_id) as mab FROM atbats WHERE bullpen_id = ".$b_id.")");
echo json_encode($max_ab);
?>
