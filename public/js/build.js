var Ext=Ext||{};Ext.Loader.setConfig({enabled:!1,disableCaching:!0});Ext.ns('app');Ext.tip.QuickTipManager.init();Ext.data.DataReader.messageProperty="msg";Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());app.msgCt=!1;app.createBox=function(t,s){return'<div class="msg"><h3>'+t+'</h3><p>'+s+'</p></div>'};app.msg=function(title,text){if(!app.msgCt){app.msgCt=Ext.core.DomHelper.insertFirst(document.body,{id:'msg-div'},!0)}
var s=Ext.String.format.apply(String,Array.prototype.slice.call(arguments,1));var m=Ext.core.DomHelper.append(app.msgCt,app.createBox(title,s),!0);m.hide();m.slideIn('t').ghost("t",{delay:3000,remove:!0})};Ext.define('app.comboModel',{extend:'Ext.data.Model',idProperty:'id',fields:[{name:'id',type:'integer'},{name:'title',type:'string'}]});Ext.define('app.comboStringModel',{extend:'Ext.data.Model',idProperty:'id',fields:[{name:'id',type:'string'},{name:'title',type:'string'}]});Ext.define('app.comboValueModel',{idProperty:'name',extend:'Ext.data.Model',fields:[{name:'name',type:'string'},{name:'value',type:'string'}]});Ext.data.proxy.Ajax.override({type:'ajax',config:{binary:!1,headers:undefined,paramsAsJson:!1,withCredentials:!1,useDefaultXhrHeader:!0,username:null,password:null,actionMethods:{create:'POST',read:'POST',update:'POST',destroy:'POST'}}});app.comboBoxRenderer=function(combo){return function(value){var idx=combo.getStore().findExact(combo.valueField,value);var rec=combo.getStore().getAt(idx);if(rec){return rec.get(combo.displayField)}else{return''}}};app.checkHeight=function(size){var viewSize=Ext.getBody().getViewSize();if(size>viewSize.height){return(viewSize.height*0.9)}else{return size}};app.checkWidth=function(size){var viewSize=Ext.getBody().getViewSize();if(size>viewSize.width){return(viewSize.width*0.9)}else{return size}};app.checkSize=function(window){var width=window.getWidth();var height=window.getHeight();var checkedWidth=app.checkWidth(width);var checkedHeight=app.checkHeight(height);if(checkedWidth<width||checkedHeight<height)
window.setSize(checkedWidth,checkedHeight);var position=window.getPosition();var setPos=!1;if(position[0]<0){setPos=!0;position[0]=10}
if(position[1]<0){setPos=!0;position[1]=10}
if(setPos){window.setPosition(position)}};app.comboTpl=Ext.create('Ext.XTemplate','<tpl for="."><div class=\"app-combo-item\">','{title}','</div></tpl>');app.comboListConfig={getInnerTpl:function(){return'<div class="app-combo-item">{title}</div>'}};app.getCookie=function(name){var prefix=name+"=";var cookieStartIndex=document.cookie.indexOf(prefix);if(cookieStartIndex==-1)return null;var cookieEndIndex=document.cookie.indexOf(";",cookieStartIndex+prefix.length);if(cookieEndIndex==-1)cookieEndIndex=document.cookie.length;return unescape(document.cookie.substring(cookieStartIndex+prefix.length,cookieEndIndex))};app.checkboxRenderer=function(value,metaData,record,rowIndex,colIndex,store){if(value){return'<img src="/i/yes.png" data-qtip="Yes">'}else{return'<img src="/i/no.png" data-qtip="No">'}};app.formFailure=function(form,action){var task=new Ext.util.DelayedTask(function(){switch(action.failureType){case Ext.form.Action.CLIENT_INVALID:Ext.Msg.alert('Message','Please fill form correctly',!1);break;case Ext.form.Action.CONNECT_FAILURE:Ext.Msg.alert('Message','Lost connection',!1);break;case Ext.form.Action.SERVER_INVALID:Ext.Msg.alert('Message',action.result.msg,!1);break;default:Ext.Msg.alert('Message',action.result.msg,!1)}});task.delay(200)};app.ajaxFailure=function(response,opts){var task=new Ext.util.DelayedTask(function(){Ext.Msg.alert('Message','Lost connection')});task.delay(200)};app.deleteColumn=function(){return{xtype:'actioncolumn',width:20,tooltip:'Sort',dataIndex:'id',align:'center',items:[{iconCls:'deleteIcon',tooltip:'Delete',handler:function(grid,rowIndex,colIndex){grid.getStore().removeAt(rowIndex)}}]}};app.sortColumn=function(){return{xtype:'actioncolumn',width:60,tooltip:'Sort',dataIndex:'id',items:[{iconCls:'downIcon',handler:function(grid,rowIndex,colIndex){var total=grid.getStore().getCount();if(rowIndex==total-1)
return;var sRec=grid.getStore().getAt(rowIndex);grid.getStore().removeAt(rowIndex);grid.getStore().insert(rowIndex+1,sRec)}},{iconCls:'upIcon',handler:function(grid,rowIndex,colIndex){if(rowIndex==0){return}
var sRec=grid.getStore().getAt(rowIndex);grid.getStore().removeAt(rowIndex);grid.getStore().insert(rowIndex-1,sRec)}},{iconCls:'deleteIcon',tooltip:'Delete',handler:function(grid,rowIndex,colIndex){grid.getStore().removeAt(rowIndex)}}]}};app.linesRenderer=function(value,metaData,record,rowIndex,colIndex,store){metaData.style='white-space:normal !important;';return value};app.progressRenderer=function(value,metaData,record,rowIndex,colIndex,store,vie){var tmpValue=parseInt(value)/100;var tmpText=parseInt(value)+'%';var progressRenderer=(function(pValue,pText){var b=new Ext.ProgressBar({style:{width:'100%'},maxWidth:'100%'});return function(pValue,pText){b.updateProgress(pValue,pText,!0);return Ext.DomHelper.markup(b.getRenderTree())}})(tmpValue,tmpText);return progressRenderer(tmpValue,tmpText)};app.storeException=function(proxy,response,operation,eOpts){if(response.aborted){return}
if(response.responseText===null){Ext.Msg.alert('Message','Invalid response');return}
if(!Ext.isEmpty(response.responseText)){try{var resp=Ext.JSON.decode(response.responseText)}catch(e){Ext.Msg.alert('Message','Invalid response');return}
if(resp&&resp.msg!=null){Ext.Msg.alert('Message',resp.msg);return}}
if(response.responseJson&&response.responseJson.msg){Ext.Msg.alert('Message',response.responseJson.msg);return}
Ext.Msg.alert('Message','Invalid response')};app.createUrl=function(paths){if(Ext.isArray(paths)){return paths.join(app.delimiter)}else{return''}};app.collectStoreData=function(store,onlyChanged){onlyChanged=onlyChanged||!1;var data=[];if(onlyChanged){var newRec=store.getNewRecords();var updRec=store.getUpdatedRecords();var allRec=newRec.concat(updRec);Ext.each(allRec,function(item,index){data.push(item.data)},this)}else{store.each(function(item,index){data.push(item.data)},this)}
return data};Ext.override(Ext.data.AbstractStore,{commitChanges:function(){Ext.each(this.getUpdatedRecords(),function(rec){rec.commit()});Ext.each(this.getNewRecords(),function(rec){rec.commit();rec.phantom=!1});this.removed=[]},rejectChanges:function(){var rLength=this.removed.length;for(var i=0;i<rLength;i++){this.insert(this.removed[i].lastIndex||0,this.removed[i])}
this.remove(this.getNewRecords());this.each(function(rec){rec.reject()});this.removed=[]}});app.checkChildNodes=function(node,isChecked){node.eachChild(function(child){child.set('checked',isChecked);if(!child.isLeaf()){app.checkChildNodes(child,isChecked)}})};(function(){Ext.override(Ext.data.proxy.Server,{constructor:function(config){this.callOverridden([config]);this.addListener("exception",app.storeException,this)}})})();app.csrfToken=!1;app.getCSRFToken=function(){if(app.csrfToken!==!1){return app.csrfToken}
var meta=Ext.select("meta[name='csrf-token']");if(Ext.isEmpty(meta.elements)){app.csrfToken=null}else{app.csrfToken=meta.elements[0].content}
return app.csrfToken};app.applyCSRFToken=function(options){var token=app.getCSRFToken();if(token!==null){options.headers=Ext.apply({'X-CSRF-Token':token},options.headers||{})}};app.isString=function(value){return(typeof(value)=='string')};app.html5Notify=function(params){var notify={title:'',msg:'',icon:app.wwwRoot+'i/notify.png',autoClose:0};Ext.apply(notify,params||{});var permitted=!1;if(!("Notification" in window)){console.log("This browser does not support desktop notification")}else if(Notification.permission==="granted"){permitted=!0}else if(Notification.permission!=='denied'){Notification.requestPermission(function(permission){if(permission==="granted"){permitted=!0}})}
if(permitted){var notifycation=new Notification(notify.title,{body:notify.msg,icon:notify.icon,lang:'ru'});if(notify.autoClose){setTimeout(function(){notifycation.close()},notify.autoClose*1000)}
return notifycation}
return!1};Ext.Ajax.on('beforerequest',function(connection,options){app.applyCSRFToken(options)});(function(){Ext.override(Ext.form.Basic,{doAction:function(action,options){app.applyCSRFToken(options);this.callParent(arguments)}})})();(function(){Ext.override(Ext.form.action.Submit,{submitEmptyText:!1})})();(function(){Ext.override(Ext.data.proxy.Ajax,{filterParam:'storefilter'})})();(function(){Ext.override(Ext.data.Connection,{upload:function(form,url,params,options){var token=app.getCSRFToken();if(token!==null){if(params&&params.length){params+='&xscrftoken='+token}else{params='?xscrftoken='+token}}
this.callParent(arguments)}})})();Ext.define('SearchPanel',{extend:'Ext.toolbar.Toolbar',alias:'widget.searchpanel',searchField:null,resetButton:null,store:null,fieldNames:[],local:!1,lastQuery:'',searchParam:'search',fieldLabel:null,hideLabel:!1,minChars:0,constructor:function(config){config=Ext.apply({border:!1,bodyBorder:!1,width:230,hideLabel:!1,frame:!1,style:{border:0},fieldLabel:'Search:'},config||{});this.callParent(arguments)},initComponent:function(){var me=this;this.resetButton=Ext.create('Ext.Button',{iconCls:'deleteIcon',flat:!1,tooltip:'Reset',listeners:{'click':{fn:function(){me.searchField.setValue('');me.clearFilter()},scope:this}}});this.searchField=Ext.create('Ext.form.field.Text',{enableKeyEvents:!0,flex:2,listeners:{'keyup':{fn:this.startFilter,buffer:300,scope:this}}});this.items=[];if(!this.hideLabel){this.items.push(this.fieldLabel)}
this.items.push(this.searchField,this.resetButton);this.callParent(arguments)},reset:function(){this.clearFilter();this.searchField.reset()},clearFilter:function(){this.lastQuery='';if(!this.local){this.store.proxy.setExtraParam(this.searchParam,'');this.store.load({scope:this,callback:function(records,operation,success){this.fireEvent('reset')}})}else{this.store.clearFilter();this.fireEvent('reset')}},startFilter:function(){var query=this.searchField.getValue();if(this.lastQuery===query){return}
if(query.length<this.minChars){return}
if(this.local){this.clearFilter();this.store.filter({fn:this.isSearched,scope:this})}else{this.store.getProxy().setExtraParam(this.searchParam,this.searchField.getValue());if(Ext.isEmpty(this.store.isBufferedStore)){this.store.loadPage(1)}else{this.store.load()}}
this.lastQuery=query},isSearched:function(record){var flag=!1;var recordHandle=record;var searchText=this.searchField.getValue();var pattern=new RegExp(searchText,"gi");Ext.each(this.fieldNames,function(item){if(pattern.exec(recordHandle.get(item))!=null){flag=!0;return}},this);return flag},setValue:function(text){this.searchField.setValue(text);this.startFilter()},getValue:function(){return this.searchField.getValue()},destroy:function(){this.searchField.destroy();this.resetButton.destroy();this.callParent(arguments)}});Ext.ns('app.records.field');Ext.define('app.records.field.Model',{extend:'Ext.data.Model',idProperty:'name',fields:[{name:'name',type:'string'},{name:'type',type:'string'},{name:'default',type:'string'}]});Ext.define('app.records.field.Grid',{extend:'Ext.grid.Panel',columnLines:!0,initComponent:function(){this.store=Ext.create('Ext.data.Store',{autoLoad:!1,model:"app.records.field.Model",proxy:{simpleSortMode:!0,limitParam:"limit",startParam:"start",url:'/records/fields',idParam:'name',reader:{rootProperty:"data",totalProperty:"count"},type:"ajax"},remoteSort:!1,sorters:[{"field":"","direction":"ASC","property":"name"}]});this.tbar.push({xtype:"searchpanel",local:!0,store:this.store,fieldNames:'name'});this.viewConfig={enableTextSelection:!0};this.columns=[{text:'Name',dataIndex:'name',width:150,align:'left',},{text:'Type',dataIndex:'type',width:200,align:'left'},{text:'Label / Description',dataIndex:'label',width:300,align:'left'},{text:'Default',dataIndex:'default',width:100,},{dataIndex:'required',width:80,align:'center',text:'Required',renderer:app.checkboxRenderer}];this.callParent(arguments);this.on('select',function(cmp,record){this.recordSelected(record)},this)},recordSelected:function(record){this.fireEvent('RecordSelected',record)}});Ext.ns('app.records.field');Ext.define('app.records.field.Layout',{extend:'Ext.container.Container',layout:{type:'hbox',pack:'start',align:'stretch'},initComponent:function(){var me=this;this.dataGrid=Ext.create('app.records.field.Grid',{flex:1,padding:"0px 10px 0px 0px",tbar:[{xtype:'button',text:' << Back',handler:function(){this.fireEvent('NavigateBack')},scope:this}]});this.searchPanel=Ext.create('SearchPanel',{fieldNames:['name','label'],local:!0});this.propertyGrid=Ext.create('Ext.grid.property.Grid',{hidden:!1,title:'Field Config',region:'east',flex:1,tbar:[this.searchPanel],viewConfig:{enableTextSelection:!0},listeners:{'beforeedit':{fn:function(){return!1}}},sourceConfig:{values:{renderer:function(v){var decoded=!1;try{decoded=Ext.JSON.decode(v)}catch(e){}
if(decoded){var s='<div style="white-space:normal !important;">';if(Array.isArray(decoded)){Ext.each(decoded,function(v){s+=v+' <br>'})}else{Ext.Object.each(decoded,function(k,v){s+=k+' -> '+v+' <br>'})}
s+='</div>';return s}
return v}}}});this.searchPanel.store=this.propertyGrid.getStore();this.items=[this.dataGrid,this.propertyGrid];this.dataGrid.on('RecordSelected',this.fieldSelected,this);this.callParent()},loadRecord:function(name){this.dataGrid.setTitle('<b>Record: </b>'+name);this.dataGrid.getStore().getProxy().setExtraParam('name',name);this.dataGrid.getStore().load()},fieldSelected:function(record){this.propertyGrid.show();this.propertyGrid.setSource(record.getData());this.propertyGrid.setTitle('<b>Field Config: </b>'+record.get('name'))}});Ext.ns('app.records');Ext.define('app.records.ExportsModel',{extend:'Ext.data.Model',idProperty:'name',fields:[{name:'name',type:'string'},{name:'value',type:'string'}]});Ext.define('app.records.ExportsGrid',{extend:'Ext.grid.Panel',title:'Data Exports',columnLines:!0,initComponent:function(){this.store=Ext.create('Ext.data.Store',{autoLoad:!0,model:"app.records.ExportsModel",proxy:{simpleSortMode:!0,limitParam:"limit",startParam:"start",url:'/records/exports',reader:{rootProperty:"data",totalProperty:"count"},type:"ajax"},remoteSort:!1,sorters:[{"field":"","direction":"ASC","property":"name"}]});this.viewConfig={enableTextSelection:!0};this.columns=[{text:'Alias',dataIndex:'name',width:100,align:'left',},{text:'Type',dataIndex:'value',flex:1,align:'left',}];this.callParent(arguments)}});Ext.ns('app.records');Ext.define('app.records.TypesModel',{extend:'Ext.data.Model',idProperty:'name',fields:[{name:'name',type:'string'},{name:'value',type:'string'}]});Ext.define('app.records.TypesGrid',{extend:'Ext.grid.Panel',title:'Data Types',columnLines:!0,initComponent:function(){this.store=Ext.create('Ext.data.Store',{autoLoad:!0,model:"app.records.TypesModel",proxy:{simpleSortMode:!0,limitParam:"limit",startParam:"start",url:'/records/types',reader:{rootProperty:"data",totalProperty:"count"},type:"ajax"},remoteSort:!1,sorters:[{"field":"","direction":"ASC","property":"name"}]});this.viewConfig={enableTextSelection:!0};this.columns=[{text:'Alias',dataIndex:'name',width:100,align:'left',},{text:'Type',dataIndex:'value',align:'left',flex:1,}];this.callParent(arguments)}});Ext.ns('app.records');Ext.define('app.records.FactoriesModel',{extend:'Ext.data.Model',idProperty:'name',fields:[{name:'name',type:'string'},{name:'value',type:'string'}]});Ext.define('app.records.FactoriesGrid',{extend:'Ext.grid.Panel',title:'Data Factories',columnLines:!0,initComponent:function(){this.store=Ext.create('Ext.data.Store',{autoLoad:!0,model:"app.records.FactoriesModel",proxy:{simpleSortMode:!0,limitParam:"limit",startParam:"start",url:'/records/factories',reader:{rootProperty:"data",totalProperty:"count"},type:"ajax"},remoteSort:!1,sorters:[{"field":"","direction":"ASC","property":"name"}]});this.viewConfig={enableTextSelection:!0};this.columns=[{text:'Alias',dataIndex:'name',width:100,align:'left',},{text:'Type',dataIndex:'value',flex:1,width:300,align:'left',}];this.callParent(arguments)}});Ext.ns('app.records');Ext.define('app.records.Model',{extend:'Ext.data.Model',fields:[{name:'name',type:'string'},{name:'properties',type:'number'},{name:'title',type:'string'}]});Ext.define('app.records.Grid',{extend:'Ext.grid.Panel',title:'Data Records lIst',columnLines:!0,initComponent:function(){this.store=Ext.create('Ext.data.Store',{autoLoad:!0,model:"app.records.Model",proxy:{simpleSortMode:!0,limitParam:"limit",startParam:"start",url:'/records/list',reader:{rootProperty:"data",totalProperty:"count"},type:"ajax"},remoteSort:!1,sorters:[{"field":"","direction":"ASC","property":"name"}]});this.tbar=[{xtype:"searchpanel",local:!0,store:this.store,fieldNames:['name','title']}];this.viewConfig={enableTextSelection:!0};this.columns=[{xtype:'actioncolumn',width:30,items:[{xtype:"button",handler:function(grid,rowIndex){this.recordSelected(grid.getStore().getAt(rowIndex))},icon:"/i/edit.png",scope:this,tooltip:'Edit'}],},{text:'Name',dataIndex:'name',width:300,align:'left',},{text:'Description',dataIndex:'title',width:300,align:'left',},{text:'Properties',dataIndex:'properties',width:100,align:'right'}];this.callParent(arguments);this.on('rowdblclick',function(cmp,record){this.recordSelected(record)},this)},recordSelected:function(record){this.fireEvent('RecordSelected',record.get('name'))}});Ext.ns('app.records');Ext.define('app.records.Layout',{extend:'Ext.container.Container',layout:'fit',initComponent:function(){this.dataGrid=Ext.create('app.records.Grid',{flex:1,padding:"0px 10px 0px 0px"});this.fieldLayout=Ext.create('app.records.field.Layout',{hidden:!0,});this.compositLayout=Ext.create('Ext.container.Container',{layout:{type:'hbox',pack:'start',align:'stretch'},flex:1,items:[this.dataGrid,{xtype:'container',flex:1,layout:{type:'vbox',pack:'start',align:'stretch'},items:[Ext.create('app.records.TypesGrid',{flex:1,padding:"0px 0px 10px 0px"}),{xtype:'container',flex:1,layout:{type:'hbox',pack:'start',align:'stretch'},items:[Ext.create('app.records.FactoriesGrid',{flex:1,padding:"0px 10px 0px 0px"}),Ext.create('app.records.ExportsGrid',{flex:1})]}]}]})
this.items=[this.compositLayout,this.fieldLayout]
this.dataGrid.on('RecordSelected',this.showRecordLayout,this);this.fieldLayout.on('NavigateBack',this.showGridLayout,this);this.callParent()},showGridLayout:function(){this.fieldLayout.hide();this.compositLayout.show()},showRecordLayout:function(name){this.compositLayout.hide();this.fieldLayout.show();this.fieldLayout.loadRecord(name)}});Ext.ns('app');app.application=!1;app.content=Ext.create('Ext.Panel',{bodyPadding:10,frame:!1,border:!1,bodyBorder:!1,layout:'fit',scrollable:!1,items:[],collapsible:!1,flex:1});app.header=Ext.create('Ext.Panel',{cls:'adminHeader',html:'<h1>DVelum Data Record UI</h1>',bodyPadding:10});app.cookieProvider=new Ext.state.CookieProvider({expires:new Date(new Date().getTime()+(1000*60*60*24))});Ext.application({name:'DVelum DR UI',launch:function(){app.application=this;app.layouts={records:Ext.create('app.records.Layout')};app.content.add(app.layouts.records);app.viewport=Ext.create('Ext.container.Viewport',{renderTo:'body',cls:'formBody',layout:{type:'vbox',pack:'start',align:'stretch'},items:[app.header,app.content]})}})