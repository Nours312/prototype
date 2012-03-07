
Ajax.BinaryRequest = Class.create(Ajax.Request, {
	initialize: function($super, url, file, options) {
		try{
			$super(url, options);
			this.file = file ;
			Object.extend(this.options, {
				method		: 'post',
				contentType	: 'text/plain;',
				encoding	: 'x-user-defined-binary'
			});
			this.transport = Ajax.getTransport();
			this.request(url);
		}catch(z){ }
	},

	request: function(url) {
		try {
			if(!this.file)
				return ;
			this.url = url;
			this.method = this.options.method;
			var params = Object.isString(this.options.parameters) ?
			this.options.parameters :
			Object.toQueryString(this.options.parameters);

			if (!['post'].include(this.method)) {
				params += (params ? '&' : '') + "_method=" + this.method;
				this.method = 'post';
			}

			this.parameters = params.toQueryParams();

			var response = new Ajax.Response(this);
			if (this.options.onCreate) this.options.onCreate(response, this.file);
			Ajax.Responders.dispatch('onCreate', this, response);

			this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);

			if(this.transport.upload){
				this.transport.upload.onprogress	= this.BRupdateProgress.bind(this);
				this.transport.upload.onloadstart	= this.BRupdateProgress.bind(this);
				this.transport.upload.onload		= this.BRfinish.bind(this, response);
				this.transport.upload.oncomplete	= this.BRcomplete.bind(this);
				this.transport.upload.onerror		= this.BRerrorUpload.bind(this, response);
			} else
				throw('TRANSPORT UPLOAD UNDEFINED');


			if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

			this.transport.onreadystatechange = this.onStateChange.bind(this);

			this.setRequestHeaders();

			if (!this.options.asynchronous && this.transport.overrideMimeType)
				this.onStateChange();
			this.transport.overrideMimeType('text/plain; charset=x-user-defined-binary') ;
                        
			this.transport.send(this.file);
		} catch (e) {
			this.dispatchException(e);
		}
	},
	setRequestHeaders: function() {
		var headers = {
			'Cache-Control'			: 'no-cache',
			'X-Requested-With'		: 'XMLHttpRequest',
			'X-File-Name'			: this.file.name,
			'X-File-Size'			: this.file.size,
			'X-Prototype-Version'	: Prototype.Version,
			'Accept'				: 'text/javascript, text/html, application/xml, text/xml, */*'
		};
		if (this.method == 'post')
			if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
				headers['Connection'] = 'close';

		if (typeof this.options.requestHeaders == 'object') {
			var extras = this.options.requestHeaders;

			if (Object.isFunction(extras.push))
				for (var i = 0, length = extras.length; i < length; i += 2)
					headers[extras[i]] = extras[i+1];
			else
				$H(extras).each(function(pair) {
					headers[pair.key] = pair.value
				});
		}

		for (var name in headers)
			this.transport.setRequestHeader(name, headers[name]);
	},
	respondToReadyState: function(readyState) {
		var state = Ajax.BinaryRequest.Events[readyState], response = new Ajax.Response(this);

		if (state == 'Complete') {
			try {
				this._complete = true;
				(this.options['on' + response.status]
					|| this.options['on' + (this.success() ? 'Success' : 'Failure')]
					|| Prototype.emptyFunction)(response, response.headerJSON);
			} catch (e) {
				this.dispatchException(e);
			}

			var contentType = response.getHeader('Content-type');
			if (this.options.evalJS == 'force'
				|| (this.options.evalJS && this.isSameOrigin() && contentType
					&& contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
				this.evalResponse();
		}

		try {
			(this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
			Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
		} catch (e) {
			this.dispatchException(e);
		}

		if (state == 'Complete') {
			this.transport.onreadystatechange = Prototype.emptyFunction;
		}
	},
	BRfinish : function(evt){
		if (this.options.onFinish) this.options.onFinish(this.transport);
	},
	BRcomplete : function(evt){
		if (this.options.onComplete) this.options.onComplete(evt);
	},
	BRerrorUpload : function(exception){
		(this.options.onException || Prototype.emptyFunction)(this, exception);
		Ajax.Responders.dispatch('onException', this, exception);
	},
	BRupdateProgress : function(evt){
		if (this.options.onProgress) this.options.onProgress(evt, evt.loaded, evt.total);
	}
});

Ajax.BinaryRequest.Events =
	['Uninitialized', 'Loading', 'Loaded', 'Finish', 'Progress', 'Complete'];
