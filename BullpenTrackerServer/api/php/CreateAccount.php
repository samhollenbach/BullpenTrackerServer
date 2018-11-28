<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$fname = $db -> quote($_POST['firstname']);
$lname = $db -> quote($_POST['lastname']);
$throws = $db -> quote($_POST['throws']);
$pass = $db -> quote($_POST['password']);
$email = $db -> quote($_POST['email']);
$config = parse_ini_file('../config.ini');
$salt = $config['salt'];
$pass_salt = $pass . $salt;
$pass_salt = $db -> quote(hash('sha512',$pass_salt));

$result = $db -> query("INSERT INTO pitchers (firstname, lastname, throws, email, pass) VALUES (" . $fname . ", ". $lname .", ". $throws . ", " . $email . ", " . $pass_salt . ")");

echo $result;

#$return_id = $db -> select("SELECT id FROM pitchers WHERE firstname = ".$fname." AND ". lastname=". $lname. " AND email=".$email.")");

#echo json_encode($return_id);
?>
