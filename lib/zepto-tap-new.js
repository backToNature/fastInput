;(function ($) {
    function isPointerEventType(e, type){
        return (e.type == 'pointer'+type ||
        e.type.toLowerCase() == 'mspointer'+type)
    }

    $(function () {
        var eventData = {}, firstTouch, vague = 5;

        var cancelAll = function () {
            eventData = {};
        };

        $(document)
        .on('touchstart MSPointerDown pointerdown', function (e) {
            if (e.which && e.which !== 1) {
                return;
            }
            eventData.event = e.changedTouches ? e.changedTouches[0] : e;
            firstTouch = e.touches[0]
            eventData.target = e.target;
            eventData.startX = e.changedTouches[0].pageX;
            eventData.startY = e.changedTouches[0].pageY;
            eventData.el = $('tagName' in firstTouch.target ?
            firstTouch.target : firstTouch.target.parentNode)
        })
        .on('touchmove MSPointerMove pointermove', function (e) {
            eventData.event = e.changedTouches ? e.changedTouches[0] : e;
            eventData.pageX = eventData.event.pageX;
            eventData.pageY = eventData.event.pageY;
        })
        .on('touchend MSPointerUp pointerup', function (e) {
            eventData.event = e.changedTouches ? e.changedTouches[0] : e;
            event.pageX = eventData.event.pageX;
            event.pageY  = eventData.event.pageY;
            if (eventData.target === e.target && Math.abs(eventData.startY - event.pageY) <= vague) {
                eventData.el.trigger('tap');
            }
        })
        .on('touchcancel MSPointerCancel pointercancel', cancelAll);

        $(window).on('scroll', cancelAll);
    });

    $.fn.tap = function (callback) {return this.on('tap', callback)};
    
}(Zepto));