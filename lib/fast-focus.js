;(function () {
    var touch = {},
    vague = 5,
    gesture, whiteList = ['INPUT', 'TEXTAREA'];

    function cancelAll() {
        touch = {};
    }

    function isPrimaryTouch(event) {
        return (event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary;
    }

    function isPointerEventType(e, type) {
        return (e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type);
    }

    var firstTouch, _isPointerType;

    if ('MSGesture' in window) {
        gesture = new MSGesture();
        gesture.target = document.body;
    }

    window.addEventListener('scroll', cancelAll);

    var bindWrapper = function (dom) {
        var start = function (e) {
            if ((_isPointerType = isPointerEventType(e, 'down')) && !isPrimaryTouch(e)) {
                return;
            }
            if (whiteList.indexOf(e.target.tagName) < 0) {
                return;
            }

            firstTouch = _isPointerType ? e: e.touches[0];

            if (e.touches && e.touches.length === 1 && touch.x2) {
                touch.x2 = undefined;
                touch.y2 = undefined;
            }
            touch.el = 'tagName' in firstTouch.target ? firstTouch.target: firstTouch.target.parentNode;

            touch.x1 = firstTouch.pageX;
            touch.y1 = firstTouch.pageY;

            if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
        };

        var move = function (e) {
            if ((_isPointerType = isPointerEventType(e, 'move')) && !isPrimaryTouch(e)) {
                return;
            }
            firstTouch = _isPointerType ? e: e.touches[0];
            touch.x2 = firstTouch.pageX;
            touch.y2 = firstTouch.pageY;
        };

        var end = function (e) {
            if ((_isPointerType = isPointerEventType(e, 'up')) && !isPrimaryTouch(e)) {
                return;
            }
            if (!touch.x2 && !touch.y2) {
                if (touch.el) {
                    touch.el.focus();
                    // touch.el.trigger(event);
                }
            } else if (Math.abs(touch.x2 - touch.x1) <= vague && Math.abs(touch.y2 - touch.y1) <= vague) {
                if (touch.el) {
                    touch.el.focus();
                    // touch.el.trigger(event);
                }
            } else {
                touch = {};
            }
        };
        ['touchstart', 'MSPointerDown', 'pointerdown'].forEach(function (item) {
            dom.addEventListener(item, start);
        });

        ['touchmove', 'MSPointerMove', 'pointermove'].forEach(function (item) {
            dom.addEventListener(item, move);
        });

        ['touchend', 'MSPointerUp', 'pointerup'].forEach(function (item) {
            dom.addEventListener(item, end);
        });

        ['touchcancel', 'MSPointerCancel', 'pointercancel'].forEach(function (item) {
            dom.addEventListener(item, cancelAll);
        });
        
    };

    var FastFocus = function (selector, option) {
        var $query = document.querySelectorAll(selector), i;
        for (i = 0; i < $query.length; i++) {
            bindWrapper($query[i]);
        }
    };

    if (typeof define === 'function') {
        define(function() {
            return FastFocus;
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = FastFocus;
    } else {
        this.FastFocus = FastFocus;
    }

}());