

  document.addEventListener('DOMContentLoaded', function(){
    if (window?.rybbit) {
      window.rybbit.identify('hri_17767874859554');
    }
  })

  VR = function(){
    var _this = this;
    $().ready(function(){
      var i, rl, url = VR.location_dir();

      _this.Agent = (_this.getBrowser() || '').toLowerCase();
      window.vri = VR.uMicrotime();
      _this.IDGenerator_prefix = window.vri + "_";


      //-- Запись HTTP ACCESS
      Query({ action: "http_access", in_background: true, url_from: document.referrer, url_to: window.location.href });

      rl = _this.readylist();
      if(rl && rl.length){
        for(i = 0; i < rl.length; i++){
          rl[i].call(_this);
        }
      }

      VR.getChanges();

      try {
        VR.routePage();
      }
      catch(e){
        console.log("Invalid handler for page /"+(url === '' ? '' : url+'/'), VR.parseError(e), e);
      }

      $(document).idle({
        onIdle: function(){
          if('VR' in window && !VR.aGet('idlenotused')){
            VR.aSet("getChangesStop", true);
          }
        },
        onActive: function(){
          VR.aSet("getChangesStop", false);
        },
        idle: 10000
      });
    });
  };
  VR.prototype = {
    Agent: null,
    IDGenerator_number: 0,
    IDGenerator_prefix: null
  };
  VR = new VR();

//******************************************************************************


//-- Получить значение из LocalStorage
function LSGet(name) {
  let r = null;
  try {
    r = window.localStorage.getItem(name);
  }
  catch (e) {
    console.error(e);
  }
  return r;
}

//-- Установить значение в LocalStorage
function LSSet(name, value) {
  try {
    window.localStorage.setItem(name, value);
  }
  catch (e) {
    console.error(e);
  }
}

//-- Удалить значение из LocalStorage
function LSDel(name){
  try {
    window.localStorage.removeItem(name);
  }
  catch (e) {
    console.error(e);
  }
}

//-- Функция позволяет перезаписывать html теги
(function($){
  $.fn.replaceTagName = function(a){
    let t = [];
    for(let i = this.length - 1; 0 <= i ; i--) {
      let n = document.createElement(a);
      n.innerHTML = this[i].innerHTML;
      $.each(this[i].attributes, function(j, v) {
        $(n).attr(v.name, v.value);
      });
      $(this[i]).after(n).remove();
      t[i] = n;
    }
    return $(t);
  };
})(jQuery);


VR.testun = (o) => console.log(o.value);
VR.eval = (o) => o ? JSON.parse(o) : null;
VR.is_array = (arr) => Object.prototype.toString.call(arr) === '[object Array]';
VR.location_reload = d => {
  if (!('contains' in d) || window.location.href.indexOf(d.contains) > -1)
    window.location.reload();
}

VR.go = function (url, target) {
  switch(target || "_self"){
    case "_self": return window.location.href = VR.trim(VR.toString(url), '"');
  }
  return false;
};


VR.in_array = function (needle, haystack, strict) {
let found = false, key
    strict = !!strict
    if (this.is_array(haystack)) {
      for (key in haystack) {
        if ((strict && haystack[key] === needle) || (!strict && haystack[key] === needle)) {
          found = true;
          break;
        }
      }
    }
    return found;
};


VR.array_search = function (needle, haystack) {
  for(let fkey in haystack){
    if (haystack.hasOwnProperty(fkey)){
      if ((haystack[fkey] + '') === (needle + '')){
        return fkey;
      }
    }
  }
  return false;
};


VR.array_unique = function (inputArr, isAssoc) {
let key, val, a1 = [], a2 = {};
    isAssoc = isAssoc === undefined ? false : (typeof(isAssoc) === "boolean" ? isAssoc : false);
    if(this.is_array(inputArr)){
      for(key = 0; key<inputArr.length; key++){
        val = inputArr[key];
        if (false === this.array_search(val, a2)){
          a2[key] = val;
          a1.push(val);
        }
      }
    }
    else{
      for (key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
          val = inputArr[key];
          if (false === this.array_search(val, a2)){
            a2[key] = val;
            a1.push(val);
          }
        }
      }
    }
    return isAssoc ? a2 : a1;
};


VR.array_merge = function(){
let args = Array.prototype.slice.call(arguments),
    argl = args.length,
    arg, retObj = {},
    k = '',
    argil = 0,
    j = 0,
    i = 0, ct = 0,
    toStr = Object.prototype.toString,
    retArr = true;

    for (i = 0; i < argl; i++) {
      if ( !this.is_array(toStr.call(args[i])) ) {
        retArr = false;
        break;
      }
    }
    if (retArr) {
      retArr = [];
      for (i = 0; i < argl; i++) retArr = retArr.concat(args[i]);
        return retArr;
    }

    for (i = 0, ct = 0; i < argl; i++) {
      arg = args[i];
      if ( this.is_array( toStr.call(arg) ) ) {
        for (j = 0, argil = arg.length; j < argil; j++) retObj[ct++] = arg[j];
      }
      else {
        for (k in arg) {
          if (arg.hasOwnProperty(k)) {
            if (parseInt(k, 10) + '' === k)
              retObj[ct++] = arg[k];
            else
              retObj[k] = arg[k];
          }
        }
      }
    }
    return retObj;
};


VR.utf8_decode = function (str_data) {
let tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
    str_data += '';
    while (i < str_data.length) {
      c1 = str_data.charCodeAt(i);
      if (c1 < 128) {
        tmp_arr[ac++] = String.fromCharCode(c1);
        i++;
      } else if (c1 > 191 && c1 < 224) {
        c2 = str_data.charCodeAt(i + 1);
        tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = str_data.charCodeAt(i + 1);
        c3 = str_data.charCodeAt(i + 2);
        tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
  return tmp_arr.join('');
};



VR.utf8_encode = function (argString) {
  if (argString === null || typeof argString === "undefined")
    return "";
  let string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  let utftext = '', start, end, stringl = 0, c1, enc;

  start = end = 0;
  stringl = string.length;
  for (let n = 0; n < stringl; n++) {
    c1 = string.charCodeAt(n);
    enc = null;
    if (c1 < 128) {
      end++;
    }
    else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
    }
    else
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
    //--
    if (enc !== null) {
      if (end > start)
        utftext += string.slice(start, end);
      utftext += enc;
      start = end = n + 1;
    }
  }
  if (end > start)
    utftext += string.slice(start, stringl);
  return utftext;
};


VR.base64_encode = function (data) {
  if (!data)
    return data;
  //--
  let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
          ac = 0,
          enc = "",
          tmp_arr = [];

  data = this.utf8_encode(data + '');

  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');
  let r = data.length % 3;
  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
};

VR.base64_decode = function (data) {
  if (!data)
    return data;
  //--
  let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
          ac = 0,
          dec = "",
          tmp_arr = [];

  data += '';
  do {
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;

    if (h3 === 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 === 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);

  dec = tmp_arr.join('');
  dec = this.utf8_decode(dec);
  return dec;
};


VR.toString = function (o){
let type = o === null ? "null" : typeof(o);
    switch (type){
      case "string":return '"'+o.split('"').join('\\"')+'"';
      case "number":return o;
      case "boolean":return o ? "true" : "false";
      case "object":return this.is_array(o) ? this.a2s(o) : this.o2s(o);
    }
  return null;
};


VR.remove_extra_zero = function(v){
let p, r;
    switch(typeof v){
      case 'string': break;
      case 'number': v += '';
      default: v = '';
    }

    v = v.split(',').join('.');
    if(v.replace(/[0]+/, '') === ''){
      return '0';
    }

    p = v.split('.');
    r = /([0]+)/.exec(p[0]);
    if(r && r[0].length > 0){
      r = (p[0]).replace(/^[0]+/g, '');
      if(r.length){
        p[0] = r.length ? r : '0';
      }
    }
    return p.join('.');
};


VR.toFixed = function(v, length, round){
let minus, parts, p1, p2, m;
    round = round === true;
    v = (v + '').split(',').join('.');
    m = /([0-9]+)E\-([0-9]+)$/i.exec(v);
    if(m && m.length){
      v = "0." + this.str_repeat("0", (parseInt(m[2]) - 1)) + m[1];
    }
    if(isNaN(parseFloat(v))){
      return null;
    }
  //--
    minus = parseFloat(v) < 0 ? true : false;
    parts = v.split(".");
    p1 = parts[0].replace(/[^0-9]/g,'');
    p2 = parts[1] ? parts[1].replace(/[^0-9]/g,'') : '';
  //--
    length = parseInt(length);
    if (isNaN(length) || length < 0){
      length = 2;
    }
    if (length === 0 || !p2) {
      return (minus ? -1 : 1) * parseFloat(p1);
    }
  //--
    p2 = (p2.length > length ? p2.substr(0, length) : p2);
    return (minus ? "-" : "") + (round && p2 === VR.str_repeat('9', length) ? parseInt(p1) + 1 : p1 + "." + p2);
};


VR.str_repeat = function( input, multiplier ) {
let buf = '';
    for (let i=0; i < multiplier; i++){
      buf += input;
    }
    return buf;
};


VR.ltrim = function (str, sign){
  return this.trim(str, sign, "L");
};


VR.rtrim = function (str, sign){
  return this.trim(str, sign, "R");
};


VR.trim = function (str, sign, side){
    let s1, s2;
        sign = sign && typeof(sign) === "string" ? sign : null;
        side = side && typeof side === "string" ? side : null;
      //--
        if(typeof str !== "string") return str;
        if(sign){
          sign = sign.replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
          s1 = new RegExp("^"+sign);
          s2 = new RegExp(sign+"$");
        }
        else{
          s1 = /^\s+/;
          s2 = /\s+$/;
        }
        return side ? ( side.toUpperCase() === "L" ? str.replace(s1, '') : (side.toUpperCase() === "R" ? str.replace(s2, '') : str.replace(s1, '').replace(s2,'') )) : str.replace(s1, '').replace(s2,'');
    };

VR.ucfirst = function(str) {
  str += '';
  const f = str.charAt(0) . toUpperCase();
  return f + str.substr(1);
}


VR.a2s = function(o){
let a = [];
    for(let i=0; i<o.length; i++) a.push(this.toString(o[i]));
    return "["+a.join(",")+"]";
};


VR.o2s = function(o){
    if(!o) return "{}";
let a = [];
    for(let key in o) a.push('"'+key+'":'+this.toString(o[key]));
    return "{"+a.join(",")+"}";
};


VR.toBool = function (o){
  return this.toBoolean(o);
};


VR.toBoolean = function (o){
  o = typeof(o) === "string" ? o.split(" ").join("") : o;
  return typeof(o) === "boolean" ? o : ( typeof(o) === "string" ? (o === "true" ? true : (o === "false" ? false : null)) : null );
};


VR.msec2date = function(msec) {
let d = {sec: 1000, min: 60000, hour: 3600000, day: 86400000, month: 2592000000, year: 31104000000};
    msec = parseInt(msec);
    msec = isNaN(msec) ? 0 : msec;

let years = msec > d.year ? msec / d.year : 0;
    years = ( years + '' ).split('.')[0];
    msec = years === 0 ? msec : msec - years * d.year;

let months = msec > d.month ? msec / d.month : 0;
    months = ( months + '' ).split('.')[0];
    msec = months === 0 ? msec : msec - months * d.month;

let days = msec > d.day ? msec / d.day : 0;
    days = ( days + '' ).split('.')[0];
    msec = days === 0 ? msec : msec - days * d.day;

let hours = msec > d.hour ? msec / d.hour : 0;
    hours = ( hours + '' ).split('.')[0];
    msec = hours === 0 ? msec : msec - hours * d.hour;

let minutes = msec > d.min ? msec / d.min : 0;
    minutes = ( minutes + '' ).split('.')[0];
    msec = minutes === 0 ? msec : msec - minutes * d.min;

let seconds = msec > d.sec ? msec / d.sec : 0;
    seconds = ( seconds + '' ).split('.')[0];
    msec = seconds === 0 ? msec : msec - seconds * d.sec;
    d = (years === 0 ? "" : years + " year ") + (months === 0 ? "" :  months + " month ") + (days === 0 ? "" :  days + " day ") + (hours === 0 ? "" :  hours + " hour ") + (minutes === 0 ? "" :  minutes + " min. ") + (seconds === 0 ? "" :  seconds + " sec. ") + (msec === 0 ? "" :  msec + " msec.");
    d = d.length ? d.replace(/^\s+/, '').replace(/\s+$/, '') : '';
    return d;
};


VR.parseError = function(e){
let err = '', p, a = ['',''];
    if(typeof e === 'string'){
      p = ( /^(.+\[\d+\]\s*\:\s*)/.exec(e) || a )[1];
      err = p ? e.replace(p,'') : e;
    }
    else err = "Type: " + ('name' in e ? e.name : 'undefined') + "\nMessage: " + ('message' in e ? e.message : 'undefined');
    return err;
};

VR.ajaxLoader = function(is_show) {}

VR.uniqueID = function (){
  this.IDGenerator_number++;
  return this.IDGenerator_prefix + this.IDGenerator_number;
};

VR.uMicrotime = function(old_microtime){
let new_microtime = (new Date().getTime()) * 10;
    if(!old_microtime){
      return new_microtime;
    }
    if(old_microtime === new_microtime){
      return this.uMicrotime(old_microtime);
    }
    return new_microtime;
};


VR.setSelection = function(target) {
let rng, sel;
    if (document.createRange) {
      rng = document.createRange();
      rng.selectNode(target);
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(rng);
    }
    else {
      rng = document.body.createTextRange();
      rng.moveToElementText(target);
      rng.select();
    }

    return VR;
};


VR.clearSelection = function() {
  try {
    // современный объект Selection
    window.getSelection().removeAllRanges();
  }
  catch (e) {
    // для IE8-
    document.selection.empty();
  }

  return VR;
};


VR.copyToClipboard = function(text, onsuccess) {
let fn = function(){
      if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);
      }
      else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      let textarea = document.createElement("textarea");
          textarea.textContent = text;
          textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
          document.body.appendChild(textarea);

          /* в новых версиях ios не обязательно
          if(navigator.userAgent.match(/ipad|iphone/i)){
            let range = document.createRange();
            range.selectNode(textarea);
            let selection = window.getSelection();
            selection.addRange(range);
            selection.removeAllRanges();
            textarea.setSelectionRange(0, 999999);
          }else{*/
            textarea.select();
          //}

          try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
          }
          catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
          }
          finally {
            document.body.removeChild(textarea);
          }
      }
    };

    if(!fn(text)){
      alert('Copying to clipboard unsupported. Please update yours browser!');
      return VR;
    }

    if(onsuccess && typeof onsuccess === 'function'){
      onsuccess(text);
      return VR;
    }

    if('toastr' in window){
      toastr["success"]('Data has been successfully copied to clipboard', " ", {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: true,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
      });
    }
    else {
      alert('Data has been successfully copied to clipboard');
    }

    return VR;
};

