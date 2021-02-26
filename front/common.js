var Ext = Ext || {};

Ext.Loader.setConfig({
    enabled: false,
    disableCaching: true
});

Ext.ns('app');
Ext.tip.QuickTipManager.init();
Ext.data.DataReader.messageProperty = "msg";
Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());

app.msgCt = false;
app.createBox = function (t, s) {
    return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
};
/**
 * Application notification message
 * @param title
 * @param text
 */
app.msg = function (title, text) {
    if (!app.msgCt) {
        app.msgCt = Ext.core.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
    }
    var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
    var m = Ext.core.DomHelper.append(app.msgCt, app.createBox(title, s), true);
    m.hide();
    m.slideIn('t').ghost("t", {delay: 3000, remove: true});
};

/**
 * Model for ComboBox data using the fields: id - int, title - string fields
 */
Ext.define('app.comboModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'id', type: 'integer'},
        {name: 'title', type: 'string'}
    ]
});
/**
 * Model for ComboBox data using the fields: id - string, title - string
 */
Ext.define('app.comboStringModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'id', type: 'string'},
        {name: 'title', type: 'string'}
    ]
});
/**
 * Model for ComboBox data using the fields: name - string, value - string
 */
Ext.define('app.comboValueModel', {
    idProperty: 'name',
    extend: 'Ext.data.Model',
    fields: [
        {name: 'name', type: 'string'},
        {name: 'value', type: 'string'}
    ]
});

Ext.data.proxy.Ajax.override({
    type: 'ajax',
    config: {
        binary: false,
        headers: undefined,
        paramsAsJson: false,
        withCredentials: false,
        useDefaultXhrHeader: true,
        username: null,
        password: null,
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        }
    }
});
/*
 * Column renderer based on ComboBox data
 */
app.comboBoxRenderer = function (combo) {
    return function (value) {
        var idx = combo.getStore().findExact(combo.valueField, value);
        var rec = combo.getStore().getAt(idx);
        if (rec) {
            return rec.get(combo.displayField);
        } else {
            return '';
        }
    };
};
/**
 * method verifying the component’s height value and returning the maximum
 * available size if the component size does not fit the window
 * (to be used for window only)
 * @param {integer} size
 * @return integer
 */
app.checkHeight = function (size) {
    var viewSize = Ext.getBody().getViewSize();

    if (size > viewSize.height) {
        return (viewSize.height * 0.9);
    } else {
        return size;
    }
};
/**
 * The same as app.checkHeight , but for verifying the width
 * @param {integer} size
 * @return integer
 */
app.checkWidth = function (size) {
    var viewSize = Ext.getBody().getViewSize();

    if (size > viewSize.width) {
        return (viewSize.width * 0.9);
    } else {
        return size;
    }
};
/**
 * Verifies size and coordinates of the Ext.Window and reduces
 * the size/ changes coordinates of the window if it goes beyond
 * the visible area
 * @param {Ext.Window} window
 */
app.checkSize = function (window) {
    var width = window.getWidth();
    var height = window.getHeight();

    var checkedWidth = app.checkWidth(width);
    var checkedHeight = app.checkHeight(height);

    if (checkedWidth < width || checkedHeight < height)
        window.setSize(checkedWidth, checkedHeight);

    var position = window.getPosition();
    var setPos = false;

    if (position[0] < 0) {
        setPos = true;
        position[0] = 10;
    }

    if (position[1] < 0) {
        setPos = true;
        position[1] = 10;
    }

    if (setPos) {
        window.setPosition(position);
    }
};

app.comboTpl = Ext.create('Ext.XTemplate', '<tpl for="."><div class=\"app-combo-item\">', '{title}', '</div></tpl>');
app.comboListConfig = {
    getInnerTpl: function () {
        return '<div class="app-combo-item">{title}</div>';
    }
};

app.getCookie = function (name) {
    var prefix = name + "=";
    var cookieStartIndex = document.cookie.indexOf(prefix);
    if (cookieStartIndex == -1) return null;
    var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
    if (cookieEndIndex == -1) cookieEndIndex = document.cookie.length;
    return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
};
/*
 * Renderer for boolean data
 */
app.checkboxRenderer = function (value, metaData, record, rowIndex, colIndex, store) {
    if (value) {
        return '<img src="/i/yes.png" data-qtip="Yes">';
    } else {
        return '<img src="/i/no.png" data-qtip="No">';
    }
};

/*
 * Failure event handler when sending a form (to be defined manually)
 */
app.formFailure = function (form, action) {
    var task = new Ext.util.DelayedTask(function () {
        switch (action.failureType) {
            case Ext.form.Action.CLIENT_INVALID:
                Ext.Msg.alert('Message', 'Please fill form correctly', false);
                break;
            case Ext.form.Action.CONNECT_FAILURE:
                Ext.Msg.alert('Message', 'Lost connection', false);
                break;
            case Ext.form.Action.SERVER_INVALID:
                Ext.Msg.alert('Message', action.result.msg, false);
                break;
            default :
                Ext.Msg.alert('Message', action.result.msg, false);

        }
    });
    task.delay(200);

};
/*
 * Failure event handler when sending an Ajax-request (to be defined manually)
 */
