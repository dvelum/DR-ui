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

namespace Dvelum\DR\Ui\Service\Records;

use Dvelum\DR\Ui\Analyse\Registry;
use Dvelum\DR\Ui\EnvParams;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use function json_encode;

class Controller
{
    private ServerRequestInterface $request;
    private ResponseInterface $response;

    public function __construct(ServerRequestInterface $req, ResponseInterface $resp)
    {
        $this->request = $req;
        $this->response = $resp;
    }

    public function indexAction(): void
    {
        $this->response->getBody()->write(json_encode(['success' => true]));
    }

    public function listAction(): void
    {
        try {
            $registry = $this->createRegistry();
            $stat = $registry->getRecordsStat();
            $this->response->getBody()->write(
                json_encode(
                    [
                        'success' => true,
                        'data' => $stat,
                        'count' => count($stat)
                    ],
                    JSON_THROW_ON_ERROR
                )
            );
        } catch (\Throwable $e) {
            $this->response->getBody()->write(json_encode(['success' => false, 'msg' => $e->getMessage()]));
        }
    }

    public function exportsAction(): void
    {
        try {
            $registry = $this->createRegistry();
            $stat = $registry->getExports();
            $this->response->getBody()->write(
                json_encode(
                    [
                        'success' => true,
                        'data' => $stat,
                        'count' => count($stat)
                    ],
                    JSON_THROW_ON_ERROR
                )
            );
        } catch (\Throwable $e) {
            $this->response->getBody()->write(json_encode(['success' => false, 'msg' => $e->getMessage()]));
        }
    }

    public function typesAction(): void
    {
        try {
            $registry = $this->createRegistry();
            $stat = $registry->getTypes();
            $this->response->getBody()->write(
                json_encode(
                    [
                        'success' => true,
                        'data' => $stat,
                        'count' => count($stat)
                    ],
                    JSON_THROW_ON_ERROR
                )
            );
        } catch (\Throwable $e) {
            $this->response->getBody()->write(json_encode(['success' => false, 'msg' => $e->getMessage()]));
        }
    }

    public function factoriesAction()
    {
        try {
            $registry = $this->createRegistry();
            $stat = $registry->getFactories();
            $this->response->getBody()->write(
                json_encode(
                    [
                        'success' => true,
                        'data' => $stat,
                        'count' => count($stat)
                    ],
                    JSON_THROW_ON_ERROR
                )
            );
        } catch (\Throwable $e) {
            $this->response->getBody()->write(json_encode(['success' => false, 'msg' => $e->getMessage()]));
        }
    }

    public function fieldsAction(): void
    {
        $params = $this->request->getParsedBody();
        if (!isset($params['name']) || empty($params['name'])) {
            $this->response->getBody()->write(json_encode(['success' => false, 'msg' => 'Wrong request']));
            return;
        }
        try {
            $registry = $this->createRegistry();
            $stat = $registry->getFieldsStat((string)$params['name']);
            $this->response->getBody()->write(
                json_encode(
                    [
                        'success' => true,
                        'data' => $stat,
                        'count' => count($stat)
                    ],
                    JSON_THROW_ON_ERROR
                )
            );
        } catch (\Throwable $e) {
            $this->response->getBody()->write(json_encode(['success' => false, 'msg' => $e->getMessage()]));
        }
    }

    public function createRegistry(): Registry
    {
        $params = $this->request->getServerParams();
        if (!isset($params['DVELUM_DR_UI_ENV']) || !$params['DVELUM_DR_UI_ENV'] instanceof EnvParams) {
            throw new \InvalidArgumentException('DVELUM_DR_UI_ENV config is not set');
        }
        $params = $params['DVELUM_DR_UI_ENV'];

        try {
            if (!empty($params->getBootstrap())) {
                require $params->getBootstrap();
            }
        } catch (\Throwable $e) {
            throw new \RuntimeException('Fail to bootstrap external code. ' . $e->getMessage());
        }

        $registry = include $params->getRegistry();
        return new Registry($registry);
    }
}