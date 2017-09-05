if (typeof console == "undefined" || typeof console.log == "undefined") var console = {
    log: function () {
    }
};

var LazyLoad = (function (doc) {
    var env, head, pending = {}, pollCount = 0, queue = {css: [], js: []}, styleSheets = doc.styleSheets;

    function createNode(name, attrs) {
        var node = doc.createElement(name), attr;
        for (attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                node.setAttribute(attr, attrs[attr])
            }
        }
        return node
    }

    function finish(type) {
        var p = pending[type], callback, urls;
        if (p) {
            callback = p.callback;
            urls = p.urls;
            urls.shift();
            pollCount = 0;
            if (!urls.length) {
                callback && callback.call(p.context, p.obj);
                pending[type] = null;
                queue[type].length && load(type)
            }
        }
    }

    function getEnv() {
        var ua = navigator.userAgent;
        env = {async: doc.createElement('script').async === true};
        (env.webkit = /AppleWebKit\//.test(ua)) || (env.ie = /MSIE|Trident/.test(ua)) || (env.opera = /Opera/.test(ua)) || (env.gecko = /Gecko\//.test(ua)) || (env.unknown = true)
    }

    function load(type, urls, callback, obj, context) {
        var _finish = function () {
            finish(type)
        }, isCSS = type === 'css', nodes = [], i, len, node, p, pendingUrls, url;
        env || getEnv();
        if (urls) {
            urls = typeof urls === 'string' ? [urls] : urls.concat();
            if (isCSS || env.async || env.gecko || env.opera) {
                queue[type].push({urls: urls, callback: callback, obj: obj, context: context})
            } else {
                for (i = 0, len = urls.length; i < len; ++i) {
                    queue[type].push({
                        urls: [urls[i]],
                        callback: i === len - 1 ? callback : null,
                        obj: obj,
                        context: context
                    })
                }
            }
        }
        if (pending[type] || !(p = pending[type] = queue[type].shift())) {
            return
        }
        head || (head = doc.head || doc.getElementsByTagName('head')[0]);
        pendingUrls = p.urls.concat();
        for (i = 0, len = pendingUrls.length; i < len; ++i) {
            url = pendingUrls[i];
            if (isCSS) {
                node = env.gecko ? createNode('style') : createNode('link', {href: url, rel: 'stylesheet'})
            } else {
                node = createNode('script', {src: url});
                node.async = false
            }
            node.className = 'lazyload';
            node.setAttribute('charset', 'utf-8');
            if (env.ie && !isCSS && 'onreadystatechange' in node && !('draggable' in node)) {
                node.onreadystatechange = function () {
                    if (/loaded|complete/.test(node.readyState)) {
                        node.onreadystatechange = null;
                        _finish()
                    }
                }
            } else if (isCSS && (env.gecko || env.webkit)) {
                if (env.webkit) {
                    p.urls[i] = node.href;
                    pollWebKit()
                } else {
                    node.innerHTML = '@import "' + url + '";';
                    pollGecko(node)
                }
            } else {
                node.onload = node.onerror = _finish
            }
            nodes.push(node)
        }
        for (i = 0, len = nodes.length; i < len; ++i) {
            head.appendChild(nodes[i])
        }
    }

    function pollGecko(node) {
        var hasRules;
        try {
            hasRules = !!node.sheet.cssRules
        } catch (ex) {
            pollCount += 1;
            if (pollCount < 200) {
                setTimeout(function () {
                    pollGecko(node)
                }, 50)
            } else {
                hasRules && finish('css')
            }
            return
        }
        finish('css')
    }

    function pollWebKit() {
        var css = pending.css, i;
        if (css) {
            i = styleSheets.length;
            while (--i >= 0) {
                if (styleSheets[i].href === css.urls[0]) {
                    finish('css');
                    break
                }
            }
            pollCount += 1;
            if (css) {
                if (pollCount < 200) {
                    setTimeout(pollWebKit, 50)
                } else {
                    finish('css')
                }
            }
        }
    }

    return {
        css: function (urls, callback, obj, context) {
            load('css', urls, callback, obj, context)
        }, js: function (urls, callback, obj, context) {
            load('js', urls, callback, obj, context)
        }
    }
})(this.document);
var jquery_ui_state = 0;

