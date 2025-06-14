<?php
// db.php
$host = 'localhost';  // your database host
$dbname = 'your_database_name';  // your database name
$username = 'your_username';  // your database username
$password = 'your_password';  // your database password

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
?>
