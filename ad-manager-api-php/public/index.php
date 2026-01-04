<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;
use App\Controllers\BannerController;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Basic Router
$controller = new BannerController($db);

if (strpos($request_uri, '/api/banners') !== false) {
    if ($request_method === 'GET') {
        $controller->index();
    } elseif ($request_method === 'POST') {
        $controller->store();
    }
} elseif ($request_uri === '/api/health') {
    echo json_encode(["status" => "OK", "message" => "PHP Ad-Manager API is running"]);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Route not found"]);
}
