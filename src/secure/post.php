<?php
require("paths.php");
$file = fopen(__DIR__."/../test_".PATHS["en"]["/about-us"], "w");
$content = file_get_contents('php://input');
$result = fwrite($file, $content);
if ($result) {
    echo "Successfully wrote $result bytes!"
} else {
    echo "Failed."
}
?>