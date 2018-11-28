<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$tid = $db -> quote($_POST['team_id']);
$p_email = $db -> quote($_POST['pitcher_email']);
$team_number = $db -> quote($_POST['number']);
$result = $db -> query("INSERT INTO team_player (team_id, pitcher_id, team_number) VALUES (" . $tid . ",  (SELECT id FROM pitchers WHERE email = ". $p_email . "), " . $team_number . ")");
echo $result;
?>
