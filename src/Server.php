<?php

/*
 * DVelum DR library https://github.com/dvelum/dr-ui
 *
 * Copyright (C) 2011-2021 Kirill Yegorov
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
declare(strict_types=1);

namespace Dvelum\DR\Ui;

use Laminas\Diactoros\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Server
{
    public function run(ServerRequestInterface $request): ResponseInterface
    {
        $response = new Response();
        $this->routeRequest($request, $response);
        return $response;
    }



    public function routeRequest(ServerRequestInterface $request, ResponseInterface $response): void
    {
        $routes = [
            'index' => '\\Dvelum\\DR\\Ui\\Service\\Index\\Controller',
            'records' => '\\Dvelum\\DR\\Ui\\Service\\Records\\Controller'
        ];

        $uriParts = explode('/', trim(strtolower($request->getUri()->getPath()), '/'));

        if (isset($routes[$uriParts[0] ?? 'index'])) {
            $controllerClass = $routes[$uriParts[0]];
        } else {
            $controllerClass = $routes['index'];
        }

        $methodName = $uriParts[1] ?? 'index';
        $controller = new $controllerClass($request, $response);
        if (method_exists($controller, $methodName . 'Action')) {
            $controller->{$methodName . 'Action'}();
        } else {
            $controller->indexAction();
        }
    }
}

