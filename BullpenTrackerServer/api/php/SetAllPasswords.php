<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$config = parse_ini_file('../config.ini');
$salt = $config['salt'];
$pass = "'mac'";
$pass_salt = $pass . $salt;
$pass_in = $db -> quote(hash('sha512',$pass_salt));
$quer = $db -> query("UPDATE pitchers SET pass=". $pass_in);
echo $quer;
?>
