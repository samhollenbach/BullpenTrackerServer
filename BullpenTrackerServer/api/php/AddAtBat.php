<?php
/**
 * Created by PhpStorm.
 * User: samhollenbach
 * Date: 1/30/18
 * Time: 5:20 PM
 */
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$b_id = $db -> quote($_POST['b_id']);
$batter_side = $db -> quote($_POST['batter_side']);
$max_ab = $db-> select("SELECT MAX(ab_id) AS mab FROM atbats WHERE bullpen_id = ".$b_id."");
if (!isset($max_ab)){
    $ab_id = 0;
}else{
    $mab = $max_ab[0]['mab'];
    $ab_id = (int)$mab+1;
}
$result = $db -> query("INSERT INTO atbats (bullpen_id, ab_id, ab_side) VALUES (" .      $b_id . ", " . $ab_id . ", ". $batter_side .")");
echo $ab_id;
?>
