; (function($) {
    var touch = {},
    vague = 5,
    gesture;

    function cancelAll() {
        touch = {}
    }

    function isPrimaryTouch(event) {
        return (event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary
    }

    function isPointerEventType(e, type) {
        return (e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type)
    }

    $(document).ready(function() {
        var firstTouch, _isPointerType;

        if ('MSGesture' in window) {
            gesture = new MSGesture();
            gesture.target = document.body;
        }

        $(document)
        .on('touchstart MSPointerDown pointerdown', function(e) {
            if ((_isPointerType = isPointerEventType(e, 'down')) && !isPrimaryTouch(e)) {
                return;
            }
            firstTouch = _isPointerType ? e: e.touches[0];

            if (e.touches && e.touches.length === 1 && touch.x2) {
                touch.x2 = undefined;
                touch.y2 = undefined;
            }

            touch.el = $('tagName' in firstTouch.target ? firstTouch.target: firstTouch.target.parentNode);
            touch.x1 = firstTouch.pageX;
            touch.y1 = firstTouch.pageY;

            if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
        })
        .on('touchmove MSPointerMove pointermove', function(e) {
            if ((_isPointerType = isPointerEventType(e, 'move')) && !isPrimaryTouch(e)) {
                return;
            }
            firstTouch = _isPointerType ? e: e.touches[0];
            touch.x2 = firstTouch.pageX;
            touch.y2 = firstTouch.pageY;
        })
        .on('touchend MSPointerUp pointerup', function(e) {
            if ((_isPointerType = isPointerEventType(e, 'up')) && !isPrimaryTouch(e)) {
                return
            }
            var event = $.Event('tap');

            if (!touch.x2 && !touch.y2) {
                event.cancelTouch = cancelAll;
                if (touch.el) {
                    touch.el.trigger(event);
                }
            } else if (Math.abs(touch.x2 - touch.x1) <= vague && Math.abs(touch.y2 - touch.y1) <= vague) {
                event.cancelTouch = cancelAll;
                if (touch.el) {
                    touch.el.trigger(event);
                }
            } else {
                touch = {};
            }
        }).on('touchcancel MSPointerCancel pointercancel', cancelAll);
        $(window).on('scroll', cancelAll)
    });
    $.fn.tap = function(callback) {
        return this.on('tap', callback)
    };
})(Zepto)