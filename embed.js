function getElementsByClassName(node, classname) {
    if (node.getElementsByClassName) {
        return node.getElementsByClassName(classname);
    } else {
        return (function getElementsByClass(searchClass, node) {
            if (node == null)
                node = document;
            var classElements = [],
                els = node.getElementsByTagName("*"),
                elsLen = els.length,
                pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)"),
                i, j;

            for (i = 0, j = 0; i < elsLen; i++) {
                if (pattern.test(els[i].className)) {
                    classElements[j] = els[i];
                    j++;
                }
            }
            return classElements;
        })(classname, node);
    }
}


function bind_event(obj, evt, fnc) {
    if (obj.addEventListener) {
        obj.addEventListener(evt, fnc, false);
        return true;
    } else if (obj.attachEvent) {
        return obj.attachEvent('on' + evt, fnc);
    } else {
        evt = 'on' + evt;
        if (typeof obj[evt] === 'function') {
            fnc = (function (f1, f2) {
                return function () {
                    f1.apply(this, arguments);
                    f2.apply(this, arguments);
                }
            })(obj[evt], fnc);
        }
        obj[evt] = fnc;
        return true;
    }
    return false;
}


function cancelDefaultAction(e) {
    var evt = e ? e : window.event;
    if (evt.preventDefault) evt.preventDefault();
    evt.returnValue = false;
    return false;
}

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

var open_eshop = open_eshop || {};

// Set width of modal 
open_eshop.width = 480;
// Set height of modal
open_eshop.height = 800;
// Set name of class to trigger model
open_eshop.click_class = 'oe_button';
// Set the css styles here... It would be appended to head
//open_eshop.css = '.oe_button{}';

open_eshop.over = open_eshop.ifrm = {};
open_eshop.init = function (os_ns) {

    //UNCOMMENT THIS IF YOU WANT TO USE BUTTON STYLES
    // t = document.createElement('style');
    // t.type = 'text/css';
    // if (t.styleSheet) {
    //     t.styleSheet.cssText = os_ns.css;
    // } else {
    //     t.appendChild(document.createTextNode(os_ns.css));
    // }
    // document.getElementsByTagName('head')[0].appendChild(t);

    //close the overlay
    bind_event(document, 'click', function (e) {
        clkd = e.target || e.srcElement || window.event.target || window.event.srcElement;
        idd = clkd.getAttribute('id');
        if (typeof idd != 'undefined' && idd != null) {
            var paras = getElementsByClassName(document, 'open_eshop_iframe');
            while (paras[0]) {
                paras[0].parentNode.removeChild(paras[0]);
            }

            document.getElementById("open_eshop_iframe_mask").remove();
        }
    });

    //getting the elements <a by class open_eshop.click_class
    os_ns._eles = getElementsByClassName(document, os_ns.click_class);
    for (i = 0; i < os_ns._eles.length; i++) {

        bind_event(os_ns._eles[i], 'click', function (e) {
            bod = document.body;
            tar = e.target || e.srcElement || window.event.target || window.event.srcElement;

            over = document.createElement("DIV");
            over.style.position = 'fixed';
            over.style.display = 'inline';
            over.setAttribute("id", 'open_eshop_iframe_mask');
            over.style.top = 0;
            over.style.left = 0;
            over.style.margin = 0;
            over.style.padding = 0;
            over.style.width = '100%';
            over.style.height = '100%';
            over.style.background = '#000';
            over.style.opacity = .5;
            over.style.filter = 'alpha(opacity=50)';
            os_ns.over[i] = over;
            bod.appendChild(over);


            ifrm = document.createElement("IFRAME");
            ifrm.setAttribute("src", tar.getAttribute('href'));
            ifrm.setAttribute("id", 'open_eshop_iframe' + i);
            ifrm.setAttribute("class", 'open_eshop_iframe');
            ifrm.style.width = os_ns.width + "px";
            ifrm.style.height = os_ns.height + "px";
            ifrm.style.position = 'absolute';
            ifrm.style.top = '50%';
            ifrm.style.left = '50%';
            ifrm.style.marginLeft = '-' + (os_ns.width / 2) + 'px';
            ifrm.style.marginTop = '-' + (os_ns.height / 2) + 'px';
            ifrm.style.zIndex = 12314242535364778769;
            ifrm.style.border = 0;
            os_ns.ifrm[i] = ifrm;
            bod.appendChild(ifrm);

            cancelDefaultAction(e);
        });

    }

};


window.onload = function () {
    open_eshop.init(open_eshop);
};