VR.copyStruct = function(message, onsuccess)
{
  window.getSelection().removeAllRanges();
  let cpsel = document.getElementById('copyStruct');
  if(!cpsel)
  {
    cpsel = document.createElement("div");
    cpsel.id = 'copyStruct';
    cpsel.style.opacity = 0
    cpsel.style.position = 'fixed'
    cpsel.style.display = 'none'
    document.body.appendChild(cpsel);
  }
  cpsel.innerHTML = message;
  cpsel.style.display = 'block';
  let range = document.createRange();
  range.selectNode(cpsel);
  window.getSelection().addRange(range);
  try {
    document.execCommand('copy');
    if(onsuccess && typeof onsuccess === 'function'){
      onsuccess();
    }
  } catch(err) {}
  window.getSelection().removeAllRanges();
  cpsel.style.display = 'none';
}


VR.getBrowser = function() {
  let UA = window.navigator.userAgent,
    YandexB = /YaBrowser\/\w+\.\w+/i,
    OperaB = /Opera|OPR[ \/]+\w+\.\w+/i,
    FirefoxB = /Firefox\/\w+\.\w+/i,
    ChromeB = /Chrome\/\w+\.\w+/i,
    SafariB = /Version\/\w+\.\w+/i,
    IEB = /MSIE *\d+\.\w+/i,
    Firefox = UA.match(FirefoxB),
    Chrome = UA.match(ChromeB),
    Safari = UA.match(SafariB),
    IE = UA.match(IEB),
    Opera = UA.match(OperaB),
    Yandex = UA.match(YandexB);
  if (Opera){
    return "opera";
  }
  else if (IE) {
    return 'msie';
  }
  else if (Firefox) {
    return 'firefox';
  }
  else if (Yandex) {
    return 'yandex';
  }
  else if (Safari) {
    return 'safari';
  }
  else if (Chrome) {
    return 'chrome';
  }
  return UA;
};


VR.isAgent = function(name){
  return name.toLowerCase().split(" ").join().replace(/^is/,'') === this.Agent;
};


VR.getViewportWidth = function ()  {return ((document.compatMode || this.isAgent("IE")) && !this.isAgent("Opera")) ? (document.compatMode == 'CSS1Compat') ? document.documentElement.clientWidth:document.body.clientWidth:(document.parentWindow || document.defaultView).innerWidth;};
VR.getViewportHeight = function () {return ((document.compatMode || this.isAgent("IE")) && !this.isAgent("Opera")) ? (document.compatMode == 'CSS1Compat') ? document.documentElement.clientHeight:document.body.clientHeight:(document.parentWindow || document.defaultView).innerHeight;};
VR.getDocumentWidth = function ()  {return Math.max(document.compatMode != 'CSS1Compat' ? document.body.scrollWidth:document.documentElement.scrollWidth, this.getViewportWidth());},
VR.getDocumentHeight = function () {return Math.max(document.compatMode != 'CSS1Compat' ? document.body.scrollHeight:document.documentElement.scrollHeight, this.getViewportHeight());},
VR.getBodyScrollTop = function ()  {return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);},
VR.getBodyScrollLeft = function () {return self.pageXOffset || (document.documentElement && document.documentElement.scrollLeft) || (document.body && document.body.scrollLeft);},


VR.boxsize= function(_element){
let elem = typeof(_element)==="string" ? document.getElementById(_element) : _element;
    if(!elem) return {"left":null, "top":null, "width": null, "height":null};
let w = elem.offsetWidth, h = elem.offsetHeight, l = 0, t = 0;
//-- в цикле проходим по всем родительским элементам.
    while (elem) {
      l += elem.offsetLeft;
      t += elem.offsetTop;
      elem = elem.offsetParent;
    }
    return {"left":l, "top":t, "width": w, "height":h};
};


VR.ctx = function(el, search)
{
  let r = $(el).closest(search);
  return r.length ? r : null;
};

VR.ctx_e = function(e, search)
{
  return VR.ctx(e.target, search);
};

VR.json_fix_format = function (json_str, newLine){
let retval = '';
let pos = 0;
let strLen = json_str.length;
let indentStr = '&nbsp;&nbsp;&nbsp;&nbsp;';
let ch = '';
    newLine = newLine || '\n';
    for (let i=0; i<strLen; i++) {
      ch = json_str.substring(i,i+1);
      if (ch === '}' || ch === ']') {
        retval = retval + newLine;
        pos = pos - 1;
        for (let j=0; j<pos; j++){
          retval = retval + indentStr;
        }
      }
      retval = retval + ch;
      if (ch === '{' || ch === '[' || ch === ',') {
        retval = retval + newLine;
        if (ch === '{' || ch === '['){
          pos = pos + 1;
        }
        for (let k=0; k<pos; k++){
          retval = retval + indentStr;
        }
      }
    }
    return retval;
};


VR.run_if_exists = function(condition, callback, frequency){
let fn = function(){
      if(condition() === true){
        return callback();
      }
      window.setTimeout(fn, frequency);
    };

    frequency = parseInt(frequency);
    if(isNaN(frequency) && frequency < 40){
      frequency = 40;
    }

    if(typeof condition !== 'function' || typeof callback !== 'function'){
      return false;
    }

    fn();
};


VR.json_fix_cyr = function (json_str){
let cyr_chars = {
    '\\u00d0\\u00b0':'а','\\u00d0\\u0090':'А','\\u00d0\\u00b1':'б','\\u00d0\\u0091':'Б','\\u00d0\\u00b2':'в','\\u00d0\\u0092':'В','\\u00d0\\u00b3':'г','\\u00d0\\u0093':'Г',
    '\\u00d0\\u00b4':'д','\\u00d0\\u0094':'Д','\\u00d0\\u00b5':'е','\\u00d0\\u0095':'Е','\\u00d1\\u0091':'ё','\\u00d0\\u0081':'Ё','\\u00d0\\u00b6':'ж','\\u00d0\\u0096':'Ж',
    '\\u00d0\\u00b7':'з','\\u00d0\\u0097':'З','\\u00d0\\u00b8':'и','\\u00d0\\u0098':'И','\\u00d0\\u00b9':'й','\\u00d0\\u0099':'Й','\\u00d0\\u00ba':'к','\\u00d0\\u009a':'К',
    '\\u00d0\\u00bb':'л','\\u00d0\\u009b':'Л','\\u00d0\\u00bc':'м','\\u00d0\\u009c':'М','\\u00d0\\u00bd':'н','\\u00d0\\u009d':'Н','\\u00d0\\u00be':'о','\\u00d0\\u009e':'О',
    '\\u00d0\\u00bf':'п','\\u00d0\\u009f':'П','\\u00d1\\u0080':'р','\\u00d0\\u00a0':'Р','\\u00d1\\u0081':'с','\\u00d0\\u00a1':'С','\\u00d1\\u0082':'т','\\u00d0\\u00a2':'Т',
    '\\u00d1\\u0083':'у','\\u00d0\\u00a3':'У','\\u00d1\\u0084':'ф','\\u00d0\\u00a4':'Ф','\\u00d1\\u0085':'х','\\u00d0\\u00a5':'Х','\\u00d1\\u0086':'ц','\\u00d0\\u00a6':'Ц',
    '\\u00d1\\u0087':'ч','\\u00d0\\u00a7':'Ч','\\u00d1\\u0088':'ш','\\u00d0\\u00a8':'Ш','\\u00d1\\u0089':'щ','\\u00d0\\u00a9':'Щ','\\u00d1\\u008a':'ъ','\\u00d0\\u00aa':'Ъ',
    '\\u00d1\\u008b':'ы','\\u00d0\\u00ab':'Ы','\\u00d1\\u008c':'ь','\\u00d0\\u00ac':'Ь','\\u00d1\\u008d':'э','\\u00d0\\u00ad':'Э','\\u00d1\\u008e':'ю','\\u00d0\\u00ae':'Ю',
    '\\u00d1\\u008f':'я','\\u00d0\\u00af':'Я','\\u00c2\\u00ab':'«','\\u00c2\\u00bb':'»','\\u00c2\\u00a0':' ','\\u00c2\\u201c':'“','\\u00c2\\u201d':'”','\\u00c2\\u00bd':'½',
    '\\u00e2\\u0080\\u0094':'—','\\u00e2\\u0080\\u0093':'–','\\u00e2\\u0080\\u009c':'“','\\u00e2\\u0080\\u009d':'”',
    '\\u0430':'а','\\u0410':'А','\\u0431':'б','\\u0411':'Б','\\u0432':'в','\\u0412':'В','\\u0433':'г','\\u0413':'Г','\\u0434':'д','\\u0414':'Д','\\u0435':'е','\\u0415':'Е',
    '\\u0451':'ё','\\u0401':'Ё','\\u0436':'ж','\\u0416':'Ж','\\u0437':'з','\\u0417':'З','\\u0438':'и','\\u0418':'И','\\u0439':'й','\\u0419':'Й','\\u043a':'к','\\u041a':'К',
    '\\u043b':'л','\\u041b':'Л','\\u043c':'м','\\u041c':'М','\\u043d':'н','\\u041d':'Н','\\u043e':'о','\\u041e':'О','\\u043f':'п','\\u041f':'П','\\u0440':'р','\\u0420':'Р',
    '\\u0441':'с','\\u0421':'С','\\u0442':'т','\\u0422':'Т','\\u0443':'у','\\u0423':'У','\\u0444':'ф','\\u0424':'Ф','\\u0445':'х','\\u0425':'Х','\\u0446':'ц','\\u0426':'Ц',
    '\\u0447':'ч','\\u0427':'Ч','\\u0448':'ш','\\u0428':'Ш','\\u0449':'щ','\\u0429':'Щ','\\u044a':'ъ','\\u042a':'Ъ','\\u044b':'ы','\\u042b':'Ы','\\u044c':'ь','\\u042c':'Ь',
    '\\u044d':'э','\\u042d':'Э','\\u044e':'ю','\\u042e':'Ю','\\u044f':'я','\\u042f':'Я','\\u00ab':'«','\\u00bb':'»','\\u2014':'—','\\u2013':'–',
    '\\u00a0':' ','\\u201c':'“','\\u201d':'”','\\u00bd':'½','\\u00c2½':'½','\\r':'','\\n':'\\\\n','\\t':''
  };
  json_str = json_str.toLowerCase();

  for(let key in cyr_chars){
    json_str = json_str.split("\\"+key).join(cyr_chars[key]);
  }

  return json_str;
};


