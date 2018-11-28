<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$bullpen_id = $db -> quote($_POST['bullpen_id']);
$result = $db -> query("DELETE FROM bullpens WHERE id=" . $bullpen_id . ";");
$result2 = $db -> query("DELETE FROM pitches WHERE bullpen_id=" . $bullpen_id . "");
echo "Result: " .  $result . ", Result 2: " . $result2;
?>
