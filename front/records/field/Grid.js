Ext.ns('app.records.field');

Ext.define('app.records.field.Model', {
    extend: 'Ext.data.Model',
    idProperty: 'name',
    fields: [
        {name: 'name', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'default', type: 'string'}
    ]
});
Ext.define('app.records.field.Grid', {
    extend: 'Ext.grid.Panel',
    columnLines: true,

    initComponent: function () {

        this.store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            model: "app.records.field.Model",
            proxy: {
                simpleSortMode: true,
                limitParam: "limit",
                startParam: "start",
                url: '/records/fields',
                idParam: 'name',
                reader: {
                    rootProperty: "data",
                    totalProperty: "count"
                },
                type: "ajax"
            },
            remoteSort: false,
            sorters:[{"field":"","direction":"ASC","property":"name"}]
        });

        this.tbar.push({
            xtype: "searchpanel",
            local: true,
            store: this.store,
            fieldNames: 'name'
        });


        this.viewConfig = {enableTextSelection: true};
        this.columns = [
            {
                text: 'Name',
                dataIndex: 'name',
                width: 150,
                align: 'left',
            }, {
                text: 'Type',
                dataIndex: 'type',
                width: 200,
                align: 'left'
            }, {
                text: 'Label / Description',
                dataIndex: 'label',
                width: 300,
                align: 'left'
            }, {
                text: 'Default',
                dataIndex: 'default',
                width: 100,
            },{
                dataIndex:'required',
                width:80,
                align:'center',
                text:'Required',
                renderer:app.checkboxRenderer
            }
        ];
        this.callParent(arguments);
        this.on('select', function (cmp, record) {
            this.recordSelected(record);
        }, this);
    },
    recordSelected: function (record) {
        this.fireEvent('RecordSelected', record);
    }
});