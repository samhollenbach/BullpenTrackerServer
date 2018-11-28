<!DOCTYPE html>
<html>
<head>
    <title>Bullpen Tracker</title>
    <link rel="stylesheet" type="text/css" href="main_stylesheet.css">
    <link href="https://fonts.googleapis.com/css?family=Cutive|Pacifico|Shrikhand" rel="stylesheet">
</head>
<body id="stats">
<div class="header">
    <a class="title" href="index.html">Bullpen Tracker</a>
    <a class="login" href="login.html">Log In</a>
    <a class="login" href="about.html">About Us</a>
    <a class="login" href="index.html">Home</a>
</div>

<div class="main-body">


<div class="querycolumn">
<form method="get">
    <div class="evencolumn">
    <h3>Pitcher Name:</h3> <input class="namebox" type="text" name="pitcher_name" autocomplete="off" value="<?php echo isset($_GET['pitcher_name']) ? $_GET['pitcher_name'] : ''?>"><br>
    <br>
    <h3>Bullpen Types:</h3>
    <input class="css-checkbox" id="NORM" type="checkbox" name="bullpen_type[]" value="NORM"
        <?php echo isset($_GET['bullpen_type']) ? ((in_array("NORM", $_GET['bullpen_type'])) ? "checked='checked'" : '') : ("checked='checked'") ?> />
    <label for="NORM" class="css-label">NORM</label><br>
    <input class="css-checkbox" id="FLAT" type="checkbox" name="bullpen_type[]" value="FLAT"
        <?php echo isset($_GET['bullpen_type']) ? ((in_array("FLAT", $_GET['bullpen_type'])) ? "checked='checked'" : '') : ("checked='checked'") ?> />
    <label for="FLAT" class="css-label">FLAT</label><br>
    <input class="css-checkbox" id="COMP" type="checkbox" name="bullpen_type[]" value="COMP"
        <?php echo isset($_GET['bullpen_type']) ? ((in_array("COMP", $_GET['bullpen_type'])) ? "checked='checked'" : '') : ("checked='checked'") ?> />
    <label for="COMP" class="css-label">COMP</label><br>
    <input class="css-checkbox" id="GAME" type="checkbox" name="bullpen_type[]" value="GAME" \
        <?php echo isset($_GET['bullpen_type']) ? ((in_array("GAME", $_GET['bullpen_type'])) ? "checked='checked'" : '') : ("checked='checked'") ?> />
    <label for="GAME" class="css-label">GAME</label><br>

        <br><input class="resbutton" type="submit" value="Submit"><br>
    </div>



    <div class="evencolumn">
    <h3>Pitch Types:</h3>

        <input class="css-checkbox" id="p_f" type="checkbox" name="pitch_type[]" value="F"
            <?php echo isset($_GET['pitch_type']) ? ((in_array("F", $_GET['pitch_type'])) ? "checked='checked'" : '') : ("checked='checked'") ?> />
        <label for="p_f" class="css-label">F</label><br>
        <input class="css-checkbox" id="p_s" type="checkbox" name="pitch_type[]" value="S"
            <?php echo isset($_GET['pitch_type']) ? ((in_array("S", $_GET['pitch_type'])) ? "checked='checked'" : '') : ("checked='checked'") ?> />
        <label for="p_s" class="css-label">S</label><br>
        <input class="css-checkbox" id="p_b" type="checkbox" name="pitch_type[]" value="B"
            <?php echo isset($_GET['pitch_type']) ? ((in_array("B", $_GET['pitch_type'])) ? "checked='checked'" : '') : ("checked='checked'") ?> />
        <label for="p_b" class="css-label">B</label><br>
        <input class="css-checkbox" id="p_x" type="checkbox" name="pitch_type[]" value="X"
            <?php echo isset($_GET['pitch_type']) ? ((in_array("X", $_GET['pitch_type'])) ? "checked='checked'" : '') : ("checked='checked'") ?>/>
        <label for="p_x" class="css-label">X</label><br>
        <input class="css-checkbox" id="p_2" type="checkbox" name="pitch_type[]" value="2"
            <?php echo isset($_GET['pitch_type']) ? ((in_array("2", $_GET['pitch_type'])) ? "checked='checked'" : '') : ("checked='checked'") ?> />
        <label for="p_2" class="css-label">2</label><br>
        <input class="css-checkbox" id="p_c" type="checkbox" name="pitch_type[]" value="C"
            <?php echo isset($_GET['pitch_type']) ? ((in_array("C", $_GET['pitch_type'])) ? "checked='checked'" : '') : ("checked='checked'") ?> />
        <label for="p_c" class="css-label">C</label><br>


        <h3>Group By:</h3>
    <input class="css-checkbox"  id="bdate" type="checkbox" name="group_id" value="Yes" <?php if(isset($_GET['group_id'])) echo "checked='checked'";?> >
        <label for="bdate" class="css-label">Bullpen Date</label><br>
    <input class="css-checkbox" id="btype" type="checkbox" name="group_type" value="Yes" <?php if(isset($_GET['group_type'])) echo "checked='checked'";?> >
        <label for="btype" class="css-label">Bullpen Type</label><br>
    <input class="css-checkbox" id="ptype" type="checkbox" name="group_pitch" value="Yes" <?php if(isset($_GET['group_pitch'])) echo "checked='checked'";?> >
        <label for="ptype" class="css-label">Pitch Type</label><br>


    </div>
</form>
</div>
<div class="rescolumn" style="overflow-x:auto;">
<h1>Results</h1>
</div>
</div>
</body>


