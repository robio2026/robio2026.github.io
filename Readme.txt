Thanks for downloading this template!

Template Name: Story
Template URL: https://bootstrapmade.com/story-bootstrap-blog-template/
Author: BootstrapMade.com
License: https://bootstrapmade.com/license/

========================================
ROBIO 2026 Site Architecture Notes
========================================

This website now uses a shared navigation/footer injection pattern to reduce
copy-paste maintenance across HTML pages.

1) Shared navigation and footer
- All pages keep this placeholder:
	<nav id="navmenu" class="navmenu" data-nav-inject="true"></nav>
- All pages keep this placeholder:
	<div id="footer-links" class="row justify-content-between align-items-start"></div>
- The actual links are rendered in assets/js/main.js from these data sources:
	- navItems
	- footerColumns

2) Active menu highlight rule
- assets/js/main.js computes the current file name from location.pathname.
- Matching link(s) receive class="active" automatically.

3) Page metadata convention
- Title format: ROBIO 2026 - <Page Name>
- Each page includes non-empty description and keywords meta tags.
- Body class format: page-<page-name>

4) Vendor script loading rule
- Swiper CSS/JS is loaded only by index.html.
- php-email-form and purecounter were removed from all pages because they are not used.

5) How to add a new top-level page
- Create newpage.html with:
	- standard head metadata
	- body class (for example: page-newpage)
	- nav/footer placeholders listed in section 1
- Add one menu item in assets/js/main.js -> navItems.
- If needed in footer, add it to assets/js/main.js -> footerColumns.
