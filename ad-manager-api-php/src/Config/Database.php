<?php

namespace App\Config;

use PDO;
use PDOException;

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    public $conn;

    public function __construct() {
        $config_file = __DIR__ . '/../../config/config.json';
        $config_data = json_decode(file_get_contents($config_file), true);
        
        $this->host = $config_data['database']['host'] ?? getenv('DB_HOST');
        $this->db_name = $config_data['database']['name'] ?? getenv('DB_DATABASE');
        $this->username = getenv('DB_USERNAME'); // Still from .env for security
        $this->password = getenv('DB_PASSWORD'); // Still from .env for security
        $this->port = $config_data['database']['port'] ?? getenv('DB_PORT');
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $config_file = __DIR__ . '/../../config/config.json';
            $config_data = json_decode(file_get_contents($config_file), true);
            $sslmode = $config_data['database']['sslmode'] ?? 'require';

            $dsn = "pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";sslmode=" . $sslmode;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
