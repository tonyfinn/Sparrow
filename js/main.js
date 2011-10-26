var jswiki = new (function() {
	this.storage = localStorage;
	this.pages = {};
	this.converter = new Markdown.Converter();
	this.save_all = function() {
		this.storage['jswiki.pages'] = JSON.stringify(this.pages);	
	};

	this.load_all = function() {
		this.saved_pages = this.storage['jswiki.pages'];
		if(this.saved_pages == null || this.saved_pages == undefined) {
			this.pages = {};
		} else {
			this.pages = JSON.parse(this.storage['jswiki.pages']);
		}
	};

	this.get_page = function(name) {
		var page = this.pages[name];
		if(page == null || page == undefined) {
			return "";
		}
		page = this.pages[name];
		return page;
	};

	this.get_html_page = function(name) {
		var page = this.get_page(name);
		return this.converter.makeHtml(page);
	}

	this.load_hash_page = function() {
		this.set_editing_mode(false);
		var page_name = window.location.hash.substr(1);
		if(page_name.substr(0, 1) == '/') {
			this.load_special_page(page_name.substr(1));
		} else {
			$('#page-name').val(page_name);
			this.load_page(page_name);
		}
	}

	this.load_special_page = function(name) {
		if(name.indexOf('edit/') == 0) {
			this.load_edit_page(name.substr(5))
		} else if(name.indexOf('settings/') == 0) {
			this.load_settings_page();
		} 
	};

	this.load_edit_page = function(name) {
		this.load_page(name, false);
		this.set_editing_mode(true);
	}

	this.load_page = function(name, update_hash) {
		if(typeof update_hash == "undefined") {
			update_hash = true;
		}
		var contents = this.get_page(name);
		var html_contents = this.get_html_page(name);
		$('#current-page').html(html_contents);
		$('#page-name').val(name);
		$('#page-edit-content').val(contents);
		if(update_hash) {
			window.location.hash = '#' + name;
		}
	};

	this.load_settings_page = function() {
		this.set_editing_mode(false);
		$('#current-page').html(
			"No settings yet. <a href=\"#\">Leave the settings page</a>"
		);
	};

	this.save_page = function(name, content) {
		this.pages[name] = content;
		this.save_all();
	};

	this.set_editing_mode = function(editing) {
		$('#current-page').toggle(!editing);
		$('#editing-container').toggle(editing);
		$('#edit-link-container').toggle(!editing);
	}
	this.add_notification = function(level, message) {
		$('#notification-bar').addClass(level).html(message).show();
	}

	this.clear_notifications = function() {
		$('#notification-bar').html('').hide();
	}

	this.edit_page = function() {
		this.set_editing_mode(true);
	}

	this.load_all();

	this.load_hash_page();

	this.set_editing_mode(false);

	$(document).ready(function() {
		if(!Modernizr.localstorage) {
			jswiki.add_notification('error', 'Please use a browser that supports HTML5 localStorage');
		}
		$('#page-select').submit(function(evt) {
			var pagename = $('#page-name').val();
			jswiki.load_page(pagename);
			return false;
		});
		$('#cancel-edit').click(function(evt) {
			jswiki.set_editing_mode(false);
			window.location.hash = '#' + window.location.hash.substr(7);
		});
		$('#page-edit').submit(function(evt) {
			var pagename = $('#page-name').val();
			var contents = $('#page-edit-content').val();
			jswiki.save_page(pagename, contents);
			jswiki.set_editing_mode(false);
			jswiki.load_page(pagename);
			return false;
		});
		$('#notification-close').click(function(evt) {
			this.clean_notifications();
		});
		$(window).bind('hashchange', function(evt) { 
			jswiki.load_hash_page();
		});
		$('#edit-link').click(function() {
			window.location.hash = "#/edit/" + window.location.hash.substr(1)
			jswiki.set_editing_mode(true);
		});
		jswiki.set_editing_mode(false);
		jswiki.clear_notifications();
	});
})();
