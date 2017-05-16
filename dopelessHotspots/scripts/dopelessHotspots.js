/*!
 * Dopeless Hotspots - jQuery Plugin
 * version: 1.1 (12/03/2013)
 *
 * Documentation and license http://www.dopeless-design.de/dopeless-hotspots-jquery-plugin-easy-hotspots-integration.html
 *
 * (c) 2013 Dopeless Design (Rostyslav Chernyakhovskyy) - mail@dopeless-design.de
 */

(function( $ ){
    
    var is_touch_device;
    if (window.navigator.msMaxTouchPoints) {
        is_touch_device = true;
    }
    else {
        is_touch_device = false;
    }
    
$.fn.dopelesshotspots = function( options ) {  
    var settings = $.extend( {
        'hotspotsTitle' : 'Highlights',
        'maxHotspotWidth' : 30,
        'showMenu' : true,
        'showHideBut' : true
    }, options);
    
   
    var toti;
    var holder = $(this);
    var menuWidth,imageWidth,imageHeight;
    var hotspotsHidden = false;
    var counthotspots =  holder.find('.sethotspot').length;
    var hotspotsTitle = settings.hotspotsTitle;
    var maxHotspotWidth = settings.maxHotspotWidth;
    var showMenu = settings.showMenu;
    var hideBut = (settings.showHideBut) ? '<a href="#" class="hide_hotspots"></a>' : '';
    var showHideBut = settings.showHideBut;
    holder.css({'position':'relative','z-index':1,'overflow':'hidden'});
    preload();
    
    $(document).on('click','.highlights_but',function(e){e.preventDefault();});

    if(!is_touch_device){
        holder.on('click',function(){
            if(!hotspotsHidden){
                collapseHighlight();
            }
        });
        
        holder.on('mouseenter','.highlights_menu:not(.hidden)',function(){
            $(this).find('.hotspots_select').css('display', 'block');
            $(this).find('.hotspots_select').stop().animate({'margin-top':0,'opacity':1},100);
            $(this).on('mouseleave',function(){
                $(this).find('.hotspots_select').stop().animate({'margin-top':-30,'opacity':0},100,function(){
                    $(this).css('display', 'none');
                });
            })
        });
        
        holder.on('click','.hotspot_link',function(e){
            e.stopPropagation();
            e.preventDefault();
        });
        
        holder.on('click','.hotspot_link:not(.active)',function(e){
            e.stopPropagation();
            holder.find('.hotspot_link').removeClass('active');
            $(this).addClass('active');
            var itemid = parseInt($(this).attr('href'));
            collapseHighlight();
            expandHighlight(itemid);
        });
        
        holder.on( 'click', '.hotspot:not(.expanded)', function(e){
            e.stopPropagation();
            var itemid = parseInt($(this).attr('id').replace('hs',''));
            collapseHighlight();
            expandHighlight(itemid); 
        });
        
        holder.on( 'click', '.hotspot.expanded', function(e){
            e.stopPropagation();
            e.preventDefault();
        });
            
        holder.on( 'click', '.hotspot_icon.minus', function(e){
            e.stopPropagation();
            collapseHighlight();
        })
        
        holder.on('click','.hide_hotspots',function(e){
            e.stopPropagation();
            e.preventDefault();
            hideHighlights();
        })
        
        holder.on('click','.show_hotspots',function(e){
            e.stopPropagation();
            e.preventDefault();
            unhideHighlights();
        })
    }
        
    if(is_touch_device){
        holder.on('touchend',function(){
            if(!hotspotsHidden){
                collapseHighlight();
            }
        });
        
        holder.on('touchend','.highlights_menu:not(.hidden)',function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('touch_exp');
            $(this).find('.hotspots_select').css('display', 'block');
            $(this).find('.hotspots_select').stop().animate({'margin-top':0,'opacity':1},100);
            holder.on('touchend','.highlights_menu.touch_exp',function(e){
                e.preventDefault();
                e.stopPropagation();
                $(this).find('.hotspots_select').stop().animate({'margin-top':-30,'opacity':0},100,function(){
                    $(this).css('display', 'none');
                    holder.find('.highlights_menu').removeClass('touch_exp');
                });
            })
        });
        
        holder.on('touchend','.hotspot_link',function(e){
            e.stopPropagation();
            e.preventDefault();
        });
        
        holder.on('touchend','.hotspot_link:not(.active)',function(e){
            e.stopPropagation();
            holder.find('.hotspot_link').removeClass('active');
            $(this).addClass('active');
            var itemid = parseInt($(this).attr('href'));
            collapseHighlight();
            expandHighlight(itemid);
        });
        
        holder.on( 'touchend', '.hotspot:not(.expanded)', function(e){
            e.stopPropagation();
            var itemid = parseInt($(this).attr('id').replace('hs',''));
            collapseHighlight();
            expandHighlight(itemid); 
        });
        
        holder.on( 'touchend', '.hotspot.expanded', function(e){
            e.stopPropagation();
            e.preventDefault();
        });
            
        holder.on( 'touchend', '.hotspot_icon.minus', function(e){
            e.stopPropagation();
            collapseHighlight();
        })
        
        holder.on('touchend','.hide_hotspots',function(e){
            e.stopPropagation();
            e.preventDefault();
            hideHighlights();
        })
        
        holder.on('touchend','.show_hotspots',function(e){
            e.stopPropagation();
            e.preventDefault();
            unhideHighlights();
        })
    }
        
    function preload() {
        var hsImage = holder.find('img');
        var plImage = new Image();
        plImage.src = hsImage.attr("src");
        plImage.onerror = function(){
            alert('Wrong image URL')
            return false();
        }
        plImage.onload =  function(){
            imageWidth = plImage.width;
            imageHeight = plImage.height;
            holder.css({'width':imageWidth,'height':imageHeight});
            maxHotspotWidth = Math.abs(imageWidth*maxHotspotWidth/100);
            shownHotspots = new Array();
            toti = new Array();
            holder.find('.sethotspot').each(function(index){
                var posix = $(this).attr('posix');
                var posiy = $(this).attr('posiy');
                var title = $(this).attr('title');
                var zoomImage = $(this).attr('href');
                var text = $(this).text();
                $(this).remove();
                toti[index] = new Object();
                toti[index]["posix"] = posix;
                toti[index]["posiy"] = posiy;
                toti[index]["title"] = title;
                toti[index]["zoomImage"] = zoomImage;
                toti[index]["text"] = text;
                if(showMenu){
                    if((index + 1) == counthotspots){
                        holder.append('<div class="highlights_menu"><span class="highlights_menu_title">'+hotspotsTitle+'</span>'+hideBut+'<a href="#" class="show_hotspots"></a><ul class="hotspots_select"></ul></div>');
                        for (var i = 0; i < toti.length; i++) {
                            holder.find('.hotspots_select').append('<li><a href="'+i+'" class="hotspot_link">'+toti[i].title+'</a></li>');
                            $('.highlights_item').css({'display':'none'});
                        }
                        menuWidth = holder.find('.highlights_menu').outerWidth();
                        holder.find('.highlights_menu').css({'width':menuWidth});
                        holder.find('.highlights_menu_title').css({'padding':0});
                    }
                }
                if(!showMenu && showHideBut){
                    if((index + 1) == counthotspots){
                        holder.append('<div class="highlights_menu nomenu">'+hideBut+'<a href="#" class="show_hotspots"></a></div>');
                    }
                }
                showHighlights();
            });
        }
    }
    
    function showHighlights(itemid){
        for (var i = 0; i < toti.length; i++) {
            if($.inArray(i, shownHotspots) == -1 ){
                holder.append('<div class="hotspot" id="hs'+i+'"><a class="hotspot_icon plus"></a></div>');
                holder.find('#hs'+i+'').css({
                    'top':toti[i].posiy+'%',
                    'left':toti[i].posix+'%'
                }).fadeIn(150);
                shownHotspots.push(i);
            }
        }
        if(itemid !== undefined){
            expandHighlight(itemid);
        }
    }
    
    function expandHighlight(itemid){
        if(itemid !== undefined){
            holder.find('.hotspot_link').removeClass('active');
            holder.find('.hotspot_link[href="'+itemid+'"]').addClass('active');
            
            var hsPosition = holder.find('#hs'+itemid+'').position();
            var hsPositionLeft = Math.ceil(hsPosition.left);
            var hsPositionTop = Math.ceil(hsPosition.top);
            
            
            holder.find('#hs'+itemid+'').addClass('expanded').css({'max-width':maxHotspotWidth,'left':0,'top':0}).append('<span class="hotspot_title">'+toti[itemid].title+'</span>');
            if(toti[itemid].text){
                holder.find('#hs'+itemid+'').append('<span class="hotspot_text">'+toti[itemid].text+'</span>');
            }
            var hsWidth = holder.find('#hs'+itemid+'').outerWidth();
            var hsHeight = holder.find('#hs'+itemid+'').outerHeight();
            
            if(hsPositionLeft > (imageWidth - hsWidth - 15)){
                holder.find('#hs'+itemid+'').addClass('posr');
            }
            if(hsPositionTop > (imageHeight - hsHeight - 15)){
                holder.find('#hs'+itemid+'').addClass('posb');
                holder.find('#hs'+itemid+'').find('.hotspot_text').remove();
                holder.find('#hs'+itemid+'').prepend('<span class="hotspot_text">'+toti[itemid].text+'</span>');
            }
            
            holder.find('#hs'+itemid+'').css({'margin-left':-30,'margin-top':-30,'left':hsPositionLeft,'top':hsPositionTop});
            
            if (holder.find('#hs'+itemid+'').is('.posr')) {
                var newhsPositionX = hsPositionLeft - hsWidth + 25;
                holder.find('#hs'+itemid+'').css({'left':newhsPositionX+'px','margin-left':30});
            } 
            if (holder.find('#hs'+itemid+'').is('.posb')) {
                var newhsPositionY = hsPositionTop - hsHeight + 25;
                holder.find('#hs'+itemid+'').css({'top':newhsPositionY+'px','margin-top':30});
            }
            
            
            holder.find('#hs'+itemid+'').find('.hotspot_icon').removeClass('plus').addClass('minus');    
            holder.find('#hs'+itemid+'').css({'width':'auto','display':'block'});
            holder.find('#hs'+itemid+'').stop().animate({'margin':0,'opacity':1},150);
            
            var expandedhsPosition = holder.find('#hs'+itemid+'').position();
            var hsPositionX = Math.ceil(expandedhsPosition.left);
            var hsPositionY = Math.ceil(expandedhsPosition.top);
            
            var zoomImg = new Image();
            zoomImg.onerror = function(){
                return false;
            }
            zoomImg.onload =  function(){
                var zoomImageWidth = zoomImg.width;
                var zoomImageHeight = zoomImg.height;
                poseZoomImage(hsWidth,hsHeight,hsPositionX,hsPositionY,zoomImageWidth,zoomImageHeight,toti[itemid].zoomImage);
            }
            zoomImg.src = toti[itemid].zoomImage;
        }
    }
    function poseZoomImage(hsWidth,hsHeight,hsPositionX,hsPositionY,zoomImageWidth,zoomImageHeight,src){
        var cssTop,cssLeft,arrowLeft,arrowTop,arrowX,arrowY;
        var arrowVert = false;
        if(hsPositionX - 10 >= zoomImageWidth && imageHeight - hsPositionY >= zoomImageHeight){
            cssLeft = hsPositionX - zoomImageWidth - 10;
            cssTop = hsPositionY;
            arrowLeft = zoomImageWidth;
            arrowTop = 20;
            arrowX = -27;
            arrowY = -9;
            arrowVert = true;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(hsPositionX - 10 >= zoomImageWidth && hsPositionY + hsHeight >= zoomImageHeight){
            cssLeft = hsPositionX - zoomImageWidth - 10;
            cssTop = hsPositionY + hsHeight - zoomImageHeight;
            arrowLeft = zoomImageWidth;
            arrowTop = zoomImageHeight - 38;
            arrowX = -27;
            arrowY = -9;
            arrowVert = true;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(imageHeight - hsPositionY - hsHeight - 10 >= zoomImageHeight && imageWidth - hsPositionX >= zoomImageWidth){
            cssLeft = hsPositionX;
            cssTop = hsPositionY + hsHeight + 10;
            arrowLeft = 20;
            arrowTop = -9;
            arrowX = -9;
            arrowY = 0;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(hsPositionY - 10 >= zoomImageHeight && imageWidth - hsPositionX >= zoomImageWidth){
            cssLeft = hsPositionX;
            cssTop = hsPositionY - zoomImageHeight - 10;
            arrowLeft = 20;
            arrowTop = zoomImageHeight;
            arrowX = -9;
            arrowY = -27;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(imageHeight - hsPositionY - hsHeight - 10 >= zoomImageHeight && hsPositionX + hsWidth >= zoomImageWidth){
            cssLeft = hsPositionX + hsWidth - zoomImageWidth;
            cssTop = hsPositionY + hsHeight + 10;
            arrowLeft = zoomImageWidth - 38;
            arrowTop = -9;
            arrowX = -9;
            arrowY = 0;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(hsPositionY - 10 >= zoomImageHeight && hsPositionX + hsWidth >= zoomImageWidth){
            cssLeft = hsPositionX + hsWidth - zoomImageWidth;
            cssTop = hsPositionY - 10 - zoomImageHeight;
            arrowLeft = zoomImageWidth - 38;
            arrowTop = zoomImageHeight;
            arrowX = -9;
            arrowY = -27;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(imageWidth - hsPositionX - hsWidth - 10 >= zoomImageWidth && imageHeight - hsPositionY >= zoomImageHeight){
            cssLeft = hsPositionX + hsWidth + 10;
            cssTop = hsPositionY;
            arrowLeft = -9;
            arrowTop = 20;
            arrowX = 0;
            arrowY = -9;
            arrowVert = true;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(imageWidth - hsPositionX - hsWidth - 10 >= zoomImageWidth && hsPositionY + hsHeight >= zoomImageHeight){
            cssLeft = hsPositionX + hsWidth + 10;
            cssTop = hsPositionY + hsHeight;
            arrowLeft = -9;
            arrowTop = zoomImageHeight - 38;
            arrowX = 0;
            arrowY = -9;
            arrowVert = true;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(hsPositionX - 10 >= zoomImageWidth){
            cssLeft = hsPositionX - zoomImageWidth - 10;
            cssTop = Math.ceil((imageHeight - zoomImageHeight)/2);
            arrowLeft = zoomImageWidth;
            arrowTop = Math.ceil(zoomImageHeight/2) - 9;
            arrowX = -27;
            arrowY = -9;
            arrowVert = true;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(imageHeight - hsPositionY - hsHeight - 10 >= zoomImageHeight){
            cssLeft = Math.ceil((imageWidth - zoomImageWidth)/2);
            cssTop = hsPositionY + hsHeight + 10;
            arrowLeft = Math.ceil(zoomImageWidth/2) - 9
            arrowTop = -9;
            arrowX = -9;
            arrowY = 0;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(hsPositionY - 10 >= zoomImageWidth){
            cssLeft = Math.ceil((imageWidth - zoomImageWidth)/2);
            cssTop = hsPositionY - zoomImageHeight - 10;
            arrowLeft = Math.ceil(zoomImageWidth/2) - 9
            arrowTop = zoomImageHeight;
            arrowX = -9;
            arrowY = -27;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
        if(imageWidth - hsPositionX - hsWidth - 10 >= zoomImageWidth){
            cssLeft = hsPositionX + hsWidth + 10;
            cssTop = Math.ceil((imageHeight - zoomImageHeight)/2);
            arrowLeft = -9;
            arrowTop = Math.ceil(zoomImageHeight/2) - 9;
            arrowX = 0;
            arrowY = -9;
            arrowVert = true;
            showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert);
            return true;
        }
    }
    function showZoomImage(src,cssTop,cssLeft,zoomImageWidth,zoomImageHeight,arrowLeft,arrowTop,arrowX,arrowY,arrowVert){
        holder.append('<div class="zoom_image"><img src='+src+'><div class="image_shadow"></div><div class="hotspot_arrow"></div></div>');
        holder.find('.image_shadow').css({'width':zoomImageWidth,'height':zoomImageHeight});
        holder.find('.hotspot_arrow').css({'left':arrowLeft,'top':arrowTop,'backgroundPosition':''+arrowX+'px '+arrowY+'px'});
        if(arrowVert){
            holder.find('.hotspot_arrow').css({'width':9,'height':18});
        }
        else{
            holder.find('.hotspot_arrow').css({'width':18,'height':9});
        }
        holder.find('.zoom_image').css({'left':cssLeft,'top':cssTop}).fadeIn(150);
    }
    function collapseHighlight(){
        holder.find('.hotspot_link').removeClass('active');
        holder.find('.expanded').each(function(){
            var itemid = parseInt($(this).attr('id').replace('hs',''));
            var newmarginleft = -30;
            var newmargintop = -30;
                
            if ($(this).is('.posr')) {
                newmarginleft = 30;
            }
            if ($(this).is('.posb')) {
                newmargintop = 30;
            }   
            holder.find('.expanded').stop().animate({'margin-left':newmarginleft,'margin-top':newmargintop,'opacity':0},150,function(){
                $(this).remove();
                shownHotspots = jQuery.grep(shownHotspots, function(value) {
                    return value != itemid;
                });   
            showHighlights();
            });
            holder.find('.zoom_image').fadeOut(150).remove();
        });
    }
    
    function hideHighlights(){
        hotspotsHidden = true;
        holder.find('.hotspot').fadeOut(120);
        holder.find('.zoom_image').fadeOut(150);
        holder.find('.hotspots_select').stop().animate({'margin-top':-30,'opacity':0},120,function(){
            holder.find('.hotspots_select').css('display', 'none');
            holder.find('.highlights_menu').find('.highlights_menu_title').empty();
            holder.find('.highlights_menu').animate({'width':'30px'},120);
            if(showMenu){
                holder.find('.highlights_menu').find('.hide_hotspots').fadeOut(120,function(){
                    holder.find('.highlights_menu').find('.show_hotspots').fadeIn(120);
                    holder.find('.highlights_menu').addClass('hidden');
                });
            }
        });
        if(!showMenu && showHideBut){
            holder.find('.highlights_menu').find('.hide_hotspots').fadeOut(120,function(){
                holder.find('.highlights_menu').find('.show_hotspots').fadeIn(120);
                holder.find('.highlights_menu').addClass('hidden');
            });
        }
    };
    
    function unhideHighlights(){
        hotspotsHidden = false;
        holder.find('.hotspot').fadeIn(150);
        holder.find('.highlights_menu').animate({'width':menuWidth},120);
        holder.find('.highlights_menu').find('.highlights_menu_title').html(hotspotsTitle);
        if (holder.find('.zoom_image').length){
                holder.find('.zoom_image').fadeIn(150);
        }
        holder.find('.highlights_menu').find('.show_hotspots').fadeOut(120,function(){
            holder.find('.highlights_menu').find('.hide_hotspots').fadeIn(120);
            holder.find('.hotspots_select').css('display', 'block');
            holder.find('.hotspots_select').stop().animate({'margin-top':0,'opacity':1},120);
            holder.find('.highlights_menu').removeClass('hidden');
        });
    };
};
})( jQuery );