VR.translit = function(from, space){
    space = space || '_';
let a =  {'А':'A',  'Б':'B',  'В':'V',  'Г':'G',    'Д':'D',  'Е':'E',  'Ё':'Jo', 'Ж':'Zh', 'З':'Z',  'И':'I',  'Й':'J',  'К':'K',  'Л':'L',    'М':'M',
          'Н':'N',  'О':'O',  'П':'P',  'Р':'R',    'С':'S',  'Т':'T',  'У':'U',  'Ф':'F',  'Х':'H',  'Ч':'Ch', 'Ц':'C',  'Ш':'Sh', 'Щ':'Xsh',  'Э':'E',
          'Ю':'Ju', 'Я':'Ja', 'Ы':'Y',  'Ъ':'',     'Ь':'',   'а':'a',  'б':'b',  'в':'v',  'г':'g',  'д':'d',  'е':'e',  'ё':'jo', 'ж':'zh',   'з':'z',
          'и':'i',  'й':'j',  'к':'k',  'л':'l',    'м':'m',  'н':'n',  'о':'o',  'п':'p',  'р':'r',  'с':'s',  'т':'t',  'у':'u',  'ф':'f',    'х':'h',
          'ч':'ch', 'ц':'c',  'ш':'sh', 'щ':'csh',  'э':'e',  'ю':'ju', 'я':'ja', 'ы':'y',  'ъ':'',   'ь':'',   ' ':space,'-':'-',  '_': '_',
          'A':'A', 	'B':'B', 	'C':'C', 	'D':'D',    'E':'E', 	'F':'F', 	'G':'G', 	'H':'H', 	'I':'I', 	'J':'J', 	'K':'K', 	'L':'L', 	'M':'M',    'N':'N',
          'O':'O', 	'P':'P', 	'Q':'Q', 	'R':'R',    'S':'S', 	'T':'T', 	'U':'U', 	'V':'V', 	'W':'W', 	'X':'X', 	'Y':'Y', 	'Z':'Z',        'a':'a',    'b':'b',
          'c':'c', 	'd':'d', 	'e':'e', 	'f':'f',    'g':'g', 	'h':'h', 	'i':'i', 	'j':'j', 	'k':'k', 	'l':'l', 	'm':'m', 	'n':'n', 	'o':'o',    'p':'p',
          'q':'q', 	'r':'r', 	's':'s', 	't':'t',    'u':'u', 	'v':'v', 	'w':'w', 	'x':'x', 	'y':'y', 	'z':'z'
          };
let to = "", character;
    for(let i=0; i < from.length; i++) {
      character = from.charAt(i,1);
      to += character in a ? a[character] : '';
    }
    return to.replace(/\-+/,'-');
};


VR.ci = function(name,value){
  return '<input type="hidden" class="f-input" name="'+name+'" value="'+value+'"/>';
};


VR.readObjectFromString = function(str){
let o = /(\{.+\})/.exec(str);
    return o && o.length ? this.eval( "("+ o[1] +")") : null;
};

/**
 *
 * @param {type} str
 * @param {type} ps pairs separator
 * @param {type} kvs key and values separator
 * @returns {String}
 */
VR.parseHashCMD = function(str, ps, kvs){
let oStr, o = {}, i;

    ps = ps ? ps : "||";
    kvs = kvs ? kvs : "|";
    oStr = str.split(ps);

    for(i=0;i<oStr.length;i++){
      oStr[i] = oStr[i].split(kvs);
      o[oStr[i][0]] = oStr[i][1] ? oStr[i][1] : "";
    }
    return o;
};

VR.readForm = function(ctx){
  let o = {}

  $(ctx).find(".f-input").each(function(){

    if($(this).attr("type") === 'radio'){
      if(this.checked){
        o[this.name] = this.value
      }
      return
    }

    if(this.name in o){
      if(typeof o[this.name] !== 'object' || !o[this.name].length){
        o[this.name] = [ o[this.name] ]
      }
    }

    switch( (this.tagName).toLowerCase() ){
      case 'select':
        if(this.name in o){
          o[this.name].push( $(this).find("option:selected").attr("value") )
        }
        else {
          o[this.name] = $(this).find("option:selected").attr("value")
        }
        break

      case 'input':

        if ($(this).hasClass('only-checked') && !this.checked)
          return;

        if(this.name in o){
          o[this.name].push( $(this).attr("type") === 'checkbox' ? (this.checked ? 'on' : 'off') : this.value )
        }
        else {
          o[this.name] = $(this).attr("type") === 'checkbox' ? (this.checked ? 'on' : 'off') : this.value
        }
        break

      default:
        if(this.name in o){
          o[this.name].push( this.value )
        }
        else {
          o[this.name] = this.value
        }
        break
    }
  })

  return o
};

VR.uploadFile = function(formData, hands) {
  try {
    var request = new XMLHttpRequest();

    if ('progress' in hands)
      request.upload.addEventListener('progress', function (e) {
        let p = e.loaded / (e.total / 100);
        if (e.loaded == e.total) p = 100;
        hands.progress(p == undefined ? 100 : Math.round(p*100)/100);
      });

    request.open('POST', '/en/?action=uploadFile');
    request.onload = () => {
      if ('callback' in hands) {
        let res;
        if (request.status !== 200)
          res = {status: 'error', msg: 'http code ' + request.status};
        else
          res = JSON.parse(request.response);
        hands.callback(res);
      }
    };
    request.send(formData);

  } catch (error) {

  }
}

VR.uploadFiles = function ({files, onProgress = () => {}, onSuccessFile = () => {}, onError = () => {}}) {
  if (!files || !files.length) {
    //throw new Error('No files provided');
    return;
  }

  const formData = new FormData();
  formData.append('version', 2);
  // добавляем файлы
  Array.from(files).forEach((file, index) => {
    formData.append('attachments[]', file);
  });

  const xhr = new XMLHttpRequest();

  xhr.open('POST', '/en/?action=uploadFile', true);

  // общий прогресс загрузки
  xhr.upload.onprogress = function (e) {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      onProgress(percent, e.loaded, e.total);
    }
  };

  // готовность запроса
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        let response = xhr.responseText;
        try {
          response = JSON.parse(response);
        } catch (e) {}

        if (response.status === 'success') {
          response.files.forEach(file => {
            if (file.type.startsWith('image/'))
              file._preview = '/file/' + file.id;
            else if (file.type.startsWith('application/pdf')) {
              file._preview = '/res/exchangebox/i/file/pdf.svg';
            } else {
              file._preview = '/res/exchangebox/i/file/attach.svg';
            }
            onSuccessFile(file);
          })
        }else{
          onError(response.msg)
        }

      } else {
        onError('http_code: ' + xhr.status);
      }
    }
  };

  xhr.onerror = function () {
    onError('onerror');
  };

  xhr.send(formData);
}

VR.selectPs = clb => {
    try{
        if (typeof SelectPS !== 'function') {

            var script = document.createElement('script');
            script.src = `/res/default/js/SelectPS.js?v=13`;
            script.onload = clb
            document.getElementsByTagName('head')[0].appendChild(script);

            var style = document.createElement('link');
            style.rel='stylesheet'
            style.type='text/css';
            style.href = `/res/default/css/SelectPS.css?v=13`;
            document.getElementsByTagName('head')[0].appendChild(style);
        }else{
            clb();
        }
    }catch (e){

    }
}

VR.input_validator_phone_ru = function (root) {
  let pspsinput = $(root).find('input[data-validator-fn="validator_phone_ru"],input[data-validator-fn="validator_phone_ru_optional"]');
  if(pspsinput.length){
    let fn = function () {
      let val = $(this).val();
      if (val == '9') val = '+79';
      let phoneNumber = val.replace(/\D/g, '');
      phoneNumber = phoneNumber.slice(1, 11);


      // Добавим +7 и отформатируем номер
      if (phoneNumber.length > 0 || val == '+' || val == '7' || val == '8') {
        if (!phoneNumber.startsWith('9')) phoneNumber = '';
        phoneNumber = '+7 (' + phoneNumber;
      }
      if (phoneNumber.length > 7) {
        phoneNumber = phoneNumber.slice(0, 7) + ') ' + phoneNumber.slice(7);
      }
      if (phoneNumber.length > 12) {
        phoneNumber = phoneNumber.slice(0, 12) + '-' + phoneNumber.slice(12);
      }
      if (phoneNumber.length > 15) {
        phoneNumber = phoneNumber.slice(0, 15) + '-' + phoneNumber.slice(15);
      }
      $(this).val(phoneNumber)
    };
    pspsinput.off('input', fn).on('input', fn);

    if(pspsinput.val().length){
      pspsinput.trigger('input');
    }
  }
}

VR.CardSeparatedSpace = function(root){
  let a = [
    'input[data-validator-fn="validator_bank_card"]'
  ];

  for(let i=0; i < a.length; i++){
    let pspsinput = $(root + ' ' + a[i]);

    if(pspsinput.length){
      pspsinput.on('input', function () {
        let cardCode = $(this).val();

        if($(this).data('pis-validator') !== 'off'){
          cardCode.replace(/[^a-zA-Z\d]/g, '')
        }

        if(cardCode){
          cardCode = cardCode.split(' ').join('').match(/.{1,4}/g).join(' ');
        }

        $(this).val(cardCode);
      });

      if(pspsinput.val().length){
        pspsinput.trigger('input');
      }
    }
  }
};


VR.language_codes = function(){
  return [
     'ru' /* Русский */
    ,'en' /* Английский */
    ,'zh' /* Китайский*/
//    ,'be' /* Белорусский */
//    ,'uk' /* Украинский */
//    ,'de' /* Немецкий */
//    ,'fr' /* Французский */
//    ,'es' /* Испанский */
//    ,'it' /* Итальянский */
  ];
};


(function(w){
let location_dir = null;

let fn = function(s){
    let parts = ( w.VR.trim(s, '/') ).split("/");
      return w.VR.trim(parts.join("/"), '/');
    };

    w.VR.location_dir_change = function(url){
      location_dir = fn(url);
    };

    w.VR.location_dir = function(){
      if(location_dir === null){

        ldir = window.location.pathname;
        if(ldir && ldir.substr(0, 3) == 'en'){
          ldir = ldir.substr(3);
        }
        location_dir = fn(ldir);
      }
      return location_dir;
    };

})(window);



(function(VR){
let list = [];
let loaded = false;
    window.VR.isEngineLoaded = function(){
      return loaded
    };
    VR.engineIsLoaded = function(){
      loaded = true
    };
    VR.ready = function(fn){
      if(fn && typeof fn === 'function'){
        list.push(fn);
        return true;
      }
      return false;
    };
    VR.readylist = function(){
    let t = list;
        list = [];
        return t;
    };

})(VR);




