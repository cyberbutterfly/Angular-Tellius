import $ from 'jquery';

export /*@ngInject*/ function topDirective($window, $rootScope) {
  return {
    restrict: 'A',
    link: function(s, e, a) {
      e.ready(function (event) {
        var clientWidth = document.documentElement.clientWidth;
        // if (clientWidth < 824)
        // {
        //   $(e).parents('.app').removeClass('extended');
        //   $(e).parents('.hideTooltip').removeClass('hideTooltip');
        // } else {
        //   $(e).parents('.app').addClass('extended');
        //   $(e).find('sidebar').removeClass('extended');
        //   $(e).parents('.hideTooltip').addClass('hideTooltip');
        // }
        // var reqWidth = $('intelliquery').width() + 15;
        // $('.vertical').hide();
        // $('.datasetSelect').width(reqWidth);

        $('.plus-btn').on('click', function (e){
          e.stopPropagation();
          // e.preventDefault();
        });
        $('.main').on('click', function (e){
          if($('.plus-menu').hasClass('active')){
            $rootScope.$broadcast("mainClicked");
            $('.plus-menu').removeClass('active');
          }
          var elem = $(e)[0].toElement;
          if ($(elem).parents(".filter-menu").length == 0) {
            if($('.filter-menu').hasClass('active') && e.target.getAttribute("class").indexOf('chart-options-icon') == -1 && e.target.getAttribute("class").indexOf('right-button') == -1 && e.target.getAttribute("class").indexOf('borderedButton') == -1){
              $rootScope.$broadcast("mainClicked");
              $('.filter-menu').removeClass('active');
              $('.borderedButton').removeClass('active');
            }
          };

        });
      });
      // ****** This may be required later or we can delete it later *******
      // $window.onresize = function(event) {
      //   var clientWidth = document.documentElement.clientWidth;
      //   var reqWidth = $('intelliquery').width() + 15;
      //   $('.datasetSelect').width(reqWidth);
      //   if (clientWidth < 824)
      //   {
      //     $(e).parents('.app').removeClass('extended')
      //     $(e).parents('.body-class').removeClass('hideTooltip');
      //   } else {
      //     $(e).parents('.app').addClass('extended');
      //     e.find('sidebar').removeClass('extended');
      //     $(e).parents('.body-class').addClass('hideTooltip');
      //   }
      //   if (clientWidth < 951)
      //   {
      //     $(e).parents('.app').addClass('test')
      //   } else {
      //     $(e).parents('.app').removeClass('test');
      //   }
      //   if($('.main').find('.head').width() <= 160) {
      //     $('.tooltip--triangle').show();
      //   } else {
      //     $('.tooltip--triangle').hide();
      //   }
      //   if($('.main').find('.tophead-right.largescreen').width() < 459) {
      //     $('.tophead-right.largescreen').css('visibility', 'hidden');
      //     $('.menu-btn-small').show();
      //   } else {
      //     $('.tophead-right.largescreen').css('visibility', 'visible');
      //     $('.menu-btn-small').hide();
      //   }

      // };
    }
  };
}
