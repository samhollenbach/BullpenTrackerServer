<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$pid = $db -> quote($_POST['pitcher_id']);
$type = $db -> quote($_POST['type']);
$team = $db -> quote($_POST['team']);
$result = $db -> query("INSERT INTO bullpens (pitcher_id, date, type, pitch_count, team) VALUES (" . $pid . ", CURRENT_DATE, " . $type . ", 0,". $team.")");
$result2 = $db -> query("UPDATE pitchers SET last_pen_id = (SELECT MAX(id) FROM bullpens) WHERE id = " . $pid . "");
$bid = $db -> select("SELECT MAX(id) AS bid FROM bullpens");
echo json_encode($bid);
?>
