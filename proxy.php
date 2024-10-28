<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// servers: naw-f, naw-e, nae-f, nae-e, eu-f, eu-e, sa-f, sa-e, as-f, as-e
$region = isset($_GET['region']) ? $_GET['region'] : null;
$url = "https://questlog.gg/throne-and-liberty/api/trpc/actionHouse.getAuctionHouse?input=%7B%22language%22%3A%22pt%22%2C%22regionId%22%3A%22$region%22%7D";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(['error' => curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

$data = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Resposta não é um JSON válido']);
    exit;
}

echo json_encode($data);
?>