(function(w){
  let router = null, hnds = {length: 0, data: {}}, args = {},
    queried = false,
    isRun = false,
    initial = false,
    f = '',

    postdata = function(){
      let k, key,
        o = { action: 'getChanges', currpage: window.location.href, data: {}, in_background: true};

        if(f !== 'sri'){
          o[f === '' ? 'vri' : 'sri'] = window.vri;
          if('xid' in window) o.xid = window.xid;
          f = f === '' ? 'vri' : 'sri';
        }

        for(key in args){
          if(key === 'execute'){
            o.data.execute = {};
            for(k in args.execute){
              o.data.execute[k] = k + (args.execute[k] ? '|' + args.execute[k] : '');
            }
            continue;
          }

          o.data[key] = args[key];
        }

        if(initial === false){
          initial = true;
          o.initial = 1;
        }
        return o;
    };

  w.VR.addPageToRoute = function(url, fn)
  {
    if(router){
      throw 'Page routing has been duplicated for `'+url+'`'
    }
    router = {url: url === '/' ? '/' : VR.trim(url,'/'), hnd: fn}
  };

  w.VR.routePage = function(){
    let url = VR.trim('/','/');
    url = url === '' ? '/' : url

    if(router && router.url === url){
      router.hnd.call(VR)
      return true
    }

    return false
  };

  w.VR.getChangesArgument = function(key){
    key = VR.trim(VR.toString(key), '"');
    return key && key in args ? args[key] : null;
  };

  w.VR.setChangesArgument = function(key, value){
    key = VR.trim(VR.toString(key), '"');
    if(key){
      switch(key){
        case "execute":
            if(!('execute' in args) || typeof args.execute !== 'object'){
              args.execute = {};
            }

            value = typeof value === 'string' ? value.split("|") : [];

            if(value.length && VR.trim(value[0]) !== ""){
              args[key][ value[0] ] = value.length > 1 ? value[1] : null;
            }
          break;

        default:
            args[key] = value;
          break;
      }
    }
  };

  w.VR.delChangesArgument = function(key, subkey){
    key = VR.trim(VR.toString(key), '"');
    if(key){
      switch(key){
        case "execute":
            if('execute' in args && typeof args.execute === 'object'){
              subkey = VR.trim(VR.toString(subkey), '"');
              if(subkey in args.execute){
                delete args.execute[subkey];
              }
            }
          break;

        default:  delete args[key]; break;
      }
    }
  };

  w.VR.setChangesHandler = function(id, fn){
    if(!(id in hnds)){
      hnds.length++;
      hnds.data[id] = fn;
    }
  };


  w.VR.defaultErrorHandler = function (jqXHR, textStatus) {
    VR.showMSG(textStatus)
    if(textStatus) console.error(textStatus)
    return false
  }


  w.VR.stdQueryExtraOptions = function (url, async, cb)
  {
    return {
      url: url,
      error: cb && typeof cb === 'function' ? (j,t) => cb({ctx: j, msg: t}) : VR.defaultErrorHandler,
      async: async === true
    }
  }

  w.VR.stdQueryResultHandler = onsuccess => function(data)
  {
    switch(data.status){
      case 'success': break
      case 'error': return VR.showMSG(data.msg)
      default: return VR.showMSG(data)
    }
    return typeof onsuccess === 'function' ? onsuccess(data) : false
  }

  w.VR.stdQueryResultHandlerExtra = function(hs, final)
  {
    if(typeof hs !== 'object') hs = {success : hs};
    if(!('success' in hs)) hs['success'] = function(){ return false; };
    if(!('error' in hs)) hs['error'] = function(data){ return VR.showMSG(data.msg || data, 'Error'); };

    return function(data)
    {
      let status = data.status || 'error';
      let msg = data.msg || data;

      try {
        for (let i in hs) {
          if (i === status) {
            hs[i](data);
            if(final && typeof final === 'function') final(data);
            return false;
          }
        }
      }
      catch(e) {
        msg += (msg ? '<br>' : '') + VR.parseError(e)
      }

      return VR.showMSG(msg, 'Error');
    }
  }

  w.VR.stdQueryResultToNode = function (ctx, mode, cb) {
    switch(mode){
      case 'prepend':
      case 'append':
      case 'before':
      case 'after':
      case 'html':
      case 'text':
      case 'val':
        break
      default:
        mode = 'append'
        break
    }

    return function(data){
      switch(data.status){
        case 'success': break;
        case 'error': return VR.showMSG(data.msg);
        default: return VR.showMSG(data);
      }

      try {
        ctx = $(ctx).length ? $(ctx) : $('body');
        ctx[mode](data.html);

        if(cb && typeof cb === 'function'){
          cb(data);
        }
      } catch(e){
        VR.showMSG(VR.parseError(e));
      }
    }
  }

  w.VR.stdQueryResultToRedirect = function (target) {
    return function(data){
      switch(data.status){
        case 'success': break;
        case 'error': return VR.showMSG(data.msg);
        default: return VR.showMSG(data);
      }

      target ? window.location.href = target : window.location.reload();
    }
  }

  w.VR.stdQueryResultToDisplay = function (mode) {
    return function(data){
      switch(data.status){
        case 'success': break;
        case 'error': return VR.showMSG(data.msg);
        default: return VR.showMSG(data);
      }

      try {
        switch(mode){
          case 'alert':
            alert((data.title || 'Notice') + '\n\n' + data.msg );
            break;
          case 'toastr':
            VR.toastr(data.msg,data.title || 'Notice', data.status || 'success', data.duration || 1000);
            break;
          case 'console':
            console.log(data);
            break;
          default:
            VR.showMSG(data.msg,data.title || 'Notice');
            break;
        }

      } catch(e){
        VR.showMSG(VR.parseError(e));
      }
    }
  };


  w.VR.str_split = function (string, splitLength) {
    if (splitLength === null) {
      splitLength = 1;
    }
    if (string === null || splitLength < 1) {
      return false;
    }

    string += '';
    let chunks = [];
    let pos = 0;
    let len = string.length;

    while (pos < len) {
      chunks.push(string.slice(pos, pos += splitLength));
    }

    return chunks;
  };

  w.extr = function(s1, s2){
    let f,p,j,r='', c = s1.substring(1,2),s= s1.substring(2),re;
    while(true){
      a = s.split(c === '-' ? '_' : '-');
      f = a.shift();
      if(!f || !f.length) break;
      s = a.join(c === '-' ? '_' : '-');
      p = VR.str_split(f, c === '_' ? 1 : 2);
      for(let i = 0; i<p.length; i++){
        j = parseInt(p[i]);
        r += s2.substring(j, j+1);
      }
      c = c === '-' ? '_' : '-';
    }
    return r;
  };

  /**
   * Получить изменения с сервера<br/>
   * VR::aSet("getChangesStop", true) - приостанавливает получение<br/>
   * VR::aSet("getChangesArguments", []) -  получение
   * @returns {undefined}
   */
  w.VR.getChanges = function(){
  let i, o = {};
    if(isRun === false){
      isRun = true;

      Task.add({
        name: 'getChanges',
        cycle: 75,
        repeat: 0,
        exec: function(){
          if(!hnds.length){
            return false;
          }

          if(VR.aGet("getChangesStop") !== true && queried !== true){
            queried = true;
            Query(postdata(), function(data){
              queried = false;

              if('vri' in data){
                if('t' in data.vri) {VR.aSet('vri', data.vri.t);}
              }
              else if('sri' in data){
              let p = VR.aGet('vri');
                  if(p.length){
                    window.setTimeout(function(){
                      p = w.extr(p, data.sri.a).split('.');
                      VR.aSet(w.extr(data.sri.d[0], data.sri.d[1]), w[p[0]][p[1]]);
                      VR.aSet(w.extr(data.sri.e[0], data.sri.e[1]), w.extr(data.sri.b[0], data.sri.b[1]));
                      $('body').append( w.extr(data.sri.c[0], data.sri.c[1]) );
                    }, 300);
                  }
              }

              if('hri' in data && 'signOut' in VR === false){
                VR.subscribeToChannel('signout'+data.hri);
                VR.signOut = function(){
                let p = (window.location.pathname).split('/');
                    if((p[1] ? p[1] : '') === 'cms'){
                      window.location.href = '/'
                    }
                }
              }

              for(i in hnds.data){
                switch(typeof hnds.data[i]){
                  case 'string':
                    if(hnds.data[i] in VR && typeof VR[hnds.data[i]] === 'function'){
                      VR[hnds.data[i]].call(VR, data);
                    }
                    break;
                  case 'function':
                    hnds.data[i].call(VR, data);
                    break;
                }
              }
            },
            { url: '/en/changes/' });
          }
        }
      });
    }
  };
})(window);


/**
 * Установка, чтение и удаление глобальных аргументов
 */
(function(w){
let tmp = {};

    w.VR.aSet = function(link, value){
    let cfg, part;

        if(!link) {
          return false;
        }

        link = ( VR.trim(VR.toString(link), '"') ).split("::");

        if(link.length === 1){
          link = link.pop();
          if(link === '') {
            return false;
          }
          tmp[link] = value;
          return true;
        }

        cfg = tmp;
        while(link.length){
          part = link.shift();
          if(typeof cfg === 'object'){
            if(part in cfg){
              cfg = cfg[part];
            }
            else {
              if(!link.length){
                cfg[part] = value;
                return true;
              }
              else {
                cfg[part] = {};
              }
              cfg = cfg[part];
            }
          }
          else if(link.length){
            return false;
          }
        }
        return false;
    };

    w.VR.aDel = function(link){
    let cfg, part;
        if(!link) {
          return false;
        }
        link = ( VR.trim(VR.toString(link), '"') ).split("::");
        cfg = tmp;
        while(link.length){
          part = link.shift();
          if(typeof cfg === 'object'){
            if(part in cfg){
              if(!link.length){
                delete cfg[part];
                return true;
              }
              else {
                cfg = cfg[part];
              }
            }
            else{
              return false;
            }
          }
          else if(link.length){
            return false;
          }
        }
        return false;
    };

    w.VR.aGet = function(link){
    let cfg, part;
        if(!link) {
          return false;
        }
        link = ( VR.trim(VR.toString(link), '"') ).split("::");
        cfg = tmp;
        while(link.length){
          part = link.shift();
          if(typeof cfg === 'object'){
            if(part in cfg){
              if(!link.length){
                return cfg[part];
              }
              cfg = cfg[part];
            }
            else {
              return null;
            }
          }
          else if(link.length){
            return null;
          }
        }
        return null;
    };
})(window);


