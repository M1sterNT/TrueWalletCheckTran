<?php

class TrueWalletV2
{

    public $username;
    public $password;
    public $login_type;
    private $passhash;

    public function __construct($user, $pass, $type)
    {
        $this->username = $user;
        $this->password = $pass;
        $this->login_type = $type;
        $this->passhash = sha1($user . $pass);
    }

    public function GetToken()
    {
        $url = 'https://api-ewm.truemoney.com/api/v1/signin';
        $postfield = array(
            "username" => $this->username,
            "password" => $this->passhash,
            "type" => $this->login_type
        );
        $data_string = json_encode($postfield);

        return $this->send_curl($url, $data_string);
    }

    public function getTran($token)
    {
        $url = 'https://api-ewm.truemoney.com/api/v1/profile/transactions/history/' . $token . '/?startDate=' . date('Y-m-d', strtotime("-3 months +3 day")) . '&endDate=' . date('Y-m-d', strtotime("+1 day")) . '&limit=50&type=&action=';
        $header = array(
            "Host: api-ewm.truemoney.com",
            "Content-Type: application/json"
        );
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        return json_decode($result, true);

    }

    public function CheckTran($token, $ReportId, $TranId)
    {

        $url = 'https://api-ewm.truemoney.com/api/v1/profile/activities/' . $ReportId . '/detail/' . $token;
        $header = array(
            "Host: api-ewm.truemoney.com",
            "Content-Type: application/json"
        );
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        $data = json_decode($result, true);
        if ($data['data']['section4']['column2']['cell1']['value'] == $TranId) {
            return $data;
        } else {
            return null;
        }
    }

    private function send_curl($url, $data)
    {
        $header = array(
            "Host: api-ewm.truemoney.com",
            "Content-Type: application/json"
        );
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        if ($data) {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        return $result;
    }

}