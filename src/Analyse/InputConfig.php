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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
declare(strict_types=1);

namespace Dvelum\DR\Ui\Analyse;

class InputConfig
{
    private array $registry = [];
    private array $exports = [];
    private array $types = [];
    private array $factories =[];

    /**
     * @return array
     */
    public function getRegistry(): array
    {
        return $this->registry;
    }

    /**
     * @param array $registry
     */
    public function setRegistry(array $registry): void
    {
        $this->registry = $registry;
    }

    /**
     * @return array
     */
    public function getExports(): array
    {
        return $this->exports;
    }

    /**
     * @param array $exports
     */
    public function setExports(array $exports): void
    {
        $this->exports = $exports;
    }

    /**
     * @return array
     */
    public function getTypes(): array
    {
        return $this->types;
    }

    /**
     * @param array $types
     */
    public function setTypes(array $types): void
    {
        $this->types = $types;
    }

    /**
     * @return array
     */
    public function getFactories(): array
    {
        return $this->factories;
    }

    /**
     * @param array $factories
     */
    public function setFactories(array $factories): void
    {
        $this->factories = $factories;
    }

}

