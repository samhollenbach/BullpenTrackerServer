<?php
/**
 * Created by PhpStorm.
 * User: samhollenbach
 * Date: 1/31/18
 * Time: 12:16 AM
 */
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$bid = $db -> quote($_POST['bullpen_id']);
$rows = $db -> select("SELECT * FROM pitches WHERE bullpen_id = ".$bid);
echo json_encode($rows);
?>
