<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$pid = $db -> quote($_POST['pitcher']);
$rows = $db -> select("SELECT * FROM bullpens WHERE pitcher_id=".$pid);
echo json_encode($rows);
?>
