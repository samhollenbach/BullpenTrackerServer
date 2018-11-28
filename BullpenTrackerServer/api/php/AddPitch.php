<?php
require_once('DatabaseConnector.php');
$db = new DatabaseConnector();
$bullpen_id = $db -> quote($_POST['bullpen_id']);
$pitch_type = $db -> quote($_POST['pitch_type']);
$ball_strike = $db -> quote($_POST['ball_strike']);
$vel = $db -> quote($_POST['vel']);
$res = $db -> quote($_POST['result']);
$px = $db -> quote($_POST['pitchX']);
$py = $db -> quote($_POST['pitchY']);
$hc = $db -> quote($_POST['hard_contact']);

$use_pos = false;
$hc_set = false;

if (isset($hc)){
    $hc_set = true;
}

if(isset($_POST['pitchX']) && isset($_POST['pitchY'])){
  $use_pos = true;
  #$result = $db -> query("INSERT INTO pitches (bullpen_id, pitch_type, ball_strike, vel, result, pitchX, pitchY, hard_contact) VALUES (".$bullpen_id.", ".$pitch_type.", ".$ball_strike.", ".$vel.", ".$res.", ".$px.",".$py.",".$hc.")");

}else{
#$result = $db -> query("INSERT INTO pitches (bullpen_id, pitch_type, ball_strike, vel, result, hard_contact) VALUES (".$bullpen_id.", ".$pitch_type.", ".$ball_strike.", ".$vel.", ".$res.",".$hc.")");
}

$quer_b = "INSERT INTO pitches (bullpen_id, pitch_type, ball_strike, vel, result";
$quer_e = "VALUES (".$bullpen_id.", ".$pitch_type.", ".$ball_strike.", ".$vel.", ".$res;

if($use_pos){
    $quer_b .= ", pitchX, pitchY";
    $quer_e .= ", ".$px.",".$py;
}
if($hc_set){
    $quer_b .= ", hard_contact";
    $quer_e .= ",".$hc;
}
$quer_b .= ") ";
$quer_e .= ") ";

$result = $db -> query($quer_b.$quer_e);


$update = $db -> query("UPDATE bullpens SET pitch_count = pitch_count+1 WHERE id = $bullpen_id");

$return_pitch = $db -> select("SELECT MAX(id) AS last_id FROM pitches WHERE bullpen_id=". $bullpen_id . "");
echo json_encode($return_pitch);
?>