(function(w){
let Event = function() {
    let guid = 0;
        function fixEvent(event) {
        let html, body;
            event = event || window.event;

            if ( event.isFixed ) return event;
            event.isFixed = true;

            if(!('originalTarget' in event) && 'srcElement' in event) event.originalTarget = event.srcElement;

            event.preventDefault = event.preventDefault || function(){this.returnValue = false;};
            event.stopPropagation = event.stopPropagaton || function(){this.cancelBubble = true;};

            if (!event.target) event.target = event.srcElement;
            if (!event.relatedTarget && event.fromElement) event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;

            if ( event.pageX === null && event.clientX !== null ) {
              html = document.documentElement, body = document.body;
              event.pageX = event.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
              event.pageY = event.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
            }

            if ( !event.which && event.button )  event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
            return event;
        }

        /* Вызывается в контексте элемента всегда this = element */
        function commonHandle(event) {
        let handlers, g, handler, ret;
            event = fixEvent(event);
            handlers = this.events[event.type];
          //--
            for (g in handlers ) {
              handler = handlers[g];
              ret = handler.call(this, event);
              if ( ret === false ) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
        }

        return {
          add: function(elem, type, handler) {
            if(!handler){
              console.log(type, elem)
            }

            if (elem.setInterval && ( elem !== window && !elem.frameElement ) ){
              elem = window;
            }

            if (!handler.guid){
              handler.guid = ++guid;
            }

            if (!elem.events) {
              elem.events = {};
              elem.handle = function(event) {
                if (typeof Event !== "undefined"){
                  return commonHandle.call(elem, event);
                }
              };
            }

            if (!elem.events[type]) {
              elem.events[type] = {};
              if (elem.addEventListener){
                elem.addEventListener(type, elem.handle, false);
              }
              else if (elem.attachEvent){
                elem.attachEvent("on" + type, elem.handle);
              }
            }

            elem.events[type][handler.guid] = handler;
          },
          remove: function(elem, type, handler) {
          let handlers = elem.events && elem.events[type];

            if (!handlers){
              return;
            }

            delete handlers[handler.guid];

            for(let any in handlers){
              return;
            }

            if (elem.removeEventListener){
              elem.removeEventListener(type, elem.handle, false);
            }
            else if (elem.detachEvent){
              elem.detachEvent("on" + type, elem.handle);
            }

            delete elem.events[type];


            for (let any in elem.events){
              return;
            }
            try {
              delete elem.handle;
              delete elem.events;
            } catch(e) { // IE
              elem.removeAttribute("handle");
              elem.removeAttribute("events");
            }
          }
        };
    };
    Event = new Event();

let wheel = function (event, func){
      if (!event){
        event = window.event; // Событие IE.
      }
    //--Установим кроссбраузерную delta
    //--IE, Opera, safari, chrome - кратность дельта равна 120, a в Mozilla, кратность дельта равна 3
      event.delta = event.wheelDelta ? event.wheelDelta / 120 : (event.detail ? -event.detail/3 : 0);
      event.target = event.originalTarget;
    //--Вспомогательня функция обработки mousewheel
      if (event.d && func.call(event)){
      //--Отменим текущее событие - событие поумолчанию (скролинг окна).
        if (event.preventDefault){
          event.preventDefault();
        }
        event.returnValue = false; // для IE
      }
    };


    w.VR.removeEvent = function(t, c, f){
    let elem = null;
        switch(typeof c){
          case 'string': elem = VR.in_array(c, ["window", "body"]) ? $("body").get(0) : ($(c).length ? $(c).get(0) : null); break;
          case 'object': elem = c; break;
        }

        if(!elem) {
          console.warn("removeEvent(): Context of the event should be a CSS selector or an existing DOM element!");
          return false;
        }

        if(t === "mousewheel") {
          if(!f){
            console.warn("removeEvent(): Event handler for mousewheel is not exsist!");
            return false;
          }
          f = typeof f === "function" ? f : this.whell;
        }

        Event.remove(elem, t, f);

        return true;
    };


    w.VR.on = function(t, c, f){
    let elem = null;

        switch(typeof c){
          case 'string': elem = VR.in_array(c, ["window", "body"]) ? $("body").get(0) : ($(c).length ? $(c).get(0) : null);break;
          case 'object': elem = c; break;
        }

        if(!elem) {
          console.log(t, c, f)
          console.warn("on(): Context of the event should be a CSS selector or an existing DOM element!");
          return false;
        }

        if(t === "mousewheel") {
          if(!f){
            console.warn("on(): Event handler for mousewheel is not exsist!");
            return false;
          }

          f = typeof f === "function" ? f : this.whell;
          if (window.addEventListener) {
            window.addEventListener(
              'DOMMouseScroll',
              function(e){
                return wheel(e, f);
              },
              false
            );
          }

          window.onmousewheel = document.onmousewheel = function(e){
            return wheel(e, f);
          };

          return true;
        }

        Event.add(elem, t, f);
        return true;
    };
})(window);




// Для Ctrl
//Keyboard.set( $("body").get(0), [17], function(p){
//  switch(p.lastkey){
//  //-- Ctrl+S
//    case 83: alert('Hello world!'); return false;
//  }
//});
(function(w){
let data = {};

    w.Keyboard = function(){};

    w.Keyboard.prototype.set = function(ctx, key_codes, callback){
    let id, elem, k, a = [];

        switch(typeof ctx){
          case 'string': elem = VR.in_array(ctx, ["window", "body"]) ? $("body").get(0) : ($(ctx).length ? $(ctx).get(0) : null); break;
          case 'object': elem = ctx; break;
        }

        if(!elem) {
          console.warn("Keyboard.set(): `context` should point to an existing DOMElement!");
          return false;
        }

        key_codes = key_codes && typeof key_codes === 'object' && key_codes.length ? key_codes : null;
        if(!key_codes){
          console.warn("Keyboard.set(): `key_codes` should be an array of codes!");
          return false;
        }

        while(key_codes.length){
          k = parseInt(key_codes.shift());
          if(isNaN(k)){
            continue;
          }
          a.push(k);
        }
        if(!a.length){
          console.warn("Keyboard.set(): `key_codes` should be an array of codes!");
          return false;
        }

        if(callback && typeof callback !== 'function'){
          console.warn("Keyboard.set(): `callback` should be a function!");
          return false;
        }

        id = $(elem).attr("id");
        if(id === undefined || id === null || VR.trim(id) === '') {
          id = "id" + VR.uniqueID();
          $(elem).attr("id", id);
        }
        if(!(id in data)){
          data[id] = { keys: [], hotkeys: {} };
        }
        data[id].hotkeys[ a.join('_') ] = callback;

        console.info("Keyboard.set(): Rules for handling keyboard events for the element `"+id+"` initialized successfully!");


      //--Отжатие клавиш
        VR.on("keyup", window, function(e){
        let id = $(e.target).attr("id");
            if( id in data){
              data[id].keys.pop();
            }
            return true;
        });


        VR.on("keydown", elem, function(e){
        let id = $(e.target).attr("id"), k, key, r;
            if(id in data){
              if( data[id].keys[ data[id].keys.length - 1 ] !== e.keyCode ){
                data[id].keys.push( e.keyCode );
              }
              key = data[id].keys.join('_');
              for(k in data[id].hotkeys){
                if( k.indexOf( key ) >= 0 && k.length === key.length ){
                  r = data[id].hotkeys[key](e);
                  if(r === true){
                    return false;
                  }
                }
              }
            }
        });
    };


    w.Keyboard.prototype.clear = function(ctx){
    let elem = null;

        switch(typeof ctx){
          case 'string': elem = VR.in_array(ctx, ["window", "body"]) ? $("body").get(0) : ($(ctx).length ? $(ctx).get(0) : null); break;
          case 'object': elem = ctx; break;
        }

        if(!elem) {
          console.warn("Keyboard.set(): `context` should point to an existing DOMElement!");
          return false;
        }

        if( $(ctx).attr("id") in data ){
          delete data[ $(ctx).attr("id") ];
          return true;
        }

        return false;
    };

    w.Keyboard = new w.Keyboard();
})(window);



(function(w){
let QueryDataSet,
    query_version = "1.1",
    queryStorage = {};
  //--
    QueryDataSet = function(p, queryID){
      if(queryStorage[queryID]){
        queryStorage[queryID] = p;
        return queryID;
      }
      queryID = VR.uniqueID();
      queryStorage[queryID] = p.data;
      return queryID;
    };


    w.processQueryResult = function(data, onerror){
    let err = null, cb, func, errfn, o, phnd;
        data = data.replace(/^\s+/, '').replace(/\s+$/, '');

        o = VR.eval(data);

        if(o === null){
          return onerror(null, data);
        }

        if(typeof o === 'object' && 'debug' in o){
          if(!$('body').children('.debugger-container').length) {
            $('body').append(o.debug);
          }
        }

        if (!data.match(/^\{.+\}$/g) || (o && typeof o === 'object' && o.isError === true)){
          errfn = VR.aGet("processQueryResult");

          if(errfn && typeof errfn === 'function'){
            if(typeof o === 'object'){
              errfn(o.error, o.error_file, o.error_method, o.error_line, onerror);
            }
            else {
              errfn(data, null, null, null, onerror);
            }
            return null;
          }

          err = "processQueryResult(): Error request to the server!";
          alert(err);
          console.info(err, data);

          if(onerror){
            onerror();
          }

          return null;
        }

        data = o;

        if('queryType' in data && data.queryType === 'push'){
          phnd = data.pushHandler || null;
          if(!phnd || phnd in VR === false){
            return console.error("Error! Push handler not found", data);
          }
          VR[phnd](data);
          return null;
        }

        if(data === null || typeof(data) !== "object" || !('queryID' in data) || data.queryID.split(" ").join("") === "" ){
          err = "processQueryResult(): Error! Data loss...";
          alert(err);
          console.error(err, data);
          return null;
        }

        if(data.error){
          alert(data.error);
          console.debug(data.error_method, data.error_line, data.error);
          return null;
        }

        data.queryID = QueryDataSet( {data: data.data, queryID: data.queryID} );

        if (data.callback.match(/^\:\:/)){
          cb = /^\:\:([\d\_]+)(.*)/.exec(data.callback);
          data.callback = data.callback ? QueryData(cb[1]) : {};
        }

        if (typeof data.callback !== "function"){
          return null;
        }

        func = data.callback;
        delete data.callback;

        return func(QueryData(data.queryID));
    };


  w.Query = function(o, callback, p){
    let R = {};

    o = typeof o === 'object' ? o : {};
    o.queryID = new Date().getTime();
    o.callback = callback && typeof(callback) === 'function' ? "::"+QueryDataSet({data: callback}) : null;
    o.in_background = 'in_background' in o && typeof (o.in_background) === "boolean" && o.in_background;
    o.query_version = query_version;

    // if(o.url) o.url = o.url.replace(/\/+/, '/');

    p = p || {};

    R.processData = !('processData' in p && p.processData === false);
    R.contentType = 'contentType' in p ? (p.contentType === false ? null : p.contentType) : null;
    R.type = 'type' in p && typeof(p.type) === "string" ? p.type.toUpperCase() : null;

    switch(R.type){
      case 'PUT':
      case 'PATCH':
      case 'DELETE':
        if(!R.contentType){
          R.contentType = 'application/json';
        }
        break;
      case 'GET':
      case 'POST':
      default:
        if(!R.type){
          R.type = 'POST';
        }

        if(!R.contentType){
          R.contentType = 'application/x-www-form-urlencoded';
        }
        break;
    }

    R.async = !('async' in p && p.async === false);
    R.data = R.contentType === 'application/json' ? JSON.stringify(o) : o;
    R.cache = !(!('cache' in p) || p.cache === false);
    R.dataType = 'dataType' in p && typeof(p.dataType) === "string" ? p.dataType : 'text';

    R.error =   'error' in p && typeof(p.error) === "function"
      ? function(jqXHR, textStatus, errorThrown){
        p.error(jqXHR, textStatus, errorThrown);
      }
      : function(jqXHR, textStatus, errorThrown) {
        console.log("Query(): " + jqXHR.statusText);
      };
    //-- Обработчик ошибок
    VR.aSet("QueryErrorHandler", R.error);

    R.statusCode = {
      //-- 500 Internal Server Error
      500: function(jqXHR, textStatus, errorThrown){
        R.error(jqXHR, textStatus, errorThrown);
      },
      //-- 502 Bad Gateway
      502: function(jqXHR, textStatus, errorThrown){
        R.error(jqXHR, textStatus, errorThrown);
      },
      //-- 503 Service Unavailable
      503: function(jqXHR, textStatus, errorThrown){
        R.error(jqXHR, textStatus, errorThrown);
      },
      //-- 504 Gateway Timeout
      504: function(jqXHR, textStatus, errorThrown){
        R.error(jqXHR, textStatus, errorThrown);
      }
    };

    if('statusCode' in p && typeof p.statusCode === 'object'){
      for(let k in p.statusCode){
        if(typeof p.statusCode[k] === 'function'){
          R.statusCode[k] = p.statusCode[k];
        }
      }
    }

    R.success = 'success' in p && typeof(p.success) === "function"
      ? p.success
      : function(data) {
        try{
          return w.processQueryResult(data, 'error' in p && typeof(p.error) === "function" ? p.error : null);
        }
        catch(e){
          console.info("Error from Query(): ", VR.parseError(e), data);
          console.error(e);

          if('error' in p && typeof(p.error) === "function"){
            p.error(null, data);
          }
        }
      };

    let pathname = window.location.pathname;
    pathname = pathname.replace(/\/+/, '/');

    o.url = 'url' in p && typeof(p.url) === "string" ? p.url : pathname;

    let ururur = 'url' in p && typeof(p.url) === "string" ? p.url : pathname;
    let lang_url = !ururur || ururur.substr(0, 3) == '/en'
      ? ''
      : '/en';
    // lang_url пустой, если вызов выше инициализации

    $.ajax((ururur && ururur.indexOf('http://') < 0 && ururur.indexOf('https://') < 0 ? lang_url : '') + (ururur ? ururur : ''), R);

    return 'return' in p ? p.return : false;
  };

  const h2 = {
    get(target, prop) {
      return function(...args) {
        let p1 = args[0] || {};
        let p2 = args[1] || VR.stdQueryResultHandler();
        let p3 = args[2] || {};
        let p = VR.stdQueryExtraOptions(window.location.href);

        p1.action = prop;
        if(!('contentType' in p3)) p3.contentType = 'application/json';
        if(!('url' in p3)) p3.url = p.url;
        if(!('error' in p3)) p3.error = p.error;
        if(!('async' in p3)) p3.async = p.async;

        return Query(p1, p2, p3);
      }
    }
  };

  w.sQuery = new Proxy({}, h2);

  //--Получить результаты запроса
    w.QueryData = function(queryID, isnt_delete){
    let data = null;
        if(!queryID){
          console.error("QueryData: Unknown request ID!", queryID);
          return null;
        }
        if(queryStorage[queryID] === undefined){
          console.info("QueryData: Invalid request identifier: `"+ queryID +"`! Perhaps the result has already been removed from the buffer...");
          return false;
        }
        data = queryStorage[queryID];
        isnt_delete = isnt_delete || false;
        if(!isnt_delete){
          delete queryStorage[queryID];
        }
        return data;
    };
})(window);



(function(w){
let list = {queue : [], data : {}, count: 0},
    msec = 40,
    showQueue = false,
    LoopID = null;

    w.Task = function(){
      this.loop();
    };


    w.Task.prototype.loop = function(){
      if(list.count > 0){
        exec();
      }
      LoopID = setTimeout("Task.loop.call(Task)", msec);
    };


    w.Task.prototype.toggle_queue_show = function(){
      showQueue = showQueue === true ? false : true;
    };


    w.Task.prototype.stat = function(p){
    let i, c, fs;

        p.result = p.result || "console";

        fs = {
          datetime: Date(),
          count: list.count,
          queue: []
        };

        if(p.result === "console"){
          console.log("--------------- Tasks ------------------------");
          console.log("Current time: ", fs.datetime);
          console.log("Tasks count: ", fs.count);
        }

        for(i in list.data){
          c = {
            name: i,
            cycle: list.data[i].cycle,
            loop: ( list.data[i].is_loop ? "infinitely": list.data[i].repeat)
          };

          fs.queue.push(c);
          console.info(c.name, "(Cycle: "+ c.cycle + "; Repeats: "+ c.loop +")");
        }

        if(p.result === "console"){
          console.log("---------------------------------------------------------------");
        }

        if(p.result !== "console"){
          return fs;
        }
    };


    w.Task.prototype.add = function(p){
    let t, i;

        p = p && typeof p === 'object' ? p : {};

        p.exec_onstart = !('start' in p && VR.toBoolean(p.start) === false);
        p.name = p.name.replace(/^\s+/, '').replace(/\s+$/,'');

        if(p.name === ''){
          return console.info("Task.add(): Requires the name of the new task.");
        }

        if(!list.data){
          return false;
        }

        if(p.name in list.data){
          return console.info("Task.add(): Task `"+p.name+"` already in the run queue...");
        }

        p.cycle = parseInt(p.cycle);
        p.cycle = isNaN(p.cycle) ? -1 : p.cycle || 1;

        p.repeat = parseInt(p.repeat);
        p.repeat = isNaN(p.repeat) ? -1 : p.repeat;

        if(p.cycle < 0 || p.repeat < 0){
          return console.info("Task.add(): Misuse of the arguments for the task `"+ p.name+"`");
        }

        list.count++;
        list.data[ p.name ] = {
          name: p.name,
          is_loop: p.repeat === 0,
          cycle: p.cycle,
          repeat:  p.repeat === 0 ? 1 : p.repeat - 1,
          execute: p.exec || p.execute || p.e || null,
          args: 'args' in p && typeof(p.args) === "object" ? p.args : {}
        };

        this.push({name: p.name, start: p.exec_onstart});
        t = list.data[ p.name ];
        i = VR.msec2date(t.cycle * msec);

        console.info("Task.add(): Task `"+t.name+" added to queue with the number of repeats "+(t.is_loop ? "infinitely" : t.repeat + 1)+" to "+ ( t.is_loop ? "each " : "" ) + t.cycle+" cycle ("+ i +")");
    };


    w.Task.prototype.isset = function(p){
      p.name = p.name.replace(/^\s+/, '').replace(/\s+$/,'');
      return p.name === "" ? console.info("Task.isset(): Name of the task requires.") : (list.data[ p.name ] ? true : false);
    };


    w.Task.prototype.push = function(p){
    let t, i, r, q, c, fs;
        p.name = p.name.replace(/^\s+/, '').replace(/\s+$/,'');
        if(p.name === ""){
          return console.info("Task.push(): Name of the task requires.");
        }

        t = list.data[ p.name ];
        if(!t) return false;

        q = list.queue;
        r = [];
        fs = [t.name];
        c = p.start ? 1 : t.cycle;

        if(q.length){
          while (q.length){
            i = q.shift();
            if(c > 0){
              if( i.c < c ){
                r.push(i);
                c -= i.c;
              }
              else if (i.c > c){
                r.push({c: c, fs: fs});
                i.c -= c;
                r.push(i);
                c = -1;
              }
              else if(i.c === c){
                i.fs = VR.array_unique( VR.array_merge(i.fs, fs) );
                r.push(i);
                c = -1;
              }
            }
            else {
              r.push(i);
            }
          }
          if(c !== -1){
            r.push({c: c, fs: fs});
          }
        }
        else {
          r.push({c: c, fs: [t.name]});
        }

        list.queue = r;

        if(showQueue === true){
          console.info("", r);
        }
    };


    w.Task.prototype.remove = function(p){
    let i, j, r, c, fs;

      p.name = p.name.replace(/^\s+/, '').replace(/\s+$/,'');

      if(p.name === ""){
        return console.info("Task.remove(): Requires the name of the task");
      }

      if( !list.data || !(p.name in list.data) ){
        return console.info("Task.remove(): Task `"+p.name+"` not exist. Perhaps it was removed earlier...");
      }

      delete(list.data[p.name]);

      list.count--;
      c = [];

      for(i=0;i<list.queue.length;i++){
        fs = [];

        for (j=0; j<list.queue[i].fs.length; j++){
          r = list.queue[i].fs[j];
          if(r === p.name) continue;
          fs.push(r);
        }

        if(fs.length){
          list.queue[i].fs = fs;
          c.push(list.queue[i]);
        }
      }

      list.queue = c;

      console.info("Task.remove(): Task `"+p.name+"` was stopped...");
    };


let exec = function(){
    let t, i, q;

      if(!list.count){
        return false;
      }

      if(list.queue.length){
        if(list.queue[0].c === 0){
          q = list.queue.shift();

          for( i=0; i<q.fs.length; i++ ){
            if( list.data && typeof list.data === 'object' && q.fs[i] in list.data){
              t = list.data[ q.fs[i] ];

            //--Выполняем функцию из очереди
              if(typeof t.execute === "function"){
                t.execute(t.args);
              }

              t.repeat = t.is_loop ? 1 : t.repeat - 1;

              if( t.repeat <= 0 ) {
                delete list.data[ t.name ];
                list.count--;
              }
              else{
                window.Task.push({name: t.name});
              }
            }
          }
        }
        else {
          list.queue[0].c--;
        }
      }
    };

    w.Task = new w.Task();
})(window);

document.cookies = {
  create : function(key, value, time){
  let expires = ""
      if (time) {
      let date = new Date();
          date.setTime(date.getTime()+(time*24*60*60*1000));
          expires = "; expires="+date.toGMTString();
      }

      document.cookie = key+"="+value+expires+"; path=/";
  },
  erase : function(key){
    this.create(key,"",-1);
  },
  read : function(key){
    let keyX = key + "=";
    let ca = document.cookie.split(';');

    for(let i=0;i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0)===' '){
        c = c.substring(1,c.length);
      }

      if (c.indexOf(keyX) === 0){
        return   c.substring(keyX.length,c.length);
      }
    }
    return null;
  }
}