<div id="dom-target" style="display: none;">
    <?php

    require_once('php/DatabaseConnector.php');
    $db = new DatabaseConnector();

    $pitcher_name = $db->quote($_GET['pitcher_name']);
    $pitches = $_GET['pitch_type'];
    $bullpen_type = $_GET['bullpen_type'];

    $group_id = $db->quote($_GET['group_id']);
    $group_type = $db->quote($_GET['group_type']);
    $group_pitch = $db->quote($_GET['group_pitch']);


    if ($group_id == '\'Yes\'') {
        $group_type = false;
    }

    $SQL_SELECT = 'SELECT ';
    $SQL_GROUP_ARR = array();
    if (isset($group_id) && $group_id == '\'Yes\'') {
        # add "GROUP_CONCAT(DISTINCT date SEPARATOR ',') AS 'Date'," to show date
        $SQL_SELECT .= 'IFNULL(DATE_FORMAT(date, \'%m/%d/%y\'), \'Total\') AS \'Date\',
        GROUP_CONCAT(DISTINCT type SEPARATOR \',\') AS \'Bullpen Type\', ';
        $SQL_GROUP_ARR[] = 'bullpen_id';
    }
    if (isset($group_type) && $group_type == '\'Yes\'') {
        $SQL_SELECT .= 'IFNULL(type, \'ALL\') AS \'Bullpen Type\', ';
        $SQL_GROUP_ARR[] = 'type';

    }
    if (isset($group_pitch) && $group_pitch == '\'Yes\'') {
        $SQL_SELECT .= 'IFNULL(pitch_type, \'ALL\') AS \'Pitch Type\', ';
        $SQL_GROUP_ARR[] = 'pitch_type';
    }

    $SQL_SELECT .= 'COUNT(*) AS \'Pitches\',
        COUNT(CASE WHEN ball_strike=\'B\' OR ball_strike=\'N\' THEN 1 ELSE NULL END) AS \'Balls\',
        COUNT(CASE WHEN ball_strike=\'S\' OR ball_strike=\'X\' THEN 1 ELSE NULL END) AS \'Strikes\',
        ROUND(COUNT(CASE WHEN ball_strike=\'S\' OR ball_strike=\'X\' THEN 1 ELSE NULL END) / COUNT(*), 3)  AS \'Strikes %\',
        ROUND(AVG(NULLIF(vel,0)), 1) AS \'Avg. Vel\'
        FROM ';

    $SQL_JOIN_A = '(SELECT * FROM pitches WHERE (';
    #$pitches_arr = explode(',', $pitches);
    $pitches_arr = $pitches;
    foreach ($pitches_arr as &$p) {
        $p = $db->quote($p);
        $p = 'pitch_type=' . $p;
    }
    unset($p);
    $SQL_JOIN_A .= join(' OR ', $pitches_arr) . ')) AS A';

    $SQL_JOIN_B = '(SELECT * FROM bullpens WHERE(pitcher_id=(SELECT DISTINCT id FROM pitchers WHERE name=' . $pitcher_name . ')) AND (';

    #$bullpen_arr = explode(',', $bullpen_types);
    $bullpen_arr = $bullpen_type;
    foreach ($bullpen_arr as &$b) {
        $b = $db->quote($b);
        $b = 'type=' . $b;
    }
    unset($p);
    $SQL_JOIN_B .= join(' OR ', $bullpen_arr) . ')) AS B';

    $SQL_JOIN = $SQL_JOIN_A . ' JOIN ' . $SQL_JOIN_B . ' ON (A.bullpen_id = B.id)';

    $SQL_GROUP = ' GROUP BY ' . join(', ', $SQL_GROUP_ARR) . ' WITH ROLLUP;';

    $SQL = $SQL_SELECT . $SQL_JOIN . $SQL_GROUP;

    $rows = $db->select($SQL);
    echo json_encode($rows);
    ?>
</div>

<script>
    var _table_ = document.createElement('table'),
        _tr_ = document.createElement('tr'),
        _th_ = document.createElement('th'),
        _td_ = document.createElement('td');

    // Builds the HTML Table out of myList json data from Ivy restful service.
    function buildHtmlTable(arr) {
        var table = _table_.cloneNode(false),
            columns = addAllColumnHeaders(arr, table);
        for (var i=0, maxi=arr.length; i < maxi; ++i) {
            var tr = _tr_.cloneNode(false);
            for (var j=0, maxj=columns.length; j < maxj ; ++j) {
                var td = _td_.cloneNode(false);
                cellValue = arr[i][columns[j]];
                td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
                if (cellValue==="ALL" || cellValue==="Total"){
                    tr.classList.add("all-row")
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        return table;
    }

    // Adds a header row to the table and returns the set of columns.
    // Need to do union of keys from all records as some records may not contain
    // all records
    function addAllColumnHeaders(arr, table)
    {
        var columnSet = [],
            tr = _tr_.cloneNode(false);
        for (var i=0, l=arr.length; i < l; i++) {
            for (var key in arr[i]) {
                if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key)===-1) {
                    columnSet.push(key);
                    var th = _th_.cloneNode(false);
                    th.appendChild(document.createTextNode(key));
                    tr.appendChild(th);
                }
            }
        }
        table.appendChild(tr);
        return columnSet;
    }

    var div = document.getElementById("dom-target");

    try{
        var myData = JSON.parse(div.textContent);
        if(myData===false) {
            var no_data1 = document.createElement('div');
            no_data1.appendChild(document.createTextNode("Enter Group By parameters and click Submit to search stats"));
            document.body.appendChild(no_data1);
        }else{
            document.body.appendChild(buildHtmlTable(myData));
        }
    }catch(e){
        var no_data2 = document.createElement('div');
        no_data2.appendChild(document.createTextNode("test"));
        document.body.appendChild(no_data2);
    }



</script>

</html>
