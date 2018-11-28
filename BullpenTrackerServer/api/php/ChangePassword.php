<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$email = $db -> quote($_POST['email']);
$pass_old = $db -> quote($_POST['password_old']);
$pass_new = $db -> quote($_POST['password_new']);
$config = parse_ini_file('../config.ini');
$salt = $config['salt'];
$pass_salt = $pass_old . $salt;
$pass_in = $db -> quote(hash('sha512',$pass_salt));
$result = $db -> select("SELECT id, pass FROM pitchers WHERE email = " . $email);
$result = $result[0];
$pass_out = $db -> quote($result['pass']);
if ($pass_out == $pass_in){
	$pass_salt_new = $pass_new . $salt;
	$pass_new = $db -> quote(hash('sha512',$pass_salt_new));
	$id_out = $db ->quote($result['id']);
	$quer = $db -> query("UPDATE pitchers SET pass=". $pass_new." WHERE id = " . $id_out);
	echo $quer;
}else{
	echo -1;
}
