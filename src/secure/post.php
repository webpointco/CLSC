<?php
require("paths.php");
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data) && array_key_exists("lang", $data) && array_key_exists("page", $data) && array_key_exists("editable", $data) && array_key_exists("content", $data)
 && array_key_exists($data["lang"], PATHS) && array_key_exists($data["page"], PATHS[$data["lang"]])) {
    $file = fopen(__DIR__.($data["editable"] ? "/" : "/../").PATHS[$data["lang"]][$data["page"]], "w");
    $content = $data["content"];
    $result = fwrite($file, $content);
    if ($result) {
        echo "Successfully wrote $result bytes!";
    } else {
        echo "Failed.";
    }
} else {
    echo "Invalid.";
}
?>