var App = function() {
    var page, pageContent, header, sidebar, sBrand, sExtraInfo, sidebarAlt, sScroll, sScrollAlt;    
    var uiInit = function() {
        page            = $('#page-container');
        header          = $('header');
        pageContent     = $('#page-content');

        sidebar         = $('#sidebar');
        sBrand          = $('#sidebar-brand');
        sExtraInfo      = $('#sidebar-extra-info');
        sScroll         = $('#sidebar-scroll');

        sidebarAlt      = $('#sidebar-alt');
        sScrollAlt      = $('#sidebar-scroll-alt');		
      handleSidebar('init');
        handleNav();

        if ((header.hasClass('navbar-fixed-top') || header.hasClass('navbar-fixed-bottom'))) {
            $(window).on('scroll', function(){
                if ($(this).scrollTop() > 50) { header.addClass('navbar-glass');
                } else {header.removeClass('navbar-glass');}});}

        $(window).on('resize orientationchange', function(){ resizePageContent(); }).resize();
        rippleEffect($('.btn-effect-ripple'), 'btn-ripple');
        $('[data-toggle="tabs"] a, .enable-tabs a').click(function(e){ e.preventDefault(); $(this).tab('show'); });
        $('[data-toggle="tooltip"], .enable-tooltip').tooltip({container: 'body', animation: false});    
        $('[data-toggle="popover"], .enable-popover').popover({container: 'body', animation: true});    
        $('.select-chosen').chosen({width: "100%"});
        $('.select-select2').select2();
        $('.input-slider').slider();
        $('.input-tags').tagsInput({ width: 'auto', height: 'auto'});
        $('.input-timepicker').timepicker({minuteStep: 1,showSeconds: true,showMeridian: true});
        $('.input-timepicker24').timepicker({minuteStep: 1,showSeconds: true,showMeridian: false});
        $('.input-datepicker, .input-daterange').datepicker({weekStart: 1}).on('changeDate', function(e){ $(this).datepicker('hide'); });
        $('.toggle-menu .submenu').on('click', function(){
           $(this)
               .parent('li')
               .toggleClass('open');
        });
        $('input, textarea').placeholder();
    };
 var handleSidebar = function(mode){
        if (mode === 'init') {
            handleSidebar('sidebar-scroll');
            handleSidebar('sidebar-alt-scroll');
            var sScrollTimeout;
            $(window).on('resize orientationchange', function(){
                clearTimeout(sScrollTimeout);

                sScrollTimeout = setTimeout(function(){
                    handleSidebar('sidebar-scroll');
                }, 150);
            });
        } else {var windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; if (mode === 'toggle-sidebar') {
                if ( windowW > 991) {
                    if (page.hasClass('sidebar-visible-lg-full')) {page.removeClass('sidebar-visible-lg-full').addClass('sidebar-visible-lg-mini');
                    } else if (page.hasClass('sidebar-visible-lg-mini')) {page.removeClass('sidebar-visible-lg-mini').addClass('sidebar-visible-lg-full');
                    } else {page.addClass('sidebar-visible-lg-mini');}
                    setTimeout(resizePageContent, 50);
                } else { page.toggleClass('sidebar-visible-xs');
                    if (page.hasClass('sidebar-visible-xs')) {handleSidebar('close-sidebar-alt');}}
                handleSidebar('sidebar-scroll');
            }
            else if (mode === 'open-sidebar') {
                if ( windowW > 991) {page.removeClass('sidebar-visible-lg-mini').addClass('sidebar-visible-lg-full');
                } else {page.addClass('sidebar-visible-xs');handleSidebar('close-sidebar-alt');}
                handleSidebar('sidebar-scroll');
                setTimeout(resizePageContent, 50);}
            else if (mode === 'close-sidebar') {if ( windowW > 991) {
                    page.removeClass('sidebar-visible-lg-full').addClass('sidebar-visible-lg-mini');} else {page.removeClass('sidebar-visible-xs');}
                handleSidebar('sidebar-scroll');
            }
            else if (mode === 'toggle-sidebar-alt') {
                if ( windowW > 991) {page.toggleClass('sidebar-alt-visible-lg');
                } else {page.toggleClass('sidebar-alt-visible-xs');
				if (page.hasClass('sidebar-alt-visible-xs')) {handleSidebar('close-sidebar');
                    }}}
            else if (mode === 'open-sidebar-alt') {
                if ( windowW > 991) {page.addClass('sidebar-alt-visible-lg');
                } else { page.addClass('sidebar-alt-visible-xs');
                    handleSidebar('close-sidebar');}}
            else if (mode === 'close-sidebar-alt') {if ( windowW > 991) { page.removeClass('sidebar-alt-visible-lg');} else {  page.removeClass('sidebar-alt-visible-xs');}}
            else if (mode === 'sidebar-scroll') { if (page.hasClass('sidebar-visible-lg-mini') && (windowW > 991)) { 
                    if (sScroll.length && sScroll.parent('.slimScrollDiv').length) {
                        sScroll
                            .slimScroll({destroy: true});
                        sScroll
                            .attr('style', '');
                    }}
                else if ((header.hasClass('navbar-fixed-top') || header.hasClass('navbar-fixed-bottom'))) {
                    var sHeight = $(window).height() - ((sBrand.css('display') === 'none' ? 0 : sBrand.outerHeight()) + (sExtraInfo.css('display') === 'none' ? 0 : sExtraInfo.outerHeight()));
					if ( windowW < 992) { sHeight = sHeight - 50; }
                    if (sScroll.length && (!sScroll.parent('.slimScrollDiv').length)) {
                        sScroll
                            .slimScroll({
                                height: sHeight,
                                color: '#bbbbbb',
                                size: '3px',
                                touchScrollStep: 100,
                                railVisible: false,
                                railOpacity: 1
                            });}
                    else { 
                        sScroll
                            .add(sScroll.parent())
                            .css('height', sHeight);
                    }}}
            else if (mode === 'sidebar-alt-scroll') { 
                if (sScrollAlt.length && (!sScrollAlt.parent('.slimScrollDiv').length)) { 
                    sScrollAlt.slimScroll({
                        height: sidebarAlt.outerHeight(),
                        color: '#bbbbbb',
                        size: '3px',
                        touchScrollStep: 100,
                        railVisible: false,
                        railOpacity: 1
                    });
                    var sScrollAltTimeout;
                    $(window).on('resize orientationchange', function(){
                        clearTimeout(sScrollAltTimeout);
                        sScrollAltTimeout = setTimeout(function(){
                            handleSidebar('sidebar-alt-scroll');
                        }, 150);}); }
                else { sScrollAlt.add(sScrollAlt.parent()).css('height', sidebarAlt.outerHeight());} }}
    };
    var pageLoading = function(){
        var pageWrapper = $('#page-wrapper');

        if (pageWrapper.hasClass('page-loading')) {
            if (page.hasClass('enable-cookies')) {
                setTimeout(function(){
                    pageWrapper.removeClass('page-loading');
                }, 100);
            } else {
                pageWrapper.removeClass('page-loading');
            }
        }
    };

    var handleNav = function() {       
        var allLinks        = $('.sidebar-nav a', sidebar);
        var menuLinks       = $('.sidebar-nav-menu', sidebar);
        var submenuLinks    = $('.sidebar-nav-submenu', sidebar);      
        allLinks.on('click', function(e){
            var link = $(this), ripple, d, x, y;            
            sidebar.find('.sidebar-nav-ripple').removeClass('animate');        
            if(link.children('.sidebar-nav-ripple').length === 0) {
                link.prepend('<span class="sidebar-nav-ripple"></span>');
            }           
            var ripple = link.children('.sidebar-nav-ripple');            
            if(!ripple.height() && !ripple.width()) {
                d = Math.max(link.outerWidth(), link.outerHeight());
                ripple.css({height: d, width: d});
            }        
            x = e.pageX - link.offset().left - ripple.width()/2;
            y = e.pageY - link.offset().top - ripple.height()/2;            
            ripple.css({top: y + 'px', left: x + 'px'}).addClass('animate');
        });
        menuLinks.on('click', function(e){
            var link = $(this);
            var windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;          
            if (page.hasClass('sidebar-visible-lg-mini') && (windowW > 991)) {
                if (link.hasClass('open')) {
                    link.removeClass('open');}
                else {
                    $('#sidebar .sidebar-nav-menu.open').removeClass('open');
                    link.addClass('open');
                }}
            else if (!link.parent().hasClass('active')) {
                if (link.hasClass('open')) {
                    link.removeClass('open');
                }
                else {$('#sidebar .sidebar-nav-menu.open').removeClass('open');link.addClass('open');}
                setTimeout(resizePageContent, 50);}
            return false;});
   
        submenuLinks.on('click', function(e){
            var link = $(this);
            if (link.parent().hasClass('active') !== true) {
                if (link.hasClass('open')) {
                    link.removeClass('open');}
                else {
                    link.closest('ul').find('.sidebar-nav-submenu.open').removeClass('open');
                    link.addClass('open');}            
                setTimeout(resizePageContent, 50);}
            return false;        }); };
    var rippleEffect = function(element, cl){ 
        element.css({
            'overflow': 'hidden',
            'position': 'relative'
        });   
        element.on('click', function(e){
            var elem = $(this), ripple, d, x, y;  
            if(elem.children('.' + cl).length === 0) {
                elem.prepend('<span class="' + cl + '"></span>');}
            else { 
                elem.children('.' + cl).removeClass('animate');}         
            var ripple = elem.children('.' + cl);
            if(!ripple.height() && !ripple.width()) {
                d = Math.max(elem.outerWidth(), elem.outerHeight());
                ripple.css({height: d, width: d});}
            x = e.pageX - elem.offset().left - ripple.width()/2;
            y = e.pageY - elem.offset().top - ripple.height()/2;

            ripple.css({top: y + 'px', left: x + 'px'}).addClass('animate');});
    };

    var resizePageContent = function() {
        var windowH     = $(window).height();
        var headerH     = header.outerHeight();
        var sidebarH    = sidebar.outerHeight();
        if (header.hasClass('navbar-fixed-top') || header.hasClass('navbar-fixed-bottom')) {
            pageContent.css('min-height', windowH);
        } else if (sidebarH > windowH) { pageContent.css('min-height', sidebarH - headerH);
        } else {pageContent.css('min-height', windowH - headerH); }
    };

    var dtIntegration = function() {
        $.extend(true, $.fn.dataTable.defaults, {
            "sDom": "<'row'<'col-sm-6 col-xs-5'l><'col-sm-6 col-xs-7'f>r>t<'row'<'col-sm-5 hidden-xs'i><'col-sm-7 col-xs-12 clearfix'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_",
                "sSearch": "<div class=\"input-group\">_INPUT_<span class=\"input-group-addon\"><i class=\"fa fa-search\"></i></span></div>",
                "sInfo": "<strong>_START_</strong>-<strong>_END_</strong> of <strong>_TOTAL_</strong>",
                "oPaginate": {
                    "sPrevious": "",
                    "sNext": ""
                }}});
        $.extend($.fn.dataTableExt.oStdClasses, {
            "sWrapper": "dataTables_wrapper form-inline",
            "sFilterInput": "form-control",
            "sLengthSelect": "form-control"
        });
    };
    return {
        init: function() {
            uiInit(); 
            pageLoading();
        },
        sidebar: function(mode, extra) {
		  handleSidebar(mode, extra);
        },
        datatables: function() {
            dtIntegration(); 
        },
        pagePrint: function() {           
        }
    };
}();

$(function(){ App.init(); });