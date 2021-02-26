Ext.ns('app.records');

Ext.define('app.records.TypesModel',{
    extend:'Ext.data.Model',
    idProperty:'name',
    fields: [
        {name:'name' ,  type:'string'},
        {name:'value' , type:'string'}
    ]
});
Ext.define('app.records.TypesGrid',{
    extend: 'Ext.grid.Panel',
    title: 'Data Types',
    columnLines:true,

    initComponent:function (){
        this.store = Ext.create('Ext.data.Store',{
            autoLoad:true,
            model:"app.records.TypesModel",
            proxy:{
                simpleSortMode:true,
                limitParam:"limit",
                startParam:"start",
                url: '/records/types',
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
                align:'left',
                flex:1,
            }
        ];
        this.callParent(arguments);
    }
});
