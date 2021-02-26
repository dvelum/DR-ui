Ext.ns('app.records');

Ext.define('app.records.Model',{
    extend:'Ext.data.Model',
    fields: [
        {name:'name' ,  type:'string'},
        {name:'properties' , type:'number'},
        {name:'title', type:'string'}
    ]
});
Ext.define('app.records.Grid',{
    extend: 'Ext.grid.Panel',
    title: 'Data Records lIst',
    columnLines:true,

    initComponent:function (){

        this.store = Ext.create('Ext.data.Store',{
            autoLoad:true,
            model:"app.records.Model",
            proxy:{
                simpleSortMode:true,
                limitParam:"limit",
                startParam:"start",
                url: '/records/list',
                reader:{
                    rootProperty:"data",
                    totalProperty:"count"
                },
                type:"ajax"
            },
            remoteSort: false,
            sorters:[{"field":"","direction":"ASC","property":"name"}]
        });

        this.tbar = [{
            xtype:"searchpanel",
           local:true,
           store:this.store,
           fieldNames:['name','title']
        }];


        this.viewConfig = {enableTextSelection: true};
        this.columns =[
            {
                xtype:'actioncolumn',
                width:30,
                items:[{
                    xtype:"button",
                    handler:function(grid, rowIndex){
                        this.recordSelected(grid.getStore().getAt(rowIndex));
                    },
                    icon:"/i/edit.png",
                    scope:this,
                    tooltip: 'Edit'
                }],
            },
            {
                text: 'Name',
                dataIndex: 'name',
                width:300,
                align:'left',
            } , {
                text: 'Description',
                dataIndex: 'title',
                width:300,
                align:'left',
            },{
                text: 'Properties',
                dataIndex: 'properties',
                width:100,
                align:'right'
            }
        ];
        this.callParent(arguments);
        this.on('rowdblclick', function(cmp , record){
            this.recordSelected(record);
        }, this);
    },
    recordSelected:function(record){
        this.fireEvent('RecordSelected', record.get('name'));
    }
});