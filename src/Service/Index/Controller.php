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

namespace Dvelum\DR\Ui\Service\Index;

use Dvelum\DR\Ui\View\Template;
use MatthiasMullie\Minify\JS;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Controller
{
    private ServerRequestInterface $request;
    private ResponseInterface $response;

    public function __construct(ServerRequestInterface $req, ResponseInterface $resp)
    {
        $this->request = $req;
        $this->response = $resp;
    }

    public function indexAction() : void
    {
        //$this->buildJs();
        $template = new Template();
        $html = $template->render(DVELUM_DR_IU_DIR . '/templates/index.php');
        $this->response->getBody()->write($html);
    }

    private function buildJs()
    {
        $files = [
            'front/common.js',

            'front/components/SearchPanel.js',
            'front/records/field/Grid.js',
            'front/records/field/Layout.js',
            'front/records/ExportsGrid.js',
            'front/records/TypesGrid.js',
            'front/records/FactoriesGrid.js',
            'front/records/Grid.js',
            'front/records/Layout.js',
            'front/Application.js'
        ];

        $min = new JS();
        foreach ($files as $file){
            $min->add(DVELUM_DR_IU_DIR . '/' .$file);
        }
        $min->minify(DVELUM_DR_IU_DIR . '/public/js/build.js');
    }
}