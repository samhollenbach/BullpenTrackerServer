<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$email = $db -> quote($_POST['email']);
$pass = $db -> quote($_POST['password']);
$config = parse_ini_file('../config.ini');
$salt = $config['salt'];
$pass_salt = $pass . $salt;
$pass_in = $db -> quote(hash('sha512',$pass_salt));
$result = $db -> select("SELECT id, pass, firstname, lastname, number, throws, email FROM pitchers WHERE email = " . $email);
$result = $result[0];
$pass_out = $db -> quote($result['pass']);
if ($pass_out == $pass_in){
	unset($result['pass']);
	echo json_encode($result);
}else{
	echo json_encode (new stdClass);
}
?>
