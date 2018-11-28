<?php
 

$bullpen_id=$_POST['bullpen_id']; 
#$email=$_POST['email'];
echo $email;
require_once('PHPMailer/class.phpmailer.php');

$email = new PHPMailer();
$email->From      = 'macbullpens@gmail.com';
$email->FromName  = 'Bullpen Tracker';
$email->Subject   = 'Your Bullpen ' . $bullpen_id;
$email->Body      = 'Here the data from your bullpen';
$email->AddAddress($_POST['email']);

$file_to_attach = '../html/plots/plot_'.$bullpen_id.'.png';

$email->AddAttachment( $file_to_attach , 'bullpen'.$bullpen_id.'.png' );

return $email->Send();

?>
