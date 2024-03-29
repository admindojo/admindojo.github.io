// Sticky menu
var new_scroll_position = 0;
var last_scroll_position;
var header = document.getElementById("js-header");

window.addEventListener('scroll', function (e) {
    last_scroll_position = window.scrollY;

    // Scrolling down
    if (new_scroll_position < last_scroll_position && last_scroll_position > 40) {
        header.classList.remove("is-visible");
        header.classList.add("is-hidden");

        // Scrolling up
    } else if (new_scroll_position > last_scroll_position) {
        header.classList.remove("is-hidden");
        header.classList.add("is-visible");
    }

    if (last_scroll_position < 1) {
        header.classList.remove("is-visible");
    }

    new_scroll_position = last_scroll_position;
});


// Dropdown menu
(function (menuConfig) {
    /**
     * Merge default config with the theme overrided ones
     */
    var defaultConfig = {
        // behaviour
        mobileMenuMode: 'overlay',
        animationSpeed: 300,
        submenuWidth: 300,
        doubleClickTime: 500,
        mobileMenuExpandableSubmenus: false,
        // selectors
        wrapperSelector: '.navbar',
        buttonSelector: '.navbar__toggle',
        menuSelector: '.navbar__menu',
        submenuSelector: '.navbar__submenu',
        mobileMenuSidebarLogoSelector: null,
        relatedContainerForOverlayMenuSelector: null,
        // CSS classes
        separatorItemClass: 'is-separator',
        parentItemClass: 'has-submenu',
        submenuLeftPositionClass: 'is-left-submenu',
        submenuRightPositionClass: 'is-right-submenu',
        mobileMenuOverlayClass: 'navbar_mobile_overlay',
        mobileMenuSubmenuWrapperClass: 'navbar__submenu_wrapper',
        mobileMenuSidebarClass: 'navbar_mobile_sidebar',
        mobileMenuSidebarOverlayClass: 'navbar_mobile_sidebar__overlay',
        hiddenElementClass: 'is-hidden',
        openedMenuClass: 'is-active',
        noScrollClass: 'no-scroll',
        relatedContainerForOverlayMenuClass: 'is-visible'
    };

    var config = {};

    Object.keys(defaultConfig).forEach(function(key) {
        config[key] = defaultConfig[key];
    });

    if (typeof menuConfig === 'object') {
        Object.keys(menuConfig).forEach(function(key) {
            config[key] = menuConfig[key];
        });
    }

    /**
     * Menu initializer
     */
    function init () {
        if (!document.querySelectorAll(config.wrapperSelector).length) {
            return;
        }

        initSubmenuPositions();

        if (config.mobileMenuMode === 'overlay') {
            initMobileMenuOverlay();
        } else if (config.mobileMenuMode === 'sidebar') {
            initMobileMenuSidebar();
        }
    };

    /**
     * Function responsible for the submenu positions
     */
    function initSubmenuPositions () {
        var submenuParents = document.querySelectorAll(config.wrapperSelector + ' .' + config.parentItemClass);

        for (var i = 0; i < submenuParents.length; i++) {
            submenuParents[i].addEventListener('mouseenter', function () {
                var submenu = this.querySelector(config.submenuSelector);
                var itemPosition = this.getBoundingClientRect().left;
                var widthMultiplier = 2;

                if (this.parentNode === document.querySelector(config.menuSelector)) {
                    widthMultiplier = 1;
                }

                if (config.submenuWidth !== 'auto') {
                    var submenuPotentialPosition = itemPosition + (config.submenuWidth * widthMultiplier);

                    if (window.innerWidth < submenuPotentialPosition) {
                        submenu.classList.add(config.submenuRightPositionClass);
                    } else {
                        submenu.classList.add(config.submenuLeftPositionClass);
                    }
                } else {
                    var submenuPotentialPosition = 0;
                    var submenuPosition = 0;

                    if (widthMultiplier === 1) {
                        submenuPotentialPosition = itemPosition + submenu.clientWidth;
                    } else {
                        submenuPotentialPosition = itemPosition + this.clientWidth + submenu.clientWidth;
                    }

                    if (window.innerWidth < submenuPotentialPosition) {
                        submenu.classList.add(config.submenuRightPositionClass);
                        submenuPosition = -1 * submenu.clientWidth;

                        if (widthMultiplier === 1) {
                            submenuPosition = 0;
                        }

                        submenu.style.left = submenuPosition + 'px';
                        submenu.style.right = this.clientWidth + 'px';
                    } else {
                        submenu.classList.add(config.submenuLeftPositionClass);
                        submenuPosition = this.clientWidth;

                        if (widthMultiplier === 1) {
                            submenuPosition = 0;
                        }

                        submenu.style.left = submenuPosition + 'px';
                    }
                }

                submenu.setAttribute('aria-hidden', false);
            });

            submenuParents[i].addEventListener('mouseleave', function () {
                var submenu = this.querySelector(config.submenuSelector);
                submenu.removeAttribute('style');
                submenu.setAttribute('aria-hidden', true);
            });
        }
    }

    /**
     * Function used to init mobile menu - overlay mode
     */
    function initMobileMenuOverlay () {
        var menuWrapper = document.createElement('div');
        menuWrapper.classList.add(config.mobileMenuOverlayClass);
        menuWrapper.classList.add(config.hiddenElementClass);
        var menuContentHTML = document.querySelector(config.menuSelector).outerHTML;
        menuWrapper.innerHTML = menuContentHTML;
        document.body.appendChild(menuWrapper);

        // Init toggle submenus
        if (config.mobileMenuExpandableSubmenus) {
            wrapSubmenusIntoContainer(menuWrapper);
            initToggleSubmenu(menuWrapper);
        }

        // Init button events
        var button = document.querySelector(config.buttonSelector);

        button.addEventListener('click', function () {
            var relatedContainer = document.querySelector(config.relatedContainerForOverlayMenuSelector);
            menuWrapper.classList.toggle(config.hiddenElementClass);
            button.classList.toggle(config.openedMenuClass);
            button.setAttribute('aria-expanded', button.classList.contains(config.openedMenuClass));

            if (button.classList.contains(config.openedMenuClass)) {
                document.documentElement.classList.add(config.noScrollClass);

                if (relatedContainer) {
                    relatedContainer.classList.add(config.relatedContainerForOverlayMenuClass);
                }
            } else {
                document.documentElement.classList.remove(config.noScrollClass);

                if (relatedContainer) {
                    relatedContainer.classList.remove(config.relatedContainerForOverlayMenuClass);
                }
            }
        });   
    }

    /**
     * Function used to init mobile menu - sidebar mode
     */
    function initMobileMenuSidebar () {
        // Create menu structure
        var menuWrapper = document.createElement('div');
        menuWrapper.classList.add(config.mobileMenuSidebarClass);
        menuWrapper.classList.add(config.hiddenElementClass);
        var menuContentHTML = '';

        if (config.mobileMenuSidebarLogoSelector !== null) {
            menuContentHTML = document.querySelector(config.mobileMenuSidebarLogoSelector).outerHTML;
        }

        menuContentHTML += document.querySelector(config.menuSelector).outerHTML;
        menuWrapper.innerHTML = menuContentHTML;

        var menuOverlay = document.createElement('div');
        menuOverlay.classList.add(config.mobileMenuSidebarOverlayClass);
        menuOverlay.classList.add(config.hiddenElementClass);

        document.body.appendChild(menuOverlay);
        document.body.appendChild(menuWrapper);

        // Init toggle submenus
        if (config.mobileMenuExpandableSubmenus) {
            wrapSubmenusIntoContainer(menuWrapper);
            initToggleSubmenu(menuWrapper);
        }

        // Menu events
        menuWrapper.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        menuOverlay.addEventListener('click', function () {
            menuWrapper.classList.add(config.hiddenElementClass);
            menuOverlay.classList.add(config.hiddenElementClass);
            button.classList.remove(config.openedMenuClass);
            button.setAttribute('aria-expanded', false);
            document.documentElement.classList.remove(config.noScrollClass);
        });

        // Init button events
        var button = document.querySelector(config.buttonSelector);

        button.addEventListener('click', function () {
            menuWrapper.classList.toggle(config.hiddenElementClass);
            menuOverlay.classList.toggle(config.hiddenElementClass);
            button.classList.toggle(config.openedMenuClass);
            button.setAttribute('aria-expanded', button.classList.contains(config.openedMenuClass));
            document.documentElement.classList.add(config.noScrollClass);
        });
    }

    /**
     * Wrap all submenus into div wrappers
     */
    function wrapSubmenusIntoContainer (menuWrapper) {
        var submenus = menuWrapper.querySelectorAll(config.submenuSelector);

        for (var i = 0; i < submenus.length; i++) {
            var submenuWrapper = document.createElement('div');
            submenuWrapper.classList.add(config.mobileMenuSubmenuWrapperClass);
            submenus[i].parentNode.insertBefore(submenuWrapper, submenus[i]);
            submenuWrapper.appendChild(submenus[i]);
        }
    }

    /**
     * Initialize submenu toggle events
     */
    function initToggleSubmenu (menuWrapper) {
        // Init parent menu item events
        var parents = menuWrapper.querySelectorAll('.' + config.parentItemClass);

        for (var i = 0; i < parents.length; i++) {
            // Add toggle events
            parents[i].addEventListener('click', function (e) {
                e.stopPropagation();
                var submenu = this.querySelector('.' + config.mobileMenuSubmenuWrapperClass);
                var content = submenu.firstElementChild;

                if (submenu.classList.contains(config.openedMenuClass)) {
                    var height = content.clientHeight;   
                    submenu.style.height = height + 'px';
                    
                    setTimeout(function () {
                        submenu.style.height = '0px';
                    }, 0);

                    setTimeout(function () {
                        submenu.removeAttribute('style');
                        submenu.classList.remove(config.openedMenuClass);
                    }, config.animationSpeed);
                } else {
                    var height = content.clientHeight;   
                    submenu.classList.add(config.openedMenuClass);
                    submenu.style.height = '0px';
                    
                    setTimeout(function () {
                        submenu.style.height = height + 'px';
                    }, 0);

                    setTimeout(function () {
                        submenu.removeAttribute('style');
                    }, config.animationSpeed);
                }
            });

            // Block links
            var childNodes = parents[i].children;

            for (var j = 0; j < childNodes.length; j++) {
                if (childNodes[j].tagName === 'A') {
                    childNodes[j].addEventListener('click', function (e) {
                        var lastClick = parseInt(this.getAttribute('data-last-click'), 10);
                        var currentTime = +new Date();

                        if (isNaN(lastClick)) {
                            e.preventDefault();
                            this.setAttribute('data-last-click', currentTime);
                        } else if (lastClick + config.doubleClickTime <= currentTime) {
                            e.preventDefault();
                            this.setAttribute('data-last-click', currentTime);
                        } else if (lastClick + config.doubleClickTime > currentTime) {
                            e.stopPropagation();
                        }
                    });
                }
            }
        }
    }

    /**
     * Run menu scripts 
     */
    init();
})(window.publiiThemeMenuConfig);