function compareVersions(installed, required) {
    var a = installed.split('.');
    var b = required.split('.');

    for (var i = 0; i < a.length; ++i) {
        a[i] = Number(a[i]);
    }
    for (var i = 0; i < b.length; ++i) {
        b[i] = Number(b[i]);
    }
    if (a.length == 2) {
        a[2] = 0;
    }

    if (a[0] > b[0]) return true;
    if (a[0] < b[0]) return false;

    if (a[1] > b[1]) return true;
    if (a[1] < b[1]) return false;

    if (a[2] > b[2]) return true;
    if (a[2] < b[2]) return false;

    return true;
}

function load_lazy() {
    lazyReady();
}

function lazyReady() {
    console.log("lazy loaded");
    var version;
    if (typeof jQuery !== "undefined") {
        version = jQuery.fn.jquery;
        console.log("jquery version:" + version);
    }
    if (typeof jQuery === "undefined" || compareVersions(version, "1.11.0") == false) {
        console.log("loading jquery 1.11.0");
        LazyLoad.js('https://code.jquery.com/jquery-1.12.4.js', function () {

            jqReady();
        });
    }
    else {
        jqReady();
    }
}

function jqReady() {
    console.log("jquery loaded");
    var version;
    if (typeof jQuery.ui !== "undefined") {
        version = jQuery.ui.version;
        console.log("jquery-ui version:" + version);
    }
    if (typeof jQuery.ui === "undefined" || compareVersions(version, "1.10.4") == false) {
        console.log("loading jquery-ui");
        LazyLoad.css('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', function () {
            jquiReady(1);
        });
        LazyLoad.css('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css', function () {

        });
        LazyLoad.js('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', function () {
            jquiReady(3);
        });
    }
    else {
        jquiReady(4);
    }
}

function jquiReady(state) {
    console.log("jquery-ui loaded (" + state + ")");
    jquery_ui_state = jquery_ui_state + state;
    if (jquery_ui_state == 4) {

        $("body").append('<div class="modal fade" id="touup_Modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Topup</h4></div><div class="modal-body"><div id="oldform"><form name="formtopup" id="formtopup"><div class="input-group"><span class="input-group-addon" id="sizing-addon2">$</span><input type="number" class="form-control" name="cashcard" placeholder="กรอกเลขอ้างอิง"  aria-describedby="sizing-addon2"></div></form></div><div id="topup_load" align="center"><img id="imgload"></div><div id="result" align="center"><img id="result_img"><p>สถานะ </p> <span id="remark_box"></span><br><br><a href="javascript:location.reload()">ย้อนกลับ</a></div></div> <div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">ยกเลิก</button><button type="button" class="btn btn-success" onclick="Topup()">เติมเงิน</button></div></div></div></div>')
        $("#result").hide();
    }
}
function limitText(limitField, limitNum) {
    if (limitField.value.length > limitNum) {
        limitField.value = limitField.value.substring(0, limitNum);
    }
}
function Topup() {
    $("#oldform").hide()
    $("#topup_load").show()
    $("#imgload").attr("src", "./twtopup/img/topup_loading.gif")
    $.post("./twtopup/checktran.php", {
        txid: $("[name='cashcard']").val(),
        ref1: $("[name='ref1']").val(),
        ref2: $("[name='ref2']").val()
    }, function (dataref) {
        if (dataref.code == "2000") {
            $("#result_img").attr("src", "./twtopup/img/check-icon.png")
            $("#remark_box").text("(เติมเงินสำเร็จ " + dataref.amount + " บาท)")
        } else {
            $("#result_img").attr("src", "./twtopup/img/no-icon.png")
            $("#remark_box").text("(" + dataref.messge + ")")
        }
        $("#topup_load").hide()
        $("#result").show()
    }, "json");

}
if (window.attachEvent && !window.addEventListener) {
    //bad IE
}
else {
    (function () {
        load_lazy();
    })();
}
