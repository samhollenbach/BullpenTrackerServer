<?php
 

$bullpen_id=$_POST['bullpen_id']; 
// This SQL statement selects ALL from the table 'Locations'
exec("mysql -h bullpentracker.cds8eiszpipe.us-east-1.rds.amazonaws.com -P 3306 -u macbaseball --password=macalester -e 'use macbullpens; select * from pitches where bullpen_id=$bullpen_id' | sed 's/\t/,/g;s/^//;s/$//;s/\ //g' > ../data/csv/bullpen_$bullpen_id.csv");

exec("Rscript ../data/BullpenPlotter.R $bullpen_id");

echo "Finished";
?>
