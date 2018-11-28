<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$ta = $db -> quote($_POST['access_code']);
$tn = $db -> quote($_POST['team_name']);
$rows = $db -> select("SELECT * FROM team WHERE team_access_code = ".$ta. " AND team_name = ".$tn);
echo json_encode($rows);
?>
