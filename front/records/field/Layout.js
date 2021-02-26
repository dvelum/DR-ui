Ext.ns('app.records.field');

Ext.define('app.records.field.Layout',{
    extend:'Ext.container.Container',
    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'stretch'
    },
    initComponent:function(){
        var me = this;

        this.dataGrid  = Ext.create('app.records.field.Grid',{
            flex:1,
            padding: "0px 10px 0px 0px",
            tbar: [
                {
                    xtype:'button',
                    text: ' << Back',
                    handler:function(){
                        this.fireEvent('NavigateBack');
                    },
                    scope:this
                }
            ]
        });

        this.searchPanel = Ext.create('SearchPanel', {
            fieldNames: ['name','label'],
            local: true
        });

        this.propertyGrid = Ext.create('Ext.grid.property.Grid',{
            hidden:false,
            title:'Field Config',
            region:'east',
            flex:1,
            tbar: [this.searchPanel],
            viewConfig:{
                enableTextSelection: true
            },
            listeners: {
                'beforeedit':{
                    fn:function(){
                        return false;
                    }
                }
            },
            sourceConfig:{
                values:{
                    renderer:function(v){
                        var decoded = false;
                        try{
                            decoded = Ext.JSON.decode(v);
                        }catch (e){

                        }
                        if(decoded){
                            var s= '<div style="white-space:normal !important;">';
                            if(Array.isArray(decoded)){
                                Ext.each(decoded, function (v){
                                    s+= v+' <br>';
                                });
                            }else{
                                Ext.Object.each(decoded, function(k,v){
                                    s+= k+' -> ' +v+' <br>';
                                });
                            }
                            s+='</div>';
                            return s;
                        }
                        return v;
                    }
                }
            }
            //width:300
        });
        this.searchPanel.store = this.propertyGrid.getStore();

        this.items = [this.dataGrid, this.propertyGrid];

        this.dataGrid.on('RecordSelected',this.fieldSelected, this);
        this.callParent();
    },
    loadRecord:function(name){
        this.dataGrid.setTitle('<b>Record: </b>' + name);
        this.dataGrid.getStore().getProxy().setExtraParam('name', name);
        this.dataGrid.getStore().load();
    },
    fieldSelected:function(record){
        this.propertyGrid.show();
        this.propertyGrid.setSource(record.getData());
        this.propertyGrid.setTitle('<b>Field Config: </b>' + record.get('name'));
    }
});
