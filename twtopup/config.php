<?php

define("API_PASSKEY", "****************");
define("API_URL", "*******************");

$username_truewallet = "************";
$password_truewallet = "************";

$username = "*******";
$password = "*******";
$database = "*******";

$mysqli = new mysqli("localhost", $username, $password, $mysqli);

/* check connection */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

