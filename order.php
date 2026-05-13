<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

const URL = 'https://sendmelead.com/api/v3/lead/add';

$name = trim(htmlspecialchars($_POST['name'] ?? ''));
$phone = trim(htmlspecialchars($_POST['phone'] ?? ''));

if (empty($name) || empty($phone)) {
    echo json_encode(['success' => false, 'error' => 'Name and phone are required']);
    exit;
}

$body = [
    'offerId' => '9f3ed64c-44f7-4608-ad95-41d805db5ccf',
    'ip' => $_SERVER['REMOTE_ADDR'],
    'name' => $name,
    'phone' => $phone,
    'clickid' => $_POST['sub1'] ?? '',
    'utm_medium' => $_POST['sub2'] ?? '',
    'utm_term' => $name,
    'utm_content' => $phone
];

$options = [
    'http' => [
        'method' => 'POST',
        'header' => [
            'Content-Type: application/json',
            'Content-Length: ' . strlen(json_encode($body)),
            'X-Token: 3dede3bd8f2c5bb88189d6f9fa440340',
        ],
        'content' => json_encode($body),
        'ignore_errors' => true,
        'timeout' => 30
    ]
];

$context = stream_context_create($options);
$result = file_get_contents(URL, false, $context);
$response = json_decode($result, true);

date_default_timezone_set('Etc/GMT-3');
$txt = PHP_EOL . 'LEAD' . PHP_EOL;
$txt .= date("F j, Y, H:i:s") . PHP_EOL;
foreach ($body as $key => $value) {
    $txt .= "$key: $value" . PHP_EOL;
}
$txt .= "API Response: " . $result . PHP_EOL;
$txt .= str_repeat('-', 50) . PHP_EOL;
file_put_contents('leads.txt', $txt, FILE_APPEND);

echo json_encode([
    'success' => true,
    'data' => $response
]);