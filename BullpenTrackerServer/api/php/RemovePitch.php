<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$id = $db -> quote($_POST['id']);
$bullpen_id = $db -> quote($_POST['bullpen_id']);
$result = $db -> query("DELETE FROM pitches WHERE id=" . $id . "");
$result2 = $db -> query("UPDATE bullpens SET pitch_count = pitch_count-1 WHERE id=" . $bullpen_id . "");
echo "Result: " .  $result . ", Result 2: " . $result2;
?>