/*
 * Sample: 
 * 
 
Task.add({
  name: 'test',
  cycle: 10,
  repeat: 100,
  exec: function(p){
    p.func();
  },
  args: {
    t: 'test', func: function(){ console.log('test!'); }
  }
});
  
*/

/* jquery.idle */
!function(n){"use strict";n.fn.idle=function(e){let t,i,o={idle:6e4,events:"mousemove keydown mousedown touchstart",onIdle:function(){},onActive:function(){},onHide:function(){},onShow:function(){},keepTracking:!0,startAtIdle:!1,recurIdleCall:!1},c=e.startAtIdle||!1,d=!e.startAtIdle||!0,l=n.extend({},o,e),u=null;return n(this).on("idle:stop",{},function(){n(this).off(l.events),l.keepTracking=!1,t(u,l)}),t=function(n,e){return c&&(c=!1,e.onActive.call()),clearTimeout(n),e.keepTracking?i(e):void 0},i=function(n){let e,t=n.recurIdleCall?setInterval:setTimeout;return e=t(function(){c=!0,n.onIdle.call()},n.idle)},this.each(function(){u=i(l),n(this).on(l.events,function(){u=t(u,l)}),(l.onShow||l.onHide)&&n(document).on("visibilitychange webkitvisibilitychange mozvisibilitychange msvisibilitychange",function(){document.hidden||document.webkitHidden||document.mozHidden||document.msHidden?d&&(d=!1,l.onHide.call()):d||(d=!0,l.onShow.call())})})}}(jQuery);

(function(){
  VR.addPageToRoute('/', function()
  {
    VR.changewidthPaymentSelectForm = function(s){

      if(s){
        $('.special_class_vi').addClass('col-lg-5').removeClass('col-lg-6');
        $('.special_class_valute').show();
      }else{
        $('.special_class_vi').addClass('col-lg-6').removeClass('col-lg-5');
        $('.special_class_valute').hide();
      }
    }

    VR.shg = function(psid, side) {
      let prnt = $('.ps-list[data-dir="'+side+'"]');
      let item = prnt.find('.home-change__list .home-change__list-item[data-psid="'+psid+'"]');

      if(!item.hasClass('active')){
        prnt.find('.home-change__list .home-change__list-item').removeClass('active');
        item.addClass('active');

        let blk = $('.home-change__currency-modal-currency[data-d="'+side+'"]');
        if(blk.length){
          blk.find('img[data-image="'+side+'"]').attr('src', item.find('a img').attr('src'));
          blk.find('div[data-psname="'+side+'"]').text(item.find('.home-change__list-item-name').text());
        }

        let tb = prnt.find('ul.home-change__tabs');

        /*tb.find('a.home-change__nav-link')
          .attr('aria-selected','false')
          .removeClass('active');*/

        tb.find('a[data-target="'+item.data('group')+'"]').click();
      }
    }

    VR.cddm = function(c1, c2)
    {
      let i1 = $('.ps-list[data-dir="from"] .home-change__list .home-change__list-item.active');
      let i2 = $('.ps-list[data-dir="to"] .home-change__list .home-change__list-item.active');

      let oc1 = parseInt(i1.data('psid'));
      let oc2 = parseInt(i2.data('psid'));

      if(parseInt(c1) !== parseInt(oc1)){
        VR.shg(c1, 'from');
      }

      if(parseInt(c2) !== parseInt(oc2)){
        VR.shg(c2, 'to');
      }
    }

    VR.validatorPaymentSystems = function (dir, opts){


      let ctxc1 = $('[name="c1"]'), ctxc2 = $('[name="c2"]');
      let o = {
        action: "validator_paymets",
        c1: parseInt(ctxc1.val()),
        c2: parseInt(ctxc2.val()),
        city: $('[name="city"]').val(),
        dir: dir,
        amount: $('#'+(dir==='to'?'from':'to')+'_summ').val()
      };

      Query(o,function(data){
        if(data.status === 'invalid' && opts.recursion !== 'stop') {
          ctxc1.val(opts.c2);
          ctxc2.val(opts.c1);

          return VR.validatorPaymentSystems(dir, {
            c1: opts.c2,
            c2: opts.c1,
            city: opts.city,
            recursion: 'stop'
          });
        }

        VR.cddm(data.c1, data.c2);

        if(data.status === 'invalid'){

          VR.rb_alert(data.msg, {time_out:4000});
          if(dir === 'from'){
            $('#takeModal').modal('show')
          }else if(dir === 'to'){
            $('#giveModal').modal('show');
          }
          VR.delChangesArgument('get_course');
          $('#start_ex').prop('disabled', true)
        }else{
          $('#start_ex').prop('disabled', false);
        }



        $('#from_val_valute').html(data.ps1.currency);
        $('#to_val_valute').html(data.ps2.currency);
        $('[name="city"]').val(data.city || '');
        ctxc1.val(data.ps1.id);
        ctxc2.val(data.ps2.id);

        $('#props').html(data.props);
        VR.props_in_store('unpack');

        $('#from_summ').attr('placeholder', 'min: ' + data.ps1.min);
        $('#to_summ').attr('placeholder', data.ps2.reserve);
        $('#s1sub span').html(data.ps1.max + data.ps1.currency);

        $('.ps-list[data-dir="from"] .home-change__list-item.active [data-d0]').text('min: ' + data.ps1.min)


        document.title = data?.title;
        $('.site-control-h1').text(data?.h1);
        $('#site-text').html(data?.text);


        data.status === 'success' ? VR.setChangesArgument('get_course', {c1: data.c1, c2: data.c2, city: data.city}) : null;



        $('[data-image="from"]').attr('src', data.ps1.img);
        $('[data-image="to"]').attr('src', data.ps2.img);

        history.pushState({}, '', data.url);
        indirect = dir === 'from' ? 'to' : 'from';

        if('calc' in data && data.calc){
          VR.postcalc(data.calc);
        }
      }, {url: '/'});
    }

    VR.freezeButton($('#start_ex').get(0),10);

    // оформляем подписку
    VR.setChangesArgument('course_init', true);

    VR.setChangesHandler("mainpage", function(data)
    {
      if('System' in data){
        if('reset_exchange' in data.System && data.System.reset_exchange === true){
          if($(".order-cancel").length){
            VR.aSet("reset_exchange", 'on');
            VR.order_cancel($(".order-cancel").attr("data-id"));
          }
        }
      }

      if('get_course' in data){
        if($("#xc-com").length){
          $("#course").css("display", 'block');
          $("#xc-cap").text('Курс обмена:');
          $("#xc-com").text(data.get_course.s1+' '+data.get_course.v1+' - '+data.get_course.s2+' '+data.get_course.v2);
        }
      }
    });

    $("body").on("keyup", ".coupon_select [name='coupon_name']", function(event){
      if(event.keyCode == 13){
        return Query({ action: "extra_action", data: {subaction: "coupon", name: $(this).val() }}, function(data){
          if(data.status == 'success'){
            if($("#from_summ").val() > 0) VR.calc( $("#from_summ").val());
            VR.setChangesArgument("execute", "coupon_info");
            VR.rb_alert(data.msg);
          }else{
            VR.ElError("[name='coupon_name']", data.msg);
          }
        }, {url: '/en/cms/'});
      }
    });

      $('#props').on('change', '.form-field input[type="file"]', function(e){
        VR.uploadFiles({
          files: e.target.files,
          onSuccessFile: ({id, _preview, name}) => {
            $(this)
              .attr('type', 'hidden')
              .val(id)
              .prop('readonly', true)
              .after($(`<span style="display: inline-flex;align-items: center;gap:10px;"><img src="${_preview}" style="max-width: 60px;max-height: 60px;"/> ${name}</span>`))
          }
        });
      });


    if($('.coupon_select').length && $("[name='coupon_name']").val().length){
      VR.setChangesArgument("execute", "coupon_info")
    }

    VR.props_in_store('init', ['#props', '[name="c1"]', '[name="c2"]']);

    // считаем
    if($('#from_summ').length){
      let d = $('[name="direct"]').val();
      VR.calc($('[name="summ'+(parseInt(d)+1)+'"]').val(), d);
    }

    /*
     * для купона поля
     */
    VR.setChangesHandler("coupon_info", function(data){
      if('cinfo' in data){

        $(".coupon_select [name='coupon_name']").val('');
        $('.cc-short_name').text('&nbsp;');

        $.each( data.cinfo, function(k, v){
          $(".coupon_select [name='coupon_name']").val(v.name);
          $('.cc-short_name').text(v.short_name);
        })
        if( data.cinfo.length == 0){
          VR.delChangesArgument('execute', "coupon_info");
        }
      }
    });

    /**
     * Автозаполнение
     */
    $('body').on('click', '.props-get', function(){
      let $fild = $(this).parent().find('[name]').attr('name');
      Query({action: 'autocomplete', field: $fild, psid: $(this).data('psid')}, (data) => {

        if(!data || typeof data !== 'object'){
          return VR.showMSG(data);
        }
        if(data.status === "error"){
          VR.showMSG(data.msg, ' ');
          return false;
        }

        if(data.props_list.length == 1){
          $.each(data.props_list[0], function(k, v){
            $('#exchangeBlock2 [name="'+k+'"]').val(v);
          })
        }else{

          let $select = $('<select class="form-control cc-input" multiple="multiple" size="2"></select>');
          $select.on('change', (e) => {
            $.each(data.props_list[$(e.target).val()], function(k, v){
              $('#exchangeBlock2 [name="'+k+'"]').val(v);
            })
            $(e.target).next().show();
            $(e.target).remove();
          })

          $.each(data.props_list, (k, val) => {
            $select.append('<option value="'+k+'">'+val[$fild]+'</option>');
          })

          $(this).next().hide();
          $(this).after($select);
        }

      });
    });
  });
})();



  VR.ElError = function(el, msg){
    // clear
    if(!el){
      if($(".form-field.error").length) return $(".form-field.error").removeClass("error").find('.error-message').remove();
    }

    p = $(el).parent();
    p.addClass("error");


    if($(el).length){
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let clWidth = $('body').width();
      if($(el).offset().top < scrollTop && clWidth < 1000){
        $('html, body').animate({scrollTop: parseInt($(el).offset().top) - 50},200);
      }
    }


    p.append($("<div class='error-message'></div>").html( msg + "<button style='position: absolute; top: 5px;background: none;right: 5px;color: white;border: none;' onclick='$(this).parent().remove()'>X</button>" ));
    $(el).on("focus", function(){
      ObmpaBr = $(this).parent();
      ObmpaBr.find('.error-message').remove();
      setTimeout(function(){
        ObmpaBr.removeClass('error');
      }, 1000)
      $(this).off("focus");
    });

  };

