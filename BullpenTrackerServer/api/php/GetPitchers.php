<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$tid = $db -> quote($_POST['team_id']);
$rows = $db -> select("SELECT * FROM (SELECT pitcher_id, team_number FROM team_player WHERE team_id = ".$tid.") AS A JOIN (SELECT firstname, lastname, id, email, throws FROM pitchers) AS B ON (A.pitcher_id = B.id)");
echo json_encode($rows);
?>
