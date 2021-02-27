<?php

if (php_sapi_name() == "cli-server") {
    // running under built-in server so
    // route static assets and return false
    $extensions = array_flip(['jpg','png', 'jpeg', 'gif', 'css', 'js', 'woff','woff2','ttf']);
    $path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
    $ext = pathinfo($path, PATHINFO_EXTENSION);

    if (isset($extensions[$ext])) {
        return false;
    }

    $env = getenv('DVELUM_DR_UI_ENV');
    if(empty($env)){
        echo 'DVELUM_DR_UI_ENV variable is not set';
        exit();
    }

    $env = json_decode($env, true);

    define('DVELUM_DR_IU_DIR', __DIR__);

    include $env['dir']. '/vendor/autoload.php';

    $envParams =new \Dvelum\DR\Ui\EnvParams();
    $envParams->setDir($env['dir'])
        ->setRegistry($env['registry'])
        ->setBootstrap($env['bootstrap']);

    /**
     * @todo remove
     */
    chdir($env['dir']);

    $_SERVER['DVELUM_DR_UI_ENV'] = $envParams;
    $server = new \Dvelum\DR\Ui\Server();
    $req = \Laminas\Diactoros\ServerRequestFactory::fromGlobals($_SERVER, $_GET, $_POST);
    $emitter = new \Laminas\HttpHandlerRunner\Emitter\SapiEmitter();

    try {
        $resp = $server->run($req);
        $emitter->emit($resp);
    } catch (\Throwable $e) {
        error_log((string)$e->getMessage(), 0);
        echo $e->getMessage();
    }

}else{
    echo 'PHP UI Dashboard can be used only with cli-server ';
    exit();
}