<?php
 

$bullpen_id=$_POST['bullpen_id']; 
$file = '../data/plots/plot_'.$bullpen_id.'.png';
$type = 'image/png';
header('Content-Type:'.$type);
header('Content-Length: ' . filesize($file));
readfile($file);


?>
