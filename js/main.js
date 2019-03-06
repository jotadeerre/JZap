var MemoryStore = function(successCallback, errorCallback) {
  this.find = function(callback, what = null) {
    let ret;
    if(what == null) {  ret = this.streams; }
    else if (Number.isInteger(what)) { ret = this.streams[what]; }
    else {
      ret = this.streams.filter(function(element) {
          return element.name.toLowerCase().indexOf(what.toLowerCase()) > -1;
      });
    }
    callLater(callback, ret);
  }
  var callLater = function(callback, data) {
    // Used to simulate async calls. This is done to provide a consistent interface with stores (like WebSqlStore)
    // that use async data access APIs
    if (callback) { setTimeout(function() { callback(data); }); }
  }
  this.streams = [
    {"id":"1", "country":"UK", "media":"audio", "name":"BBC Radio 1", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p", },
    {"id":"2", "country":"UK", "media":"audio", "name":"BBC Radio 1xtra", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1xtra_mf_p", },
    {"id":"3", "country":"UK", "media":"audio", "name":"BBC Radio 2", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio2_mf_p", },
    {"id":"4", "country":"UK", "media":"audio", "name":"BBC Radio 3", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio3_mf_p", },
    {"id":"5", "country":"UK", "media":"audio", "name":"BBC Radio 4FM", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio4fm_mf_p", },
    {"id":"6", "country":"UK", "media":"audio", "name":"BBC Radio 4LW", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio4lw_mf_p", },
    {"id":"7", "country":"UK", "media":"audio", "name":"BBC Radio 4 Extra", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio4extra_mf_p", },
    {"id":"8", "country":"UK", "media":"audio", "name":"BBC Radio 5 Live", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio5live_mf_p", },
    {"id":"9", "country":"UK", "media":"audio", "name":"BBC Radio 5 Live Sportsball Extra", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio5extra_mf_p", },
    {"id":"10", "country":"UK", "media":"audio", "name":"BBC Radio 6 Music", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_6music_mf_p", },
    {"id":"11", "country":"UK", "media":"audio", "name":"BBC Asian Network", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_asianet_mf_p", },
    {"id":"12", "country":"UK", "media":"audio", "name":"BBC World Service UK stream", "url":"http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-eieuk", },
    {"id":"13", "country":"UK", "media":"audio", "name":"BBC World Service News stream", "url":"http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-einws", },
    {"id":"14", "country":"UK", "media":"audio", "name":"BBC Radio London", "url":"http://bbcmedia.ic.llnwd.net/stream/bbcmedia_lrldn_mf_p", },
    {"id":"15", "country":"UK", "media":"audio", "name":"NSB Radio", "url":"http://live.nsbradio.co.uk:8904/;", },
    {"id":"16", "country":"UK", "media":"audio", "name":"House FM", "url":"https://streamer.radio.co/s0de514535/listen", },
    {"id":"17", "country":"ES", "media":"video", "name":"TVE1", "url":"http://www.rtve.es/directo/la-1/", },
    {"id":"18", "country":"ES", "media":"video", "name":"TVE2", "url":"http://www.rtve.es/directo/la-2/", },
    {"id":"19", "country":"ES", "media":"video", "name":"TVE Teledeporte", "url":"http://www.rtve.es/directo/teledeporte/", },
    {"id":"20", "country":"ES", "media":"video", "name":"TVE Canal 24", "url":"http://www.rtve.es/directo/canal-24h/", },
    {"id":"21", "country":"ES", "media":"video", "name":"TVE Mas24", "url":"http://www.rtve.es/mas24/", },
    {"id":"22", "country":"ES", "media":"video", "name":"TVE Mas TDP", "url":"http://www.rtve.es/deportes/mas-tdp/directo/", },
    {"id":"23", "country":"ES", "media":"video", "name":"TVE Catalunya", "url":"http://www.rtve.es/television/catalunya/directo/", },
  ];
  callLater(successCallback);
}
var HomeView = function(store) {
  this.render = function() {
    this.el.html(HomeView.template());
    this.find();
    return this;
  };
  this.find = function() {
    //var what = $('.search-key').val().length == 0 ? null : $('.search-key').val().length;
    var what = $('.search-key').val() || null;
    store.find(function(streams){
      $('.stream-list').html(HomeView.liTemplate(streams));
    }, what);
  };
  this.initialize = function() {
    this.el = $('<div/>');
    this.el.on('keyup', '.search-key', this.find);
  };
  this.initialize();
}

// Static members
HomeView.template = Handlebars.compile($("#home-tpl").html());
HomeView.liTemplate = Handlebars.compile($("#stream-li-tpl").html());
HomeView.detTemplate = Handlebars.compile($("#stream-tpl").html());

var app = {
    registerEvents: function() { var self = this;
        if (document.documentElement.hasOwnProperty('ontouchstart')) { // Check of browser supports touch events...
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('body').on('touchstart', 'a', function(event) {$(event.target).addClass('tappable-active');});
            $('body').on('touchend', 'a', function(event) {$(event.target).removeClass('tappable-active');});
        }
        else { // ... if not: register mouse events instead
            $('body').on('mousedown', 'a', function(event) {$(event.target).addClass('tappable-active');});
            $('body').on('mouseup', 'a', function(event) {$(event.target).removeClass('tappable-active');});
        }
        
        $(window).on('hashchange', $.proxy(this.route, this));
    },
    route: function() { var self = this;
        var hash = window.location.hash;
        var match = hash.match(this.detailsURL);
        if (!this.homepage) {
          this.homePage = new HomeView(this.store).render();
          this.homePage.el.attr("class","page");
          $('body').append(this.homePage.el);
        }
        if (match) {
            this.store.find(function(stream) {
              $('.stream-detail').html(HomeView.detTemplate(stream));
            },Number(match[1]));
        }
    },
    initialize: function() { var self = this;
      this.detailsURL = /^#streams\/(\d{1,})/;
      this.registerEvents();
      this.store = new MemoryStore(function() { self.route(); });
    }
};
app.initialize();
