(function($)
{
	$.fn.coverImg=function(options) {
	
		var defauts=
		{
		   'type': "img",
		   'fullscreen': true,
		   'imgWidth' : null,
		   'imgHeight' : null,
		   'smartresize' : false
		};
		
		var parametres=$.extend(defauts, options); 
	
		return this.each(function(){
		
			var _this = this;			
						
			function calcul(container, widthImg, heightImg) {
				var width = container.width();
				var height = container.height();
				
				var ratioImg = widthImg/heightImg;
				var ratio = width/height;
				
				if(ratio >= ratioImg){ 
					trueSizeWidthImg = width; //largeur de l'image adapté à la fenêtre
					trueSizeHeightImg = Math.ceil(heightImg * (trueSizeWidthImg / widthImg)); //hauteur de l'image adapté à la fenêtre 
					gapY = parseInt((trueSizeHeightImg - height) / 2); //position sur l'axe X de l'image
					gapX = 0;  //décalage pour centrer l'image sur l'axe des X
				}
				else {
					trueSizeHeightImg = height; //hauteur de l'image adapté à la fenêtre
					trueSizeWidthImg = Math.ceil(widthImg * (trueSizeHeightImg / heightImg)); //largeur de l'image adapter à la fenêtre
					gapX = parseInt((trueSizeWidthImg - width) / 2); //décalage pour centrer l'image sur l'axe des X
					gapY = 0; // position sur l'axe X de l'image
				}
				
				return {
			        'trueSizeWidthImg': trueSizeWidthImg,
			        'trueSizeHeightImg': trueSizeHeightImg,
			        'gapX': gapX,
			        'gapY': gapY
			    };
			}
			
			function resizeImg(container, img){
				
				var widthImg = img.width();
				var heightImg = img.height();

				var result = calcul(container, widthImg, heightImg);
			
				img.css({"width" : result.trueSizeWidthImg + "px", "height":  result.trueSizeHeightImg + "px "});
				img.css({"left": "-" + result.gapX  + "px", "top" :  -result.gapY  + "px"});
			}
			
			function resizeBackground(container){

				var heightImg = parametres.imgHeight;
				var widthImg = parametres.imgWidth;
												
				var result = calcul(container, widthImg, heightImg);
				
				container.css({"background-size": result.trueSizeWidthImg + "px " + result.trueSizeHeightImg + "px"});
				container.css({"background-position": "-" + result.gapX + "px -" + result.gapY + "px"});
				
			}
			
			function defineHeight() {
				if(parametres.fullscreen == true){
					var height = $(window).height();
					var width = $(window).width();
					
					$(_this).css({"height": height, "width": width});
				}
				
				if(parametres.type == "img"){
					resizeImg($(_this), $(_this).children("img"));
				}
				if(parametres.type == "background"){
					resizeBackground($(_this));
				}
			}
			
			$(window).load(function(){
				defineHeight();
			});
			
			if(parametres.smartresize){
				(function($,sr){
				
				  // debouncing function from John Hann
				  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
				  var debounce = function (func, threshold, execAsap) {
				      var timeout;
				
				      return function debounced () {
				          var obj = this, args = arguments;
				          function delayed () {
				              if (!execAsap)
				                  func.apply(obj, args);
				              timeout = null;
				          };
				
				          if (timeout)
				              clearTimeout(timeout);
				          else if (execAsap)
				              func.apply(obj, args);
				
				          timeout = setTimeout(delayed, threshold || 100);
				      };
				  }
				  // smartresize 
				  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
				
				})(jQuery,'smartresize');
				
				// Appel smartresize
				
				$(window).smartresize(function(){
					defineHeight();
				});			
			}
			else {
				$(window).resize(function() {
					defineHeight();
				});
			}
		
		});		
	};
})(jQuery);