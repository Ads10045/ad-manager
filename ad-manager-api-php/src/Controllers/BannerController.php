<?php

namespace App\Controllers;

use App\Models\Banner;

class BannerController {
    private $db;
    private $banner;

    public function __construct($db) {
        $this->db = $db;
        $this->banner = new Banner($db);
    }

    public function index() {
        $stmt = $this->banner->read();
        $num = $stmt->rowCount();

        if($num > 0) {
            $banners_arr = array();
            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                array_push($banners_arr, $row);
            }
            header('Content-Type: application/json');
            echo json_encode($banners_arr);
        } else {
            echo json_encode(array("message" => "No banners found."));
        }
    }

    public function store() {
        $data = json_decode(file_get_contents("php://input"), true);

        if(!empty($data['name'])) {
            if($this->banner->create($data)) {
                http_response_code(201);
                echo json_encode(array("message" => "Banner created."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create banner."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
    }
}
