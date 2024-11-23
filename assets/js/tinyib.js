//var form = document.getElementById('postform');
//var drag_lX,drag_lY,drag_curX,drag_curY,drag_element;
//form.onmousedown=function(event){ drag_element=this; return draggable(event,this); };

window.Y = function (s, c, x) {
  var r = document.querySelectorAll(s);
  return r.length
    ? c
      ? [].forEach.call(
          r,
          x
            ? function (e) {
                e.addEventListener(c, x, !!0);
              }
            : c,
        )
      : r[0]
    : null;
};

function _clear(e) {
  if (e) while (e.firstChild) e.removeChild(e.firstChild);
}
function _remove(e) {
  e.parentNode.removeChild(e);
}
function _id(id) {
  return document.getElementById(id);
}
function _class(cl) {
  return document.getElementsByClassName(cl);
}
function _selector(s) {
  return document.querySelectorAll(s);
}
function _create(e, id) {
  var T = document.createElement(e);
  if (typeof id === 'string') T.id = id;
  return T;
}
function _toggle(e) {
  e.hasAttribute('hidden') ? e.removeAttribute('hidden') : e.setAttribute('hidden', true);
}
function _define(id, scope, tagname) {
  return _id(id) || (_id(scope) || document.body).appendChild(_create(tagname ? tagname : 'div', id));
}
function _each(nodelist, callback) {
  Array.prototype.forEach.call(nodelist, callback);
}
function _apply(selector, callback) {
  _each(_selector(selector), callback);
}
function _findnext(element, nodename) {
  nodename = nodename.toUpperCase();
  while (element.nextElementSibling) {
    element = element.nextElementSibling;
    if (element.tagName == nodename) return element;
  }
  return null;
}
function _findparent(element, nodename) {
  nodename = nodename.toUpperCase();
  while (element.parentNode) {
    element = element.parentNode;
    if (element.tagName == nodename) return element;
  }
  return false;
}
function _objectClone(original, copy) {
  if (Object.assign) copy = Object.assign({}, original);
  else copy = JSON.parse(JSON.stringify(original));
}

/*/////////////////////////////////////////////////////////////////////////// Cookies */

function getCookie(cname) {
  var c,
    ca = document.cookie.split(';');
  cname += '=';
  for (var i = 0; i < ca.length; i++) {
    c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(cname) == 0) return decodeURIComponent(c.substring(cname.length, c.length));
  }
  return '';
}
/*
function setCookie(name, cvalue, exdays, savepath){
  var d=new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires="; expires="+d.toUTCString();
  var path="";
  if(savepath) path="; path:/"+location.pathname.split('/')[1];
  document.cookie=name+"="+cvalue+path+expires;
}*/
function setCookie(name, value, expires, path, domain, secure) {
  var d = new Date();
  d.setTime(d.getTime() + expires * 24 * 60 * 60 * 1000);
  document.cookie =
    name +
    '=' +
    escape(value) +
    (expires ? '; expires=' + d.toUTCString() : '') +
    (path ? '; path=' + path : '') +
    (domain ? '; domain=' + domain : '') +
    (secure ? '; secure' : '');
}

/*/////////////////////////////////////////////////////////////////////////// SelectionText */

function getSelectionText() {
  var text = '';
  if (window.getSelection) text = window.getSelection().toString();
  else if (document.selection && document.selection.type != 'Control') text = document.selection.createRange().text;
  return text;
}
function setSelectionText(replaceText) {
  var selection, range;
  if (window.getSelection) {
    selection = window.getSelection();
    if (selection.rangeCount) {
      range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(replaceText));
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    range.text = replaceText;
  } else return false;
}

/*/////////////////////////////////////////////////////////////////////////// Page&Post functions */

