<?php
require("secure/paths.php");
const LANG_REGEX = "/en|zh/i";

$acceptLanguage = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
$matches = [];
$lang = strtolower(($acceptLanguage != null && preg_match(LANG_REGEX, $_SERVER['HTTP_ACCEPT_LANGUAGE'], $matches)) ? $matches[0] : "en");

$path = $_SERVER['REQUEST_URI'];
$localPath = PATHS[$lang][$path];
require($localPath);
?>