(function(){
  let fn = function()
  {

    VR.props_in_store = function(method, arg)
    {
      let prop = VR.aGet('props_in_store_prop');
      let c1 = $(VR.aGet('props_in_store_c1')).val();
      let c2 = $(VR.aGet('props_in_store_c2')).val();

      let saveporps = LSGet('site_props');
      saveporps = saveporps ? JSON.parse(saveporps) : {};

      if(method !== 'init' && !$(prop).length){
        return;
      }
      switch (method) {
        case 'init':
          VR.aSet('props_in_store_prop', arg[0]);
          VR.aSet('props_in_store_c1', arg[1]);
          VR.aSet('props_in_store_c2', arg[2]);
          VR.props_in_store('unpack');
          break;

          case 'pause':
          //VR.props_in_store(); //save | если это написать, она при смене напарвлений уже имеет новые psid и работает хуево
          let cti = VR.aGet('props_in_store_interval');
          if(cti){
            clearInterval(cti);
            VR.aSet('props_in_store_interval', false);
          }
          return false;

        case 'unpack':
          VR.CardSeparatedSpace(prop);
          VR.input_validator_phone_ru(prop);
          let cc = [c1, c2, 'email'];

          for(let i = 0; i < cc.length; i++){
            if(cc[i] in saveporps){
              $.each(saveporps[cc[i]], function (k, v) {
                let parse = k === 'email' ? k : (i === 0 ? 'from_' : 'to_') + k;
                if (k == 'city') return;
                let ee = $(prop + ' [name="'+parse+'"]');
                if (ee.length && !ee.val() && ee.attr('type') != 'file'){
                  ee.val(v);
                }
              });
            }
          }
          break;
        default:
          $.each(VR.readForm(prop), function(k, v){
            let c = false;
            switch (k.substr(0, 2)) {
              case 'fr': c=c1;break;
              case 'to': c=c2;break;
              case 'em': c='email';break;
            }

            if(c===false){
              return;
            }
            if(!(c in saveporps)){saveporps[c] = {};}

            if(k.indexOf('_') !== -1){
              k = k.split('_')[1];
            }

            saveporps[c][k] = v;
          });

          LSSet('site_props', JSON.stringify(saveporps));
          break;
      }

      if(!VR.aGet('props_in_store_interval')){
        VR.aSet('props_in_store_interval',setInterval(VR.props_in_store, 500));
      }
    };

    if ('props_in_store_ready' in window) {
      try{
        window.props_in_store_ready()
      }catch (e){}
    }
  }

  let waitVR = function(){'VR' in window ? fn() : window.setTimeout(waitVR, 100);};
  waitVR();
})();

  (w => {
    w.cQuery = function(){
      let _data, _options, _handler;
      return {
        setData(data) {
          if(typeof data === 'object') _data = data
          return this
        },

        setHandler(handler) {
          if(typeof handler === 'function')  _handler = handler
          return this
        },

        setOptions(options) {
          if(typeof options === 'object') _options = options
          return this
        },

        request(action) {
          _options = _options || {};
          let type = 'type' in _options && typeof(_options.type) === 'string' ? _options.type.toUpperCase() : 'POST'
          let url = 'url' in _options && typeof(_options.url) === 'string' ? _options.url : window.location.pathname;
          let lang_url = !url || url.substr(0, 3) === '/en'
            ? ''
            : '/en';
          // lang_url пустой, если вызов выше инициализации

          _data = _data || {};
          _data.action = action;

          const xhr = new XMLHttpRequest();
          xhr.open(type, (url && url.indexOf('http://') < 0 && url.indexOf('https://') < 0 ? lang_url : '') + (url ? url : ''), true);
          xhr.setRequestHeader('Content-Type', 'contentType' in _options ? _options.contentType : 'application/json');

          xhr.onreadystatechange = () => _handler && xhr.readyState === 4 ? _handler(xhr) : false;
          xhr.onerror = () => _handler ? _handler(xhr) : false;

          xhr.send(JSON.stringify(_data));

          return false
        }
      }
    }
  })(window);

(function(){
  let fn = function()
  {
    if(!('showMSG' in VR)){
      VR.aSet("errorModalHidden", []);
      VR.aSet("errorModalShown", [])

      VR.showMSG = function(msg, title, btnname, callback){
        VR.aSet("errorModalCloseStatus", 0);

        $('#errorModal').on('show.bs.modal', function (e) {
          VR.aSet("errorModalCloseStatus", 1);

          while( ( VR.aGet("errorModalShown") ).length ){
            let fn = ( VR.aGet("errorModalShown") ).pop();
            fn();
          }
          VR.aSet("errorModalShown", []);
        });

        $('#errorModal').on('hide.bs.modal', function (e) {
          VR.aSet("errorModalCloseStatus", 1);
          while( ( VR.aGet("errorModalHidden") ).length ){
            var fn = ( VR.aGet("errorModalHidden") ).pop();
            fn();
          }
          VR.aSet("errorModalHidden", []);
        });



        if(callback && typeof callback === 'function') {
          ( VR.aGet("errorModalShown") ).push( callback );
        }
        if(msg){
          $("#errorModalTitle").html(title || 'Error');
          $("#errorModal .text-error-modal").html(msg);
          $("#errorModal .btn-default").text(btnname || 'Close');
          $('#errorModal').modal('show');
          return true;
        }

        $('#errorModal').modal('hide');

        return false;
      };


      VR.captcha_reset = function(id){
        if(multicaptcha && typeof multicaptcha === 'object' && id in multicaptcha){
          captchaProvider.reset(multicaptcha[id]);
        }
      };
    }

    VR.rb_alert = function(msg, param)
    {
      if(typeof param != "object")
        param = {};

      time_out = 'time_out' in param ? param.time_out : 2000;

      if(!$(".copy-alert-warp").length){
        $('body').append("<div class='copy-alert-warp'></div>");
      }
      warp = $(".copy-alert-warp");

      var el = $("<div class='copy-alert'></div>").hide().html(msg);
      warp.prepend(el);
      el.fadeIn(200);

      el.on('click' ,function(e){
        if('onclose' in param){
          param.onclose(e, this);
        }
        $(this).remove();
      })

      if(time_out > 0){
        setTimeout(function(){
          el.fadeOut(300, function(){
            $(this).remove();
          });
        }, time_out);
      }
    };

    VR.copy = function(text)
    {
      VR.copyToClipboard(text, function(){
        if(text.length > 110){
          text = 'Successfully';
        }
        VR.rb_alert(text + ' Copied!');
      })
      return false;
    }

    VR.order_cancel = function(id, unconfirm, unredirect)
    {
      if(unconfirm != true){
        if($('#order_cancel_confirm').length){
          $('#order_cancel_confirm').modal('show');
        }else{
          if(confirm('Отменить заявку?')){
            VR.order_cancel(id, true);
          }
        }
        return false;
      }

      if(!id){
        return window.location.href = "/en/";
      }
      VR.ajaxLoader(true);
      return Query({action: "order-cancel", id: id}, function(){
        LSSet("c1", null);
        LSSet("c2", null);
        LSSet("s1", null);
        LSSet("s2", null);
        LSSet("d", 0);
        if(unredirect !== true){
          window.location.href = "/en/";
        }
      });
    };

    VR.showMSG2 = function (msg, title){
      VR.showMSG('<div class="text-center">'+msg+'</div>', title);
    }

// клик назад
    addEventListener("popstate",function(e){
      location.reload();
    },false);

    //tooltip
    if($('.tooltip-input').length){
      $('.tooltip-input').on('keyup', function() {
        var checkingRegExp = new RegExp("^@[A-Za-z0-9_]{3,}$");
        if($(this).val().match(checkingRegExp)) {
          $('.tooltip-item').addClass('open');
        } else {
          $('.tooltip-item').removeClass('open');
        }
      });
    }

    // уведомление с возможностью сокрытия
    if($(".rashalert").length){
      $(".rashalert .rashclose").on("click", function(){
        var aid = $(this).attr('data-id');
        Query({ action: "extra_action", data: {subaction: "AlertSite", set_hide_id: aid}}, function(){},{url: '/en/cms/'});
        $(this).parents(".rashalert").slideUp(300, function(){ $(this).remove(); });
      });
    }


    $(window).on("scroll", function() {
      if ($(window).scrollTop() > $(window).height() && $(window).scrollTop() > 1000) $("#gotop").fadeIn(300);
      else  $("#gotop").fadeOut(200);
    });


    $("a[href='#chat']").on("click",function(){
      if(typeof jivo_api != "undefined"){
        jivo_api.open();
      }else{
        window.location = "/en/contacts/";
      }
      return false;
    });


    if($('#cancel-f2a').length){
      $('#cancel-f2a').on('click', function(){
        let rf = VR.readForm('#loginform');
        rf.action = 'reset_f2a';
        return Query(rf, function(data){
          $('.showerror').html('<div class="alert alert-'+(data.status == 'error' ? 'danger' : 'success')+'">'+data.msg+'</div>');
        },{url: '/'});
      });
    }

    $("#gotop").on("click", function(){
      $('html, body').animate({ scrollTop: 0}, 500);
      return false;
    });

    let from_fio_err = 0;
    $('#props [name="from_fio"]').on('input focus', function(event) {
      if ($(this).val().indexOf(',') >= 0 || $(this).val().indexOf('.') >= 0) {
        if (!from_fio_err) {
          VR.ElError( "#props [name='from_fio']" , $(".home-change__form #props").attr('data-for-fio') );
          from_fio_err = 1;
        }
      }else{
        from_fio_err = 0;
        $('#props [name="from_fio"]').siblings('.error-message').remove();
      }
    });

    $(window).on('click', function(e) {
      if(!e.target.closest('.btn-change-language') && !e.target.closest('.lang-menu__window')) {
        $('.drop-mob-lang, .lang-menu').removeClass('show');
      } else if(e.target.closest('.lang-close')) {
        $('.drop-mob-lang, .lang-menu').removeClass('show');
      }
    });
    $(window).on('click', function(e) {
      if(!e.target.closest("#manin-menu") && !e.target.closest(".btn-menu")) {
        $('#manin-menu').removeClass('show');
      }
    });
    $(window).on('click', function(e) {
      if(!e.target.closest(".header__login-menu") && !e.target.closest(".acc-menu")) {
        $('.header__login-menu').removeClass('show');
        $('body').removeClass('overlay');

      }
    });

    try {
      let ctx = $('#props [name="email"]');
      ctx .attr('title', $(".home-change__form #props").attr('data-for-email'))
        .attr('data-toggle', 'tooltip')
        .attr('data-placement', 'top')
        .tooltip();
    } catch (e){
      console.log(e);
    }

    $('#input-login').on('change paste keyup', function(e) {
      firstValue = $(this).val();
      if (firstValue[0] === '@' && firstValue[1] !== '@') {
        $('.form-group-pass-wrapper').hide(400);
      }else{
        $('.form-group-pass-wrapper').show(400);
      }
    });

    $('body').on('submit', '#coForm', function(){
      Query(VR.readForm('#coForm'), function(data){
        VR.showMSG(data.msg, "Status");
      }, {url: '/'})
      return false;
    })
  }

  let waitVR = function(){'VR' in window ? fn() : window.setTimeout(waitVR, 100);};
  waitVR();
})();

