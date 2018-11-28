<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$fname = $db -> quote($_POST['firstname']);
$lname = $db -> quote($_POST['lastname']);
$throws = $db -> quote($_POST['throws']);
#$number = $db -> quote($_POST['number']);
$email = $db -> quote($_POST['email']);)
$result = $db -> query("INSERT INTO pitchers (firstname, lastname, throws, email) VALUES (" .$fname . ", ". $lname .", ". $throws . ", " . $email . ")");
$return_id = $db-> select("SELECT id FROM pitchers WHERE firstname = ".$fname." AND ". lastname=". $lname. " AND email=".$email.")");
echo json_encode($return_id);
?>