// Sidebar menu - mobile view
(function() {
    if (window.innerWidth > 900) {
		return;
	}
    var accordion = document.getElementsByClassName("js-sidebar-menu").item(0);
    var sections = [];

    if (accordion) {
          sections = accordion.getElementsByClassName("has-submenu");
    }

    for (var i = 0; i < sections.length; i++) {
        (function() {
            var section = sections.item(i),
                anchor = sections.item(i).children[0],
                below = sections.item(i).children[1];


            anchor.onclick = function (e) {
                if (anchor.tagName === 'A' && !section.classList.contains('active')) {
                    e.preventDefault();
                }

                if (section.classList.contains('active')) {
                    section.classList.remove('active');
                } else {
                    section.classList.add('active');
                }
            }
        })();
    }
})();

// Newsletter popup
(function() {
    var newsletter_submit = document.querySelector('.newsletter-popup__submit');
    var newsletter = document.querySelector('.newsletter-popup');
    var showOnScroll = newsletter.getAttribute('data-show-on-scroll');
    var showAfterTime = newsletter.getAttribute('data-show-after-time');

    if (showOnScroll) {
        showOnScroll = parseInt(showOnScroll, 10);
    } else {
        showOnScroll = false;
    }

    if (showAfterTime) {
        showAfterTime = parseInt(showAfterTime, 10);
    } else {
        showAfterTime = false;
    }

    function showNewsletterOnScroll (e) {
        var position = window.scrollY;

        if (position > showOnScroll && !newsletter.classList.contains('is-visible')) {
                newsletter.classList.add('is-visible');
        }
    }

    if (newsletter_submit) {
        newsletter_submit.addEventListener('click', function () {
            localStorage.setItem('newsletter-subscribe', 'true');
        });

        document.querySelector('.newsletter-popup__close').addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.setItem('newsletter-subscribe', new Date().getTime());
            newsletter.classList.remove('is-visible');

            if (showOnScroll) {
                window.removeEventListener('scroll', showNewsletterOnScroll);
            }
        });
    }

    // Newsletter display
    if (
        newsletter &&
        localStorage.getItem('newsletter-subscribe') !== 'true' &&
        (
            !localStorage.getItem('newsletter-subscribe') ||
            new Date().getTime() - parseInt(localStorage.getItem('newsletter-subscribe'), 10) > (1000 * 60 * 60 * 24 * 30)
        )
    ) {
        if (showOnScroll) {
            window.addEventListener('scroll', showNewsletterOnScroll);
        }

        if (showAfterTime) {
            setTimeout(function () {
                newsletter.classList.add('is-visible');
            }, showAfterTime);
        }
    }
})();

