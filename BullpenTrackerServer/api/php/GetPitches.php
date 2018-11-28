<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$bullpen_id = $db -> quote($_POST['bullpen_id']);
$rows = $db -> select("SELECT * FROM pitches WHERE bullpen_id = '$bullpen_id'");
echo json_encode($rows);
?>
