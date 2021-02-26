Ext.ns('app.records');

Ext.define('app.records.Layout',{
    extend:'Ext.container.Container',
    layout:'fit',
    initComponent:function(){

        this.dataGrid = Ext.create('app.records.Grid',{
            flex:1,
            padding: "0px 10px 0px 0px"
        });
        this.fieldLayout = Ext.create('app.records.field.Layout',{
            hidden:true,
        });
        this.compositLayout = Ext.create('Ext.container.Container',{
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            flex:1,
            items:[
                this.dataGrid,
                {
                    xtype:'container',
                    flex:1,
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    items:[
                        Ext.create('app.records.TypesGrid',{
                            flex:1,
                            padding: "0px 0px 10px 0px"
                        }),
                        {
                            xtype:'container',
                            flex:1,
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            items:[
                                Ext.create('app.records.FactoriesGrid',{
                                    flex:1,
                                    padding: "0px 10px 0px 0px"
                                }),
                                Ext.create('app.records.ExportsGrid',{flex:1})
                            ]
                        }
                    ]
                }
            ]
        })

        this.items = [
            this.compositLayout,
            this.fieldLayout
        ]

        this.dataGrid.on('RecordSelected', this.showRecordLayout ,this);
        this.fieldLayout.on('NavigateBack', this.showGridLayout, this);
        this.callParent();
    },
    showGridLayout:function(){
        this.fieldLayout.hide();
        this.compositLayout.show();
    },
    showRecordLayout:function(name){
        this.compositLayout.hide();
        this.fieldLayout.show();
        this.fieldLayout.loadRecord(name);
    }
});
