<?php
$theme ='triton';// 'crisp'; // aria, gray, classic, neptune, triton, crisp
?>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width; initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>DVelum DataRecord UI</title>
    <script src="/js/lib/extjs/build/ext-all-debug.js"></script>
    <script src="/js/build.js?v=<?=filemtime(DVELUM_DR_IU_DIR . '/public/js/build.js')?>"></script>
    <script src="/js/lib/extjs/build/classic/theme-<?=$theme?>/theme-<?=$theme?>.js"></script>
    <script src="/js/lib/extjs/build/classic/locale/locale-en.js"></script>
    <link rel="stylesheet" type="text/css" href="/js/lib/extjs/build/classic/theme-<?=$theme?>/resources/theme-<?=$theme?>-all.css"/>
    <link rel="stylesheet" type="text/css" href="/css/style.css?v=<?=filemtime(DVELUM_DR_IU_DIR . '/public/css/style.css')?>" />
</head>
<body>
</body>
</html>