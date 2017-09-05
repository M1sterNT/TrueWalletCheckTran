<?php
// กำหนด API Passkey

define('API_PASSKEY', '555');

if ($_SERVER['REMOTE_ADDR'] == $_SERVER['SERVER_ADDR']) {
    if ($_POST['API_PASSKEY'] == API_PASSKEY) {

        $request['Ref1'] = ($_POST['Ref1']);
        $request['Ref2'] = ($_POST['Ref2']);
        $request['cardcard_amount'] = ($_POST['cardcard_amount']);

        // เริ่มต้นการทำงานของระบบของท่าน


        // สิ้นสุดการทำงานของระบบของท่าน

        echo 'SUCCEED';
    } else {
        echo 'INVALID_PASSKEY';
    }
} else {
    echo 'ACCESS_DENIED';
}
?>