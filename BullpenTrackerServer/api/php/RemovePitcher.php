<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$name = $db -> quote($_POST['name']);
$result = $db -> query("DELETE FROM pitchers WHERE name=" . $name . "");
echo "Result: " .  $result;
?>