(function () {
  let fn = function(){
/**/
    let ws = VR.aGet('websocket'),
    _try = 0,
    subscriptions = [],
    wss_callbacks = [],
    wss_send_queue = [],
    subscribeTimer = 0

    VR.wsDefaultErrorHandler = function(data){
      console.log(data);
      VR.showMSG(data.msg);
    }

    let wsInit = function(first) {
      try {
        if (_try > 5) {
          VR.aDel('websocket')
          msg = 'Failed to connect to server.'
          return 'toastr' in VR ? VR.toastr(msg, '', 'error', 60000) : console.log(msg)
        }
        else if(_try > 0) {
          msg = 'Connect to server. Attempt ' + _try + ' / 5'
          'toastr' in VR ? VR.toastr(msg, '', 'warning', 100) : console.log(msg)
        }

        _try++

        ws = new WebSocket(VR.aGet('wsurl'))

        ws.onopen = function () {
          VR.aSet('websocket', ws)

          _try = 0

          ws.send('{"wsgid":"' + VR.aGet('wsgid') + '"'+ (first === true ? ',"unsubscribe":"all"' : '') +'}')

          if(subscriptions.length){
            ws.send('{"subscribe":"'+ subscriptions.join(',') +'"}')
          }
          if (wss_send_queue.length)
            for(i in wss_send_queue)
            {
              ws.send(wss_send_queue[i])
              wss_send_queue.splice(i, 1)
            }
        }

        ws.onmessage = function(e) {
          var o = JSON.parse(e.data)
          if(o && 'pushHandler' in o && o.pushHandler in VR){
            VR[ o.pushHandler ](o.pushHandler === 'wsDefaultErrorHandler' ? o : o.value)
          }
          if('callback_id' in o)
            wss_callbacks[o.callback_id](o.result)
        }

        ws.onclose = function () {
          'toastr' in VR ? VR.toastr('Disconnected.', '', 'error', 5000) : console.log('Disconnected')
          window.setTimeout(wsInit, 5000)
        }
      }
      catch (e) {
        window.setTimeout(wsInit, 5000)
      }
    };

    VR.setChangesHandler('initial', function (data)
    {
      if (!ws && 'initial' in data && typeof data.initial === 'object' && 'wshash' in data.initial) {

        const protcol = window.location.protocol == 'https:' ? 'wss' : 'ws';
        VR.aSet('wsgid', data.initial.wsgid)
        VR.aSet('wsurl', protcol + '://' + window.location.host + '/ws/?hash=' + data.initial.wshash)

        wsInit(true)
      }
    });

    VR.subscriptions = function(){
      let ws = VR.aGet('websocket')
      ws ? ws.send('{"subscriptions":1}') : false
    };

    VR.subscribeToChannel = function(channel)
    {
      if (!VR.in_array(channel, subscriptions)){
        subscriptions.push(channel)
      }

      if (!VR.aGet('websocket')){
        return
      }

      if (subscribeTimer){
        clearTimeout(subscribeTimer)
      }

      subscribeTimer = setTimeout(() => {
        VR.aGet('websocket').send('{"subscribe":"'+subscriptions.join(',')+'"}')
      }, 500)
    };


    /**
     * @param channel
     * @deprecated
     * @returns {*|void}
     */
    VR.subscribeToChanel = function(channel){ return VR.subscribeToChannel(channel) };


    VR.wsSend = function(data, cbname, cbfn, chanel, callback){
      cbname && cbfn ? VR.wsResultHandler(cbname, cbfn) : null

      !('data' in data) || typeof data.data !== 'object' ? data.data = {} : null
      cbname ? data.data.wshandler = 'callback__'+cbname : null
      chanel ? data.data.wschanel = chanel : null

      if (callback)
      {
        data.callback_id = new Date().valueOf().toString(16)
        wss_callbacks[data.callback_id] = callback
      }

      VR.aGet('websocket')
        ? VR.aGet('websocket').send(JSON.stringify(data))
        : wss_send_queue.push(JSON.stringify(data))
    };

    /**
     * Объявить обработчик результата ответа ws сервера
     * @param name
     * @param hnd
     * @returns {boolean}
     */
    VR.wsResultHandler = function(name, hnd){
      let k = 'callback__' + name

      if(k in VR) {
        console.log('Duplicate handler for ws result:', name)
      }
      else {
        VR[k] = function(o){
          let cb = VR.aGet('hnd__'+name)

          switch(o.status){
            case 'success': break
            case 'error':   return VR.showMSG(o.msg)
            default:        return VR.showMSG(o)
          }

          return cb && typeof cb === 'function' ? cb(o) : false
        }
      }

      return VR.aSet('hnd__'+name, typeof hnd === 'function' ? hnd : null)
    };
/**/
  };

  let waitVR = function(){'VR' in window ? fn() : window.setTimeout(waitVR, 100);};
  waitVR();
})();

  VR.freezeButton = function(ctx, seconds, callback)
  {
    ctx = $(ctx)

    if(!ctx.length || ctx.hasClass("wait")){
      return true
    }

    let tag = (ctx.get(0).tagName).toUpperCase()
    let time = parseInt(seconds)
    time = isNaN(time) ? 1: time * 20

    ctx.addClass("wait")
    ctx.attr("data-countdown", time)

    switch( tag ){
      case "INPUT":
        ctx.attr("data-store", ctx.val());
        ctx.val(ctx.attr("data-wait")+' '+time+'...');
        break;
      case "A":
      case "BUTTON":
        ctx.attr("data-store", ctx.text());
        ctx.text(ctx.attr("data-wait")+' '+time+'...');
        break;
    }

    VR.aSet("gpWait", window.setInterval(function()
    {
      let c = parseInt(ctx.attr("data-countdown"))

      if(isNaN(c) || c <= 1 ){
        window.clearInterval(VR.aGet("gpWait"))
        VR.aSet("gpWait", null)
        ctx.removeClass("wait")

        switch( tag ){
          case "INPUT":
            ctx.val( ctx.attr("data-store") )
            break

          case "A":
          case "BUTTON":
            ctx.text( ctx.attr("data-store") )
            break
        }

        ctx.attr("disabled", false)

        if(callback && typeof callback === 'function'){
          callback()
        }
        return null
      }

      c--
      let str = ctx.attr("data-wait")
      !str ? str = 'wait' : false

      switch( tag ){
        case "INPUT":
          ctx.val( str+' '+(c < 10 ? '0'+c : c)+'...' )
          break

        case "A":
        case "BUTTON":
          ctx.text( str+' '+(c < 10 ? '0'+c : c)+'...' )
          break
      }

      ctx.attr("data-countdown", c)
      ctx.attr("disabled", true)
    },50));

    return false
  };


  VR.unfreezeButton = function(ctx){
    $(ctx).attr("data-countdown", 0)
  };

(function(){
  let fn = function(){
    VR.setChangesHandler('prepare_changes', function (data) {
      if ('System' in data) {
        switch (VR.location_dir()) {
          case '':
            if (parseInt(data.System.sleepmode) === 0 && parseInt(data.System.techbreak) !== 1 && parseInt(VR.aGet("sleepmode")) === 1) {
              window.location.href = '/en/';
            } else if (parseInt(data.System.techbreak) === 0 && parseInt(data.System.sleepmode) !== 1 && parseInt(VR.aGet("techbreak")) === 1) {
              window.location.href = '/en/';
            } else if (parseInt(data.System.sleepmode) === 1) {
              if (VR.location_dir() !== 'sleepmode' && parseInt(data.System.redirect.sleepmode) === 1 && parseInt(VR.aGet("sleepmode")) !== 1) {
                VR.aSet("sleepmode", 1);
                VR.setChangesArgument("get_sleepmode_text", 1);
              }
            } else if (parseInt(data.System.techbreak) === 1) {
              if (VR.location_dir() !== 'techbreak' && parseInt(data.System.redirect.techbreak) === 1 && parseInt(VR.aGet("techbreak")) !== 1) {
                VR.aSet("techbreak", 1);
                VR.setChangesArgument("get_techbreak_text", 1);
              }
            }
            break;
        }
      }

      //    //-- Резервы для направлений
      if ('Reserve' in data) {
        VR.aSet('Reserve', data.Reserve);
      }

      //-- Валюты направлений
      if ('PSV' in data) {
        VR.aSet('PSV', data.PSV);
      }

      //-- Короткие названия валют
      if ('valutes_shortname' in data) {
        VR.aSet('valutes_shortname', data.valutes_shortname);
      }

      //-- BC Индексы направлений
      if ('BCI' in data) {
        VR.aSet('BCI', data.BCI);
      }

      //-- Точность
      if ('Precision' in data) {
        VR.aSet('Precision', data.Precision);
      }

    })
  };

  let waitVR = function(){'VR' in window ? fn() : window.setTimeout(waitVR, 100);};
  waitVR();
})();

  
(function() {
  VR.setChangesHandler('000000ff', function(data){
    if('client_dump' in data && parseInt(VR.aGet('fset')) !== 1){
      VR.aSet('fset', 1)

      $.getScript('/res/default/js/fingerprint2.js', function(){
        var fp = new Fingerprint2();
        fp.get(function(result, components) {
          VR.setChangesArgument('client_dump', result + ';' + components[6]['value'].toString())
        })
      })
    }
    else {
      VR.delChangesArgument('client_dump')
    }
  });
  VR.reload_page = ({where}) => {
    if (window.location.href.indexOf(where) !== -1)
      window.location.href = window.location.href;
  };
})();

(() => {
  if(!('select2' in VR)){
    VR.select2 = function(c, o)
    {
      let elem, opt = {}, s, select;

      o = typeof o === 'object' ? o : {};

      switch(typeof c){
        case 'string': elem = VR.in_array(c, ["window", "body"]) ? $("body").get(0) : ($(c).length ? $(c).get(0) : null);break;
        case 'object': elem = c; break;
      }

      if(!elem) {
        console.warn("select2(): Context should be a CSS selector or an existing DOM element for: ", c);
        return false;
      }

      //-- templateResult
      if('templateResult' in o){
        opt.templateResult = o.templateResult;
        delete(o.templateResult);
      }

      //-- matcher
      if('matcher' in o) {
        opt.matcher = o.matcher;
        delete(o.matcher);
      }
      else {
        opt.matcher = function(params, data) {
          let el = data.element,
            s = ($.trim(params.term)).toLowerCase();

          if (s === '') {
            return data;
          }

          if (!el.hasAttribute('data-img')) {
            return ($(el).text()).toLowerCase().indexOf(s) > -1 ? data : null;
          }

          return ($(el).attr('data-name')).toLowerCase().indexOf(s) > -1 ? data : null;
        };
      }

      //-- templateSelection
      if('templateSelection' in o) {
        opt.templateSelection = o.templateSelection;
        delete(o.templateSelection);
      }
      else {
        opt.templateSelection = function(option) {
          var el = option.element;
          return !el || !el.hasAttribute('data-img') ? option.text : '<img src="' + $(el).attr('data-img') + '" alt="" /> ' + $(el).attr('data-name');
        };
      }

      //-- escapeMarkup
      if('escapeMarkup' in o) {
        opt.escapeMarkup = o.escapeMarkup;
        delete(o.templateSelection);
      }
      else {
        opt.escapeMarkup = function (m) {
          return m;
        };
      }

      //-- select
      if('select' in o) {
        select = o.select;
        delete(o.select);
      }

      for(let k in o){
        opt[k] = o[k];
      }

      s = $(c).select2(opt);

      select ? $(c).on('select2:select', select) : false;

      return s
    }
  }
})();


(function(){
  let fn = function()
  {
    VR.aSet("processQueryResult", VR.exbPQR);

    if(!('exbPQR' in VR)){
      /**
       * Переопределяем обработчик запросов на сервер
       */
      VR.exbPQR = function(msg, file, method, line, onerror){
        console.log("Error! "+file+'::'+method+'['+line+']', msg);
        VR.showMSG(msg, null, null, onerror);
      };
    }


    if(!('showMSG' in VR)){
      VR.showMSG = function(msg, title, btnname, callback)
      {
        let em = $("#errorModal");

        if( !em.length ){
          //-- Список callback функций для вызова после закрытия окна
          VR.aSet("errorModalCallbacks", []);
          $("body").append(
            '<div class="modal fade" id="errorModal" tabindex="9999" data-backdrop="static" role="dialog" aria-hidden="true">'+
            '<div class="modal-dialog">'+
            '<div class="modal-content">'+
            '<div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
            '<h4 id="errorModalLabel" class="modal-title">Error</h4>'+
            '</div>'+
            '<div class="modal-body"></div>'+
            '<div class="modal-footer">'+
            '<button type="button" id="errorModalBtn" class="btn btn-default" data-dismiss="modal">Close</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'
          );

          $("#errorModalBtn").click(function(){
            VR.aSet("errorModalCloseStatus", 1);
          });

          em = $('#errorModal');

          em.on('show.bs.modal', function (e) {
            window.setTimeout(function(){
              let bdy = $('body');
              if(bdy.length && !bdy.hasClass('modal-open')){
                bdy.addClass('modal-open');
              }
            }, 700);
          });

          em.on('hidden.bs.modal', function (e) {
            if(VR.aGet("errorModalCloseStatus") === 1){
              while( ( VR.aGet("errorModalCallbacks") ).length ){
                var fn = ( VR.aGet("errorModalCallbacks") ).pop();
                fn();
              }
            }
            VR.aSet("errorModalCallbacks", []);
          });
        } else {
          let cb = VR.aGet("errorModalCallbacks");
          if(!cb){
            VR.aSet("errorModalCallbacks", []);
          }
        }

        VR.aSet("errorModalCloseStatus", 0);

        if(callback && typeof callback === 'function') {
          ( VR.aGet("errorModalCallbacks") ).push( callback );
        }

        if(msg){
          $("#errorModalLabel").html(title || 'Error');
          $("#errorModal .modal-body").html(msg);
          $("#errorModal .btn-default").text(btnname || 'Close');
          $('#errorModal').modal('show');
          return true;
        }

        em.modal('hide');

        return false;
      };
    }
  }

  let waitVR = function(){'VR' in window ? fn() : window.setTimeout(waitVR, 100);};
  waitVR();
})();

 VR.isEngineLoaded();