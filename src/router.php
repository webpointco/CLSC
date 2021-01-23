<?php
const SECURE_REGEX = "/secure$/";
const LANG_REGEX = "/en|zh/i";
const SECURE_PATH_REGEX = "/^\/secure/";

$secure = preg_match(SECURE_REGEX, __DIR__);
if ($secure) {
    require("paths.php");
} else {
    require("secure/paths.php");
}

$acceptLanguage = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
$matches = [];
$lang = strtolower((isset($_GET) && array_key_exists("lang", $_GET)) ? $_GET["lang"] : 
    (isset($_COOKIE) && array_key_exists("lang", $_COOKIE) ? $_COOKIE["lang"] :
        ($acceptLanguage != null && preg_match(LANG_REGEX, $acceptLanguage, $matches) ? $matches[0] : 
            "en")
    )
);

$path = strtok($_SERVER['REQUEST_URI'], "?");
if ($secure) {
    $path = preg_replace(SECURE_PATH_REGEX, "", $path);
}
$localPath = PATHS[$lang][$path];
setcookie("lang", $lang, time() + (86400 * 30));
require($localPath);
?>