app.ajaxFailure = function (response, opts) {
    var task = new Ext.util.DelayedTask(function () {
        Ext.Msg.alert('Message', 'Lost connection');
    });
    task.delay(200);
};

/**
 * Grid column with delete record button
 */
app.deleteColumn = function () {
    return {
        xtype: 'actioncolumn',
        width: 20,
        tooltip: 'Sort',
        dataIndex: 'id',
        align: 'center',
        items: [
            {
                iconCls: 'deleteIcon',
                tooltip: 'Delete',
                handler: function (grid, rowIndex, colIndex) {
                    grid.getStore().removeAt(rowIndex);
                }
            }
        ]
    };
};
/*
 * Grid column, which allows sorting and removing elements
 */
app.sortColumn = function () {
    return {
        xtype: 'actioncolumn',
        width: 60,
        tooltip: 'Sort',
        dataIndex: 'id',
        items: [
            {
                iconCls: 'downIcon',
                handler: function (grid, rowIndex, colIndex) {
                    var total = grid.getStore().getCount();
                    if (rowIndex == total - 1)
                        return;

                    var sRec = grid.getStore().getAt(rowIndex);
                    grid.getStore().removeAt(rowIndex);
                    grid.getStore().insert(rowIndex + 1, sRec);
                    //grid.getStore().commitChanges();

                }
            }, {
                iconCls: 'upIcon',
                handler: function (grid, rowIndex, colIndex) {
                    //var total = grid.getStore().getCount();
                    if (rowIndex == 0) {
                        return;
                    }
                    var sRec = grid.getStore().getAt(rowIndex);
                    grid.getStore().removeAt(rowIndex);
                    grid.getStore().insert(rowIndex - 1, sRec);
                    //grid.getStore().commitChanges();
                }
            }, {
                iconCls: 'deleteIcon',
                tooltip: 'Delete',
                handler: function (grid, rowIndex, colIndex) {
                    grid.getStore().removeAt(rowIndex);
                    // grid.getStore().commitChanges();
                }
            }
        ]
    };
};
/*
 * Specialized column renderer allowing to show a value on several lines
 * (supports line breaks, does not hide the content outside column borders)
 */
app.linesRenderer = function (value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = 'white-space:normal !important;';
    return value;
};
/*
 * Specialized column renderer allowing to show a progress Bar
 * (values 0 - 100)
 */
app.progressRenderer = function (value, metaData, record, rowIndex, colIndex, store, vie) {
    var tmpValue = parseInt(value) / 100;
    var tmpText = parseInt(value) + '%';

    var progressRenderer = (function (pValue, pText) {
        var b = new Ext.ProgressBar({
            style: {width: '100%'},
            maxWidth: '100%'
        });
        return function (pValue, pText) {
            b.updateProgress(pValue, pText, true);
            return Ext.DomHelper.markup(b.getRenderTree());
        };
    })(tmpValue, tmpText);
    return progressRenderer(tmpValue, tmpText);
};
/**
 * Exception handler when trying to upload data to store
 * @param {Ext.data.proxy.Proxy} proxy
 * @param {Object} response - The response from the AJAX request
 * @param {Ext.data.Operation} operation - The operation that triggered request
 * @param {Object} eOpts - The options object passed to Ext.util.Observable.addListener.
 */
app.storeException = function (proxy, response, operation, eOpts) {
    if (response.aborted) {
        return;
    }
    if (response.responseText === null) {
        Ext.Msg.alert('Message', 'Invalid response');
        return;
    }
    if(!Ext.isEmpty(response.responseText)){
        try {
            var resp = Ext.JSON.decode(response.responseText);
        } catch (e){
            Ext.Msg.alert('Message', 'Invalid response');
            return;
        }
        if (resp && resp.msg != null) {
            Ext.Msg.alert('Message', resp.msg);
            return;
        }
    }
    if(response.responseJson && response.responseJson.msg){
        Ext.Msg.alert('Message', response.responseJson.msg);
        return;
    }
    Ext.Msg.alert('Message', 'Invalid response');
};

/**
 * Method creating url-address considering backend routing
 * features and taking an array of address elements as an argument
 * @param {Array} paths
 * @returns string
 */
app.createUrl = function (paths) {
    if (Ext.isArray(paths)) {
        return paths.join(app.delimiter);
    } else {
        return '';
    }
};

/**
 * Method getting  the Data Store data,
 * all or modified data is available for collecting,
 * which is defined by the second parameter
 * @param {Ext.data.Store} store - data store to collect from
 * @param {boolean} onlyChanged - true to collect only new and changed data. Default to false.
 * @returns {Array}
 */