function hidePost(postID) {
  if (!postID) return false;
  var h_block = getCookie('hidden'),
    state = -1;
  if (!h_block) h_block = [postID];
  else {
    h_block = JSON.parse(h_block);
    if (!Array.isArray(h_block)) return false;
    state = h_block.indexOf(postID);
    if (state > -1) h_block.splice(state, 1);
    else h_block.push(postID);
  }
  console.log('/' + location.pathname.split('/')[1]);
  setCookie('hidden', JSON.stringify(h_block), 359, '/' + location.pathname.split('/')[1]);
  _apply('#p' + postID, function (element) {
    if (state > -1) element.classList.remove('hidden');
    else element.classList.add('hidden');
  });
}
function quotePost(postID) {
  document.getElementById('open-form').checked = true;
  with (document.getElementById('message')) (value += '>>' + postID + '\n'), focus();
  return false;
}
function reloadPage() {
  window.location.reload();
}
function delPopup(popup) {
  popup.parentNode.removeChild(popup);
}
function popupOut(event) {
  if (event.target.className == 'postlink') {
    popup = event.target.parentNode.parentNode.lastChild;
  } else {
    popup = event.target;
  }
  popup.popupTimer = setTimeout(delPopup, 200, popup);
}
function reloadCAPTCHA() {
  var c = document.getElementById('captcha-form'),
    ci = document.getElementById('captcha');
  if (!c || !ci) return false;
  ci.src += '#new';
  with (c) (value = ''), focus();
  return false;
}
function getPostPassword(name) {
  var pass = getCookie(name);
  if (pass) return pass;
  else pass = '';

  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (var i = 0; i < 8; i++) {
    var rnd = (Math.random() * chars.length) | 0;
    pass += chars.substring(rnd, rnd + 1);
  }
  var expiration_date = new Date();
  expiration_date.setFullYear(expiration_date.getFullYear() + 7);
  setCookie(name, pass, expiration_date.toGMTString());
  return pass;
}

/*/////////////////////////////////////////////////////////////////////////// Draggable */

function draggable(event) {
  if (event.target.tagName == 'INPUT' || event.target.tagName == 'TEXTAREA') return true;
  event.preventDefault();
  switch (event.type) {
    case 'mousedown':
      console.log('on');
      drag_lX = event.clientX;
      drag_lY = event.clientY;
      document.addEventListener('mouseup', draggable);
      document.addEventListener('mousemove', draggable);
      return;
    case 'mousemove':
      console.log('m');
      (drag_curX = event.clientX), (drag_curY = event.clientY);
      if (drag_curX !== drag_lX || drag_curY !== drag_lY) {
        drag_element.style.left = parseInt(drag_element.style.left) + drag_curX - drag_lX + 'px';
        drag_element.style.top = parseInt(drag_element.style.top) + drag_curY - drag_lY + 'px';
        drag_lX = drag_curX;
        drag_lY = drag_curY;
      }
      return;
    case 'mouseup':
      console.log('out');
      document.removeEventListener('mousemove', draggable);
      document.removeEventListener('mouseup', draggable);
      drag_element = null;
      return;
    default:
      break;
  }
}

/*/////////////////////////////////////////////////////////////////////////// AJAX */

function createXMLHTTPObject() {
  // xmlhttp factory; activex for ie&edge browsers
  var XMLHttpFactories = [
    function () {
      return new XMLHttpRequest();
    },
    function () {
      return new ActiveXObject('Msxml2.XMLHTTP');
    },
    function () {
      return new ActiveXObject('Msxml3.XMLHTTP');
    },
    function () {
      return new ActiveXObject('Microsoft.XMLHTTP');
    },
  ];
  var xmlhttp = false;
  for (var i = 0; i < XMLHttpFactories.length; i++) {
    try {
      xmlhttp = XMLHttpFactories[i]();
    } catch (e) {
      continue;
    }
    break;
  }
  return xmlhttp;
}
function ajax(url, method, data, success, error, headers) {
  if (!data && method == 'POST') return false; // no data to post
  if (!(req = createXMLHTTPObject())) return false; // unsuccesful request
  if (typeof success != 'function')
    success = function (s) {
      console.log(s);
    };
  if (typeof error != 'function')
    error = function (e) {
      console.log(e);
    };
  req.open(method, url, true); // true for async
  if (!!headers) for (var i in headers) req.setRequestHeader(i, headers[i]); // custom headers to send
  req.send(data);
  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      if (req.status == 200 || req.status == 304) success(req.responseText);
      else error(req.status, req.statusText);
    }
  };
  return false;
}

