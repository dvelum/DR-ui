Ext.ns('app');

app.application = false;
app.content =  Ext.create('Ext.Panel',{
    bodyPadding:10,
    frame:false,
    border:false,
    bodyBorder:false,
    layout:'fit',
    //margins: '0 5 0 0',
    scrollable:false,
    items:[],
    collapsible:false,
    flex : 1
});
app.header = Ext.create('Ext.Panel',{
    cls: 'adminHeader',
    html: '<h1>DVelum Data Record UI</h1>',
    bodyPadding:10
});

app.cookieProvider = new Ext.state.CookieProvider({
    expires: new Date(new Date().getTime()+(1000*60*60*24)) //1 day
});

Ext.application({
    name: 'DVelum DR UI',
    launch: function() {
        app.application = this;
        app.layouts = {
           records: Ext.create('app.records.Layout')
        };
        app.content.add(app.layouts.records);

        app.viewport = Ext.create('Ext.container.Viewport', {
            renderTo:'body',
            cls:'formBody',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            items:[app.header, app.content]
        });
    }
});