app.collectStoreData = function (store, onlyChanged) {

    onlyChanged = onlyChanged || false;
    var data = [];

    if (onlyChanged) {
        var newRec = store.getNewRecords();
        var updRec = store.getUpdatedRecords();
        var allRec = newRec.concat(updRec);

        Ext.each(allRec, function (item, index) {
            data.push(item.data);
        }, this);
    } else {
        store.each(function (item, index) {
            data.push(item.data);
        }, this);
    }
    return data;
};

/**
 * commitChanges and rejectChanges for {Ext.data.Store}
 */
Ext.override(Ext.data.AbstractStore, {

    commitChanges: function () {
        Ext.each(this.getUpdatedRecords(), function (rec) {
            rec.commit();
        });

        Ext.each(this.getNewRecords(), function (rec) {
            rec.commit();
            rec.phantom = false;
        });

        this.removed = [];
    },

    rejectChanges: function () {
        var rLength = this.removed.length;
        for (var i = 0; i < rLength; i++) {
            this.insert(this.removed[i].lastIndex || 0, this.removed[i]);
        }

        this.remove(this.getNewRecords());

        this.each(function (rec) {
            rec.reject();
        });

        this.removed = [];
    }
});
/*
 * Recursive set up of the checked property for a tree node
 */
app.checkChildNodes = function (node, isChecked) {
    node.eachChild(function (child) {
        child.set('checked', isChecked);
        if (!child.isLeaf()) {
            app.checkChildNodes(child, isChecked);
        }
    });
};



//======= Overrides =============

(function () {
    Ext.override(Ext.data.proxy.Server, {
        constructor: function (config) {
            this.callOverridden([config]);
            this.addListener("exception", app.storeException, this);
        }
    });
})();

app.csrfToken = false;
app.getCSRFToken = function () {
    if (app.csrfToken !== false) {
        return app.csrfToken;
    }
    var meta = Ext.select("meta[name='csrf-token']");
    if (Ext.isEmpty(meta.elements)) {
        app.csrfToken = null;
    } else {
        app.csrfToken = meta.elements[0].content;
    }
    return app.csrfToken;
};

app.applyCSRFToken = function (options) {
    var token = app.getCSRFToken();
    if (token !== null) {
        options.headers = Ext.apply({
            'X-CSRF-Token': token
        }, options.headers || {});
    }
};
/**
 * Check if value is string
 */
app.isString = function (value) {
    return (typeof(value) == 'string');
};

/**
 * Html5 Notifycation API
 * @param {Object} params - notify params
 * params:
 * title: string default '' - notify window title
 * msg: string default '' - notify body
 * icon: string default app.wwwRoot + 'i/notify.png' - notify window icon
 * autoClose: integer default 0 (disable autoClose) - timeout before auto close notify (seconds)
 * @returns {Object|Boolean} - notifycation object or false on error
 */
app.html5Notify = function (params) {
    var notify = {
        title: '',
        msg: '',
        icon: app.wwwRoot + 'i/notify.png',
        autoClose: 0
    };
    Ext.apply(notify, params || {});
    var permitted = false;
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        permitted = true;
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                permitted = true;
            }
        });
    }

    if (permitted) {
        var notifycation = new Notification(notify.title, {
            body: notify.msg,
            icon: notify.icon,
            lang: 'ru'
        });
        if (notify.autoClose) {
            setTimeout(function () {
                notifycation.close()
            }, notify.autoClose * 1000);
        }
        return notifycation;
    }
    return false;
};

/*
 * Adds support for CSRF protection token to ExtJS' Ajax methods
 */
Ext.Ajax.on('beforerequest', function (connection, options) {
    app.applyCSRFToken(options);
});
/*
 * Adds support for CSRF protection token to ExtJS' Ext.form.Basic actions
 */
(function () {
    Ext.override(Ext.form.Basic, {
        doAction: function (action, options) {
            app.applyCSRFToken(options);
            //call the original hide function
            this.callParent(arguments);
        }
    });
})();
/*
 * Override default value of submitEmptyText ExtJS' Ext.form.action.Submit
 */
(function () {
    Ext.override(Ext.form.action.Submit, {
        submitEmptyText: false
    });
})();
/**
 * Override store filter param
 */
(function () {
    Ext.override(Ext.data.proxy.Ajax, {
        filterParam: 'storefilter'
    });
})();

/*
 * Adds support for CSRF protection token to ExtJS' Ext.form.Basic fileupload actions
 */
(function () {
    Ext.override(Ext.data.Connection, {
        upload: function (form, url, params, options) {
            var token = app.getCSRFToken();
            if (token !== null) {
                if (params && params.length) {
                    params += '&xscrftoken=' + token;
                } else {
                    params = '?xscrftoken=' + token;
                }
            }
            this.callParent(arguments);
        }
    });
})();