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

namespace Dvelum\DR\Ui\Analyse;

use Dvelum\DR\Factory;
use Dvelum\DR\Type\EnumType;

class Registry
{
    private array $config;
    private Factory $factory;

    public function __construct(array $config)
    {
        $this->config = $config;
        $this->factory = new Factory($config);
    }

    public function getRegisteredObjects(): array
    {
        return array_keys($this->config['records']);
    }

    public function getRecordsStat(): array
    {
        $data = [];
        $objects = $this->getRegisteredObjects();
        foreach ($objects as $name) {
            $data[] = $this->getObjectStat($name);
        }
        return $data;
    }

    private function formatListResult(array $results): array
    {
        $result = [];
        foreach ($results as $name => $value) {
            if (is_object($value)) {
                $value = get_class($value);
                $value = $this->formatClassName($value);
            }
            $result[] = [
                'name' => $name,
                'value' => (string)$value
            ];
        }
        return $result;
    }

    public function getTypes(): array
    {
        return $this->formatListResult($this->factory->getRegisteredTypes());
    }

    public function getFactories()
    {
        return $this->formatListResult($this->factory->getRegisteredFactories());
    }

    public function getExports()
    {
        return $this->formatListResult($this->factory->getRegisteredExports());
    }

    private function formatClassName(string $class)
    {
        return str_replace('Dvelum\\DR\\Type\\', '', $class);
    }

    /**
     * @param string $objectName
     * @return array
     */
    public function getFieldsStat(string $objectName): array
    {
        $o = $this->factory->create($objectName);
        $fields = $o->getConfig()->getFields();
        $result = [];
        foreach ($fields as $name => $field) {
            $tmp = $field->getConfigData();
            foreach ($tmp as &$value) {
                if (is_object($value)) {
                    $value = get_class($value);
                    $value = $this->formatClassName($value);
                }
                if (is_array($value)) {
                    if ($field->getType() instanceof EnumType) {
                        $value = array_keys($value);
                    }
                    $value = json_encode($value);
                }
            }
            $tmp['name'] = $name;
            $result[] = $tmp;
        }
        return $result;
    }

    private function getObjectStat(string $objectName): array
    {
        $result = [];
        $record = $this->factory->create($objectName);
        $config = $record->getConfig();
        $fields = $config->getFields();
        $result['name'] = $objectName;
        $result['properties'] = count($fields);
        $result['title'] = $config->getTitle();
        return $result;
    }
}

