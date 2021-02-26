Ext.ns('app.records');

Ext.define('app.records.ExportsModel',{
    extend:'Ext.data.Model',
    idProperty:'name',
    fields: [
        {name:'name' ,  type:'string'},
        {name:'value' , type:'string'}
    ]
});
Ext.define('app.records.ExportsGrid',{
    extend: 'Ext.grid.Panel',
    title: 'Data Exports',
    columnLines:true,

    initComponent:function (){
        this.store = Ext.create('Ext.data.Store',{
            autoLoad:true,
            model:"app.records.ExportsModel",
            proxy:{
                simpleSortMode:true,
                limitParam:"limit",
                startParam:"start",
                url: '/records/exports',
                reader:{
                    rootProperty:"data",
                    totalProperty:"count"
                },
                type:"ajax"
            },
            remoteSort: false,
            sorters:[{"field":"","direction":"ASC","property":"name"}]
        });

        this.viewConfig = {enableTextSelection: true};
        this.columns =[
            {
                text: 'Alias',
                dataIndex: 'name',
                width:100,
                align:'left',
            } , {
                text: 'Type',
                dataIndex: 'value',
                flex:1,
                align:'left',
            }
        ];
        this.callParent(arguments);
    }
});
