<?php

namespace App\Models;

use PDO;

class Banner {
    private $conn;
    private $table_name = "\"Banner\""; // Consistent with original schema

    public $id;
    public $name;
    public $position;
    public $path;
    public $active;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE active = true ORDER BY \"createdAt\" DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                  (id, name, position, path, active) 
                  VALUES (:id, :name, :position, :path, :active)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', bin2hex(random_bytes(16))); // Simple UUID fallback
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':position', $data['position']);
        $stmt->bindParam(':path', $data['path']);
        $stmt->bindParam(':active', $data['active'], PDO::PARAM_BOOL);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