/*/////////////////////////////////////////////////////////////////////////// Media generator functions */
function createObject(type, args) {
  /* object generator [swf|video|iframe] */
  if (type === undefined) return;
  var swf = function (args) {
    var src = args.src,
      attributes = args.swf.attr || {},
      parameters = args.swf.param || {};
    function IEobject(url) {
      var o = _create('div');
      o.innerHTML =
        "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='" +
        url +
        "'></object>";
      return o;
    }
    var isMSIE = /msie/i.test(navigator.userAgent),
      obj = isMSIE ? IEobject(src) : _create('object');
    if (!isMSIE) {
      obj.setAttribute('type', 'application/x-shockwave-flash');
      obj.setAttribute('data', src);
    }
    for (i in attributes) {
      obj.setAttribute(i, attributes[i]);
    }
    var param_flashvars = _create('param');
    for (i in parameters) {
      param_flashvars.setAttribute(i, parameters[i]);
    }
    obj.appendChild(param_flashvars);
    return obj;
  };
  var vid = function (args) {
    var video = _create('video'),
      type = 'video/' + getext(args.src);
    if (video.canPlayType(type).length > 0) {
      video.src = args.src;
      video.type = type;
      video.controls = true;
      video.autoplay = true;
    }
    video.onerror = function (event) {
      _remove(this);
      return false;
    };
    if (args.vid)
      for (i in args.vid) {
        video.setAttribute(i, args.vid[i]);
      }
    return video;
  };
  var aud = function (args) {
    var audio = _create('audio'),
      type = 'audio/' + getext(args.src);
    if (audio.canPlayType(type).length > 0) {
      audio.src = args.src;
      audio.type = type;
      audio.controls = true;
      audio.autoplay = true;
    }
    audio.onerror = function (event) {
      _remove(this);
      return false;
    };
    if (args.aud)
      for (i in args.aud) {
        video.setAttribute(i, args.aud[i]);
      }
    return audio;
  };
  var frm = function (args) {
    var iframe = _create('iframe');
    iframe.width = args.w || 640;
    iframe.height = args.h || 480;
    iframe.src = args.src;
    iframe.setAttribute('allowfullscreen', true);
    iframe.setAttribute('frameborder', 0);
    if (args.frm)
      for (i in args.frm) {
        video.setAttribute(i, args.frm[i]);
      }
    return iframe;
  };
  switch (type) {
    case 'flash':
      return swf(args);
      break;
    case 'video':
      return vid(args);
      break;
    case 'audio':
      return aud(args);
      break;
    case 'iframe':
      return frm(args);
      break;
    default:
      console.log('/!\\ Filetype undefined!');
      return false;
      break;
  }
  return false;
}

function getext(str) {
  return str.substr((~-str.lastIndexOf('.') >>> 0) + 2);
}
function mediatype(url) {
  if (url === undefined) return false;
  switch (/\.((webm(?:&|$)|mp4)|(ogg|mp3|aac|wav)|(swf)|(jpe?g|a?png|gif))(?:$|&)/gi.exec(url)[1]) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'apng':
    case 'gif':
      return 1;
    case 'ogg':
    case 'mp3':
    case 'aac':
    case 'wav':
      return 2;
    case 'webm':
    case 'mp4':
      return 3;
    case 'swf':
      return 4;
    default:
      return false;
  }
  return false;
}

/*/////////////////////////////////////////////////////////////////////////// Set controllers */