// Share buttons pop-up
(function () {
    // share popup
    let shareButton = document.querySelector('.post__share-button');
    let sharePopup = document.querySelector('.post__share-popup');

    if (shareButton) {
        sharePopup.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        shareButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            sharePopup.classList.toggle('is-visible');
        });

        document.body.addEventListener('click', function () {
            sharePopup.classList.remove('is-visible');
        });
    }

    // link selector and pop-up window size
    var Config = {
        Link: ".js-share",
        Width: 500,
        Height: 500
    };
    // add handler links
    var slink = document.querySelectorAll(Config.Link);
    for (var a = 0; a < slink.length; a++) {
        slink[a].onclick = PopupHandler;
    }
    // create popup
    function PopupHandler(e) {
        e = (e ? e : window.event);
        var t = (e.target ? e.target : e.srcElement);
        // hide share popup
        if (sharePopup) {
            sharePopup.classList.remove('is-visible');
        }
        // popup position
        var px = Math.floor(((screen.availWidth || 1024) - Config.Width) / 2),
            py = Math.floor(((screen.availHeight || 700) - Config.Height) / 2);
        // open popup
        var link_href = t.href ? t.href : t.parentNode.href;
        var popup = window.open(link_href, "social",
            "width=" + Config.Width + ",height=" + Config.Height +
            ",left=" + px + ",top=" + py +
            ",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1");
        if (popup) {
            popup.focus();
            if (e.preventDefault) e.preventDefault();
            e.returnValue = false;
        }

        return !!popup;
    }
})();


