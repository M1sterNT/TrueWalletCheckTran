<?php
date_default_timezone_set("Asia/Bangkok");
include 'TrueWallet.php';
include 'config.php';

$mode = "email";

if (!empty($_POST['txid']) && !empty($_POST['ref1'])) {

    $TranID = $_POST['txid'];
    $ref1 = $_POST['ref1'];
    $ref2 = $_POST['ref2'];


    $result = $mysqli->query("SELECT * FROM tw_histrories where tran_id ='" . $TranID . "'"); //mysqli

    if ($result->num_rows < 1) { //mysqli

        $wallet = new TrueWalletV2($username_truewallet, $password_truewallet, $mode);
        $token = json_decode($wallet->GetToken(), true)['data']['accessToken'];


        function send_api($data)
        {
            $post = array(
                'API_PASSKEY' => API_PASSKEY,
                'Ref1' => $data['data']['ref1'],
                'Ref2' => $data['data']['ref2'],
                'cardcard_amount' => $data['data']['amount']
            );
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, API_URL);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
            return curl_exec($ch);
        }

        foreach ($wallet->getTran($token)['data']['activities'] as $Reports) {

            if ($Reports['text3En'] == 'creditor') {
                $check = $wallet->CheckTran($token, $Reports['reportID'], $TranID);
                if ($check != null) {
                    $check['data']['number'] = $check['data']['ref1'];
                    $check['data']['ref1'] = $ref1;
                    $check['data']['ref2'] = $ref2;

                    $mysqli->query("INSERT INTO `tw_histrories` (`id`, `tran_id`, `ref1`, `ref2`, `amount`, `date`, `status`) VALUES (NULL, '" . $TranID . "', '" . $ref1 . "','" . $ref2 . "', '" . $check['data']['amount'] . "', '" . date('Y-m-d') . "', 'process');"); //mysqli
                    $temp = send_api($check);
                    if ($temp == "SUCCEED") {
                        $sql = "UPDATE tw_histrories SET status='SUCCEED' WHERE tran_id=" . $TranID;
                        $mysqli->query($sql);
                        $complete = array('status ' => 1, 'messge' => 'เติมเงินเรียบร้อยแล้ว', 'code' => '2000', 'amount' => $check['data']['amount']);
                        echo json_encode($complete);
                        exit();
                    } else if ($temp == "INVALID_PASSKEY") {
                        $sql = "UPDATE tw_histrories SET status='INVALID_PASSKEY' WHERE tran_id=" . $TranID;
                        $mysqli->query($sql);
                        $error = array('status ' => 0, 'messge' => 'PASSKEY ไม่ถูกต้อง', 'code' => '2004');
                        echo json_encode($error);
                        exit();
                    } else if ($temp == "ACCESS_DENIED") {
                        $sql = "UPDATE tw_histrories SET status='ACCESS_DENIED' WHERE tran_id=" . $TranID;
                        $mysqli->query($sql);
                        $error = array('status ' => 0, 'messge' => 'คุณไม่มีสิทธิ์ เข้าถึงระบบ', 'code' => '2005');
                        echo json_encode($error);
                    } else {
                        $error = array('status ' => 0, 'messge' => 'ไม่ทราบสาเหตุ', 'code' => '2006');
                        echo json_encode($error);
                    }

                }
            }
        }
        $error = array('status ' => 0, 'messge' => 'ไม่พบเลขอ้างอิงในระบบ', 'code' => '2001');
        echo json_encode($error);
        exit();

    } else {
        $arr = array('status ' => 0, 'messge' => 'มีเลขอ้างอิงในระบบแล้ว', 'code' => '2002');
        echo json_encode($arr);
    }
} else {
    $arr = array('status ' => 0, 'messge' => 'ส่งข้อมูลไม่ครบถ้วน', 'code' => '2003');
    echo json_encode($arr);
}

?>