function setFiles() {
  function expandimg(element, link, image, ow, oh) {
    if (element === undefined || link === undefined || image === undefined) return false;

    var close = function () {
      image.src = image.dataset.thumbnail ? image.dataset.thumbnail : '';
      image.width = image.dataset.tw;
      image.height = image.dataset.th;
      image.dataset.state = 0;
      image.style.opacity = 1;
    };
    var open = function () {
      image.src = link.href;
      image.dataset.tw = image.width;
      image.dataset.th = image.height;
      image.width = ow;
      image.height = oh;
      image.dataset.state = 1;
      image.style.opacity = 1;
    };

    if (image.dataset.state === '1') {
      close();
      return false;
    }
    if (!image.dataset.thumbnail) image.dataset.thumbnail = image.src;

    var promise = new Promise(function (resolve, reject) {
      image.style.opacity = 0.7;
      var _image = document.createElement('img');
      _image.src = link.href;
      _image.addEventListener('load', resolve, false);
      _image.addEventListener('error', reject, false);
    });
    promise.then(open, close);
    promise.catch(function (e) {
      console.log(e);
    });

    return false;
  }

  function expandfile(element, link, thumb, type, ow, oh) {
    if (element === undefined || link === undefined || thumb === undefined) return false;
    var close = function () {
      _close = _create('a');
      _close.innerHTML = ' [x]';
      _close.href = '#';
      _close.title = 'Click to close this file';
      _close.classList.add('close');
      _close.onclick = function () {
        thumb.style.display = 'block';
        _remove(this.parentNode);
        return false;
      };
      return _close;
    };

    var open = function () {
      var player = _create('div'),
        obj = false;
      player.classList.add('player');
      player.classList.add(Options && Options.set.player ? 'floating' : 'static');
      switch (type) {
        case 2:
          obj = createObject('audio', {src: link.href});
          break;
        case 3:
          obj = createObject('video', {
            src: link.href,
            vid: {
              width: ow,
              height: oh,
            },
          });
          break;
        case 4:
          obj = createObject('flash', {
            src: link.href,
            swf: {
              attr: {
                id: 'flash' + element.dataset.postid,
                width: ow,
                height: oh,
              },
              param: {
                wmode: 'transparent',
              },
            },
          });
          break;
        default:
          break;
      }
      if (!obj) return false;

      player.appendChild(obj);
      player.style.margin = '25px 0';
      //player.appendChild(close());

      element.appendChild(player);

      link.style.display = 'none';
      element.dataset.state = 1;
    };
    var close = function () {
      console.log('closing');
      var player = element.querySelector('.player');
      if (player) element.removeChild(player);
      link.style.display = 'table-cell';
      element.dataset.state = 0;
    };

    if (element.dataset.state === '1') close();
    else open();

    return false;
  }

  _apply('.file', function (element) {
    element.onclick = function (event) {
      if (event.which !== 1) return true;
      if (
        event.target.parentNode.classList.contains('post-file-link') ||
        event.target.parentNode.classList.contains('player')
      )
        return true;
      event.preventDefault();
      var link = element.querySelector('a'),
        thumbnail = link.querySelector('img');
      if (!link || !thumbnail) return false;
      var aspect = (function () {
        var max_w = document.documentElement.clientWidth || document.body.clientWidth,
          offset = 15,
          offset_el = element,
          new_w = element.dataset.ow,
          new_h = element.dataset.oh;
        while (offset_el != null) {
          offset += offset_el.offsetLeft;
          offset_el = offset_el.offsetParent;
        }
        if (new_w > max_w) {
          var ratio = new_w / new_h;
          new_w = max_w - offset;
          new_h = new_w / ratio;
        }
        return {width: new_w, height: new_h};
      })();
      switch (mediatype(link.href)) {
        case 1:
          return expandimg(element, link, thumbnail, aspect.width, aspect.height);
        case 2:
          return expandfile(element, link, thumbnail, 2, aspect.width, aspect.height);
        case 3:
          return expandfile(element, link, thumbnail, 3, aspect.width, aspect.height);
        case 4:
          return expandfile(element, link, thumbnail, 4, aspect.width, aspect.height);
        default:
          break;
      }
      return false;
    };
  });
}
function setEmbed(id, embedhtml) {
  _apply('.embed', function (element) {
    element.onclick = function (event) {
      if (event.which !== 1) return true;
      event.preventDefault();
      element.querySelector('img').style.display = 'none';
      element.appendChild(createObject('iframe', {src: element.href, w: 480, h: 270}));
      var close = _create('i');
      close.classList.add('icon-close');
      close.classList.add('icon');
      close.onclick = function () {
        _remove(element.querySelector('iframe'));
        element.querySelector('img').style.display = 'block';
        _remove(this);
        return false;
      };
      var title = _id(element.id + 'fs');
      //title.insertBefore(close,title.firstChild); //слева
      title.appendChild(close); // справа
    };
  });
}
function setMarkup() {
  _apply('.post-mark a', function (element) {
    element.onclick = function (event) {
      if (!(this.dataset.wtag || this.dataset.bbtag)) return false;
      event.preventDefault();
      var area = document.forms.postform['message'];
      area.focus();
      var text = area.value.substring(area.selectionStart, area.selectionEnd);
      text = this.dataset.wtag
        ? this.dataset.wtag + text + this.dataset.wtag
        : '[' + this.dataset.bbtag + ']' + text + '[/' + this.dataset.bbtag + ']';
      var caret =
        area.selectionEnd +
        (this.dataset.wtag ? this.dataset.wtag.length * 2 : (this.dataset.bbtag.length + 2) * 2 + 1);
      area.value =
        area.value.substring(0, area.selectionStart) +
        text +
        area.value.substring(area.selectionEnd, area.value.length);
      area.setSelectionRange(caret, caret);
      return false;
    };
  });
}
function setHide() {
  _apply('.open-userhide', function (element) {
    element.onclick = function (event) {
      console.log('got click');
      event.preventDefault();
      event.stopPropagation();
      var id = /\d+$/.exec(element.value)[0];
      hidePost(id);
      element.parentNode.parentNode.parentNode.querySelector('input[type="checkbox"]').checked = false;
    };
  });
  var s_block = getCookie('hidden');
  if (s_block) {
    s_block = JSON.parse(s_block);
    if (!Array.isArray(s_block)) return false;
    s_block.forEach(function (post, index) {
      _apply('#p' + post, function (element) {
        if (element && !element.classList.contains('hidden')) element.classList.add('hidden');
      });
    });
  }
}

