<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$pid = $db -> quote($_POST['pitcher']);
$tid = $db -> quote($_POST['team']);
$rows = $db -> select("SELECT * FROM bullpens WHERE pitcher_id=".$pid." AND team=".$tid);
echo json_encode($rows);
?>
