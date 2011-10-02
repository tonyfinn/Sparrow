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
			this.save_page(name, '');
		}
		page = this.pages[name];
		return page;
	};

	this.get_html_page = function(name) {
		var page = this.get_page(name);
		return this.converter.makeHtml(page);
	}

	this.load_hash_page = function() {
		var page_name = window.location.hash.substr(1);
		$('#page-name').val(page_name);
		this.load_page(page_name);
	}

	this.load_page = function(name) {
		var contents = this.get_page(name);
		var html_contents = this.get_html_page(name);
		$('#current-page').html(html_contents);
		$('#page-name').val(name);
		$('#page-edit-content').val(contents);
		window.location.hash = '#' + name;
	};

	this.save_page = function(name, content) {
		this.pages[name] = content;
		this.load_page(name);
		this.save_all();
		this.set_editing_mode(false);
	};

	this.set_editing_mode = function(editing) {
		$('#current-page').toggle(!editing);
		$('#page-edit').toggle(editing);
		$('#edit-container').toggle(!editing);
	}

	this.edit_page = function() {
		this.set_editing_mode(true);
	}

	this.load_all();

	this.load_hash_page();

	this.set_editing_mode(false);

	$(document).ready(function() {
		$('#page-select').submit(function(evt) {
			var pagename = $('#page-name').val();
			jswiki.load_page(pagename);
			return false;
		});
		$('#page-edit').submit(function(evt) {
			var pagename = $('#page-name').val();
			var contents = $('#page-edit-content').val();
			jswiki.save_page(pagename, contents);
			return false;
		});
		$(window).bind('hashchange', function(e) { 
			jswiki.load_hash_page();
		});
		$('#edit-link').click(function() {
			jswiki.set_editing_mode(true);
		});
		jswiki.set_editing_mode(false);
	});
})();