/*/////////////////////////////////////////////////////////////////////////// Options */

var _Options = function () {
  this.set = {
    mobile: /mobile/.test(navigator.userAgent),
    theme: 0 /* default theme */,
    smooth: 0 /* smooth effects */,
    player: 0 /* player inpost/floating */,
    images: 0 /* images inpost/floating */,
    taat: 0 /* thread auto-update */,
    control: 0 /* control cookie */,
  };
  var lcl = '0nyan-options';
  this.init = function () {
    var t = localStorage.getItem(lcl);
    if (t) {
      t = JSON.parse(t);
      for (var o in t) if (this.set.hasOwnProperty(o)) this.set[o] = t[o];
    } else localStorage.setItem(lcl, JSON.stringify(this.set));
  };
  this.save = function () {
    localStorage.setItem(lcl, JSON.stringify(this.set));
  };
  this.apply = function (key, val) {
    if (this.set.hasOwnProperty(key)) this.set[key] = val;
  };
  this.dump = function () {
    console.log(this.set);
  };
};

document.addEventListener(
  'mouseover',
  function (event) {
    if (event.target.className == 'postlink') {
      if (
        typeof event.target.parentNode.parentNode.lastChild.className !== 'undefined' &&
        event.target.parentNode.parentNode.lastChild.className.search('popupPost') > -1
      ) {
        delPopup(event.target.parentNode.parentNode.lastChild);
      }
      tpost = document.getElementById(event.target.innerHTML.replace('&gt;&gt;', 'p'));
      if (!tpost) {
        return; // here must be absent post fetching instead
      }
      popup = tpost.cloneNode(true);
      if (typeof popup.lastChild.className !== 'undefined' && popup.lastChild.className.search('popupPost') > -1) {
        popup.removeChild(popup.lastChild);
      }
      popup.postlink = event.target;
      popup.className += ' popupPost';
      event.target.parentNode.parentNode.appendChild(popup);
      event.target.addEventListener('mouseleave', popupOut, false);
      popup.addEventListener('mouseleave', popupOut, false);
    } else if (typeof event.target.popupTimer !== 'undefined') {
      clearTimeout(event.target.popupTimer);
      delete event.target.popupTimer;
    }
  },
  false,
);

var Options = false;
document.addEventListener(
  'DOMContentLoaded',
  function () {
    Options = new _Options();
    Options.init();

    var npp = document.getElementById('newpostpassword');
    if (npp)
      npp.onchange = function () {
        var expiration_date = new Date();
        expiration_date.setFullYear(expiration_date.getFullYear() + 7);
        setCookie('tinyib_password', encodeURIComponent(newpostpassword.value), expiration_date.toGMTString());
      };
    var pass = getPostPassword('tinyib_password'),
      delpass = document.getElementById('deletepostpassword');
    if (pass) {
      if (npp) npp.value = pass;
      if (delpass) delpass.value = pass;
      if (window.location.hash.match(/^#q[0-9]+$/i) !== null) {
        var quotePostID = window.location.hash.match(/^#q[0-9]+$/i)[0].substr(2);
        if (quotePostID != '') {
          window.location.hash = '#' + quotePostID;
          quotePost(quotePostID);
        }
      }
    }
    if (window.location.hash) {
      if (window.location.hash.match(/^#q[0-9]+$/i) !== null) {
        var quotePostID = window.location.hash.match(/^#q[0-9]+$/i)[0].substr(2);
        if (quotePostID != '') {
          window.location.hash = '#' + quotePostID;
          quotePost(quotePostID);
        }
      }
    }
    setHide();
    setMarkup();
    setEmbed();
    setFiles();
  },
  false,
);
