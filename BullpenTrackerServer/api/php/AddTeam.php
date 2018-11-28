<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$ta = $db -> quote($_POST['team_access']);
$tn = $db -> quote($_POST['team_name']);
$ti = $db -> quote($_POST['team_info']);
$result = $db -> query("INSERT INTO team (team_access_code, team_name, team_info) VALUES (". $ta . ", " . $tn . ", ". $ti . ")");
echo $result;
?>
