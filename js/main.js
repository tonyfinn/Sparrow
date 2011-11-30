var jswiki = new (function() {
	// This is set here in case I add an alternate data source
	// for non localStorage supporting browers.
	this.storage = localStorage;
	this.pages = {};
	this.converter = new Markdown.Converter();

	/*
	 * Store all pages as a JSON string as jswiki.pages.
	 */
	this.save_all = function() {
		this.storage['jswiki.pages'] = JSON.stringify(this.pages);	
	};

	/**
	 * Load all pages or set a new blank object as pages if they don't
	 * exist.
	 */
	this.load_all = function() {
		this.saved_pages = this.storage['jswiki.pages'];
		if(this.saved_pages == null || this.saved_pages == undefined) {
			this.pages = {};
		} else {
			this.pages = JSON.parse(this.storage['jswiki.pages']);
		}
	};

	/**
	 * Get a page from storage. The result is just the string of the
	 * page content in Markdown format.
	 */
	this.get_page = function(name) {
		var page = this.pages[name];
		if(page == null || page == undefined) {
			return "";
		}
		page = this.pages[name];
		return page;
	};

	/**
	 * Get a page rendered from the stored Markdown format into HTML form.
	 */
	this.get_html_page = function(name) {
		var page = this.get_page(name);
		return this.converter.makeHtml(page);
	}

	/**
	 * Load a page as determind by the fragment of the URL.
	 */
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

	/**
	 * Load a special page that does not contain content (e.g. editing)
	 */
	this.load_special_page = function(name) {
		if(name.indexOf('edit/') == 0) {
			this.load_edit_page(name.substr(5))
		} else if(name.indexOf('settings/') == 0) {
			this.load_settings_page();
		} 
	};

	/**
	 * Load the editing elements and content of a stored page.
	 */
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

		// The update_hash property is set because sometimes
		// it can cause a loop of the hash changing, causing a new
		// page load, which sets a new hash and so on.
		if(update_hash) {
			window.location.hash = '#' + name;
		}
	};

	/**
	 * Load the settings page where a user can edit their settings.
	 *
	 * There are currently no settings to change however.
	 */
	this.load_settings_page = function() {
		this.set_editing_mode(false);
		$('#current-page').html(
			"No settings yet. <a href=\"#\">Leave the settings page</a>"
		);
	};

	/**
	 * Save a page to storage so that it can be loaded again
	 * in a future editing session.
	 */
	this.save_page = function(name, content) {
		this.pages[name] = content;
		this.save_all();
	};

	/**
	 * Toggle whether or not the editing tools are loaded or not.
	 */
	this.set_editing_mode = function(editing) {
		$('#current-page').toggle(!editing);
		$('#editing-container').toggle(editing);
		$('#edit-link-container').toggle(!editing);
	}

	/**
	 * Add a new notification of a change to the user in the notification
	 * bar.
	 */
	this.add_notification = function(level, message) {
		$('#notification-bar').addClass(level).html(message).show();
	}

	/** 
	 * Remove all notifications from the notification bar.
	 */
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
		// Ensure local Storage is available.
		if(!Modernizr.localstorage) {
			jswiki.add_notification('error', 'Please use a browser that supports HTML5 localStorage');
		}
		// Load a new page when the button is pressed.
		$('#page-select').submit(function(evt) {
			var pagename = $('#page-name').val();
			jswiki.load_page(pagename);
			return false;
		});
		// Return from editing mode to viewing mode when cancelled.
		$('#cancel-edit').click(function(evt) {
			jswiki.set_editing_mode(false);
			// 7 = #/edit/
			window.location.hash = '#' + window.location.hash.substr(7);
		});
		// Save the edited contents of a page from the form.
		$('#page-edit').submit(function(evt) {
			var pagename = $('#page-name').val();
			var contents = $('#page-edit-content').val();
			jswiki.save_page(pagename, contents);
			jswiki.set_editing_mode(false);
			jswiki.load_page(pagename);
			return false;
		});
		// Clear all notifications when the close button is clicked.
		$('#notification-close').click(function(evt) {
			this.clean_notifications();
		});
		// load a new page on hashchange.
		$(window).bind('hashchange', function(evt) { 
			jswiki.load_hash_page();
		});
		// Load a page for editing and all the editing controls when 
		// the edit link is clicked
		$('#edit-link').click(function() {
			window.location.hash = "#/edit/" + window.location.hash.substr(1)
			jswiki.set_editing_mode(true);
		});
		
		// No notifications and no editing controls by default.
		jswiki.set_editing_mode(false);
		jswiki.clear_notifications();
	});
})();
