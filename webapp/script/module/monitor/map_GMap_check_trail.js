/**
 * Item Name  : 
 *Creator         :cc
 *Email            :cc
 *Created Date:2017.1.16
 *@pararm     :
 */
(function($, window) {

  function Check_trail(opts) {
    // 地图容器标识
    this.id = opts.id;
    this.sn = '';
    this.data1 = $('#check_ipt1');
    this.data2 = $('#check_ipt2');
    // 地图的收集
    this.map = null;

    this.time1 = '';
    this.time2 = '';

    this.partTime1 = '';
    this.partTime2 = '';

    // 所有点的收集
    this.pos_arr = [];
    // 收集折线
    this.line = null;
  };
  Check_trail.prototype = {
    // 入口函数
    init: function() {
      var me = this;
      // 初始控件和地图
      me.init_mapBaner()
        // 初始化事件
      me.init_event();
    },
    // -----------------------------------------组件初始
    //控件默认初始化
    init_mapBaner: function() {
      var me = this;
      me.map = new google.maps.Map($('#' + me.id)[0], {
        center: {
          lat: 39.920026,
          lng: 116.403694
        },
        zoom: 11,
        // 地图类型控件
        mapTypeControl: true,
        mapTypeControlOptions: {
          // 展示的形式
          // style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          // 要地图类型的控件
          mapTypeIds: [
            google.maps.MapTypeId.ROADMAP,
            google.maps.MapTypeId.TERRAIN,
            // google.maps.MapTypeId.SATELLITE,
            google.maps.MapTypeId.HYBRID
          ],
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        // 缩放控件
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,

        // 全景模式开启
        streetViewControl: false,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      });
    },
    //控件自定义初始化
    init_setBaner: function() {
      var me = this;
    },
    init_event: function() {
      var me = this;
      //日期插件渲染
      me.date_init();
      // 查询按钮的事件
      me.btn_event();
    },
    //日期插件渲染
    date_init: function() {
      var me = this;

      var start = {
        elem: '#check_ipt1', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD hh:mm:ss', //日期格式
        istime: true, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: false, //是否显示今天
        issure: true, //是否显示确认
        festival: true, //是否显示节日
        // min: '1900-01-01 00:00:00', //最小日期
        // max: '2099-12-31 23:59:59', //最大日期
        max: laydate.now(), //设定最大日期为当前日期
        //start: '2014-6-15 23:00:00',  //开始日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function(dates) { //选择好日期的回调
          var time = dates.replace(new RegExp("-", "gm"), "/");
          // console.log(dates);
          var time_hm = (new Date(time)).getTime(); //得到毫秒数

          me.time1 = time_hm;
          end.min = dates; //开始日选好后，重置结束日的最小日期
          end.start = dates //将结束日的初始值设定为开始日
        }
      }
      var end = {
        elem: '#check_ipt2', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD hh:mm:ss', //日期格式
        istime: true, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: false, //是否显示今天
        issure: true, //是否显示确认
        festival: true, //是否显示节日
        // min: '1900-01-01 00:00:00', //最小日期 max: '2099-12-31 23:59:59', //最大日期 
        //start: '2014-6-15 23:00:00',  //开始日期
        max: laydate.now(), //设定最大日期为当前日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function(dates) { //选择好日期的回调
          var time = dates.replace(new RegExp("-", "gm"), "/");
          var time_hm = (new Date(time)).getTime(); //得到毫秒数

          me.time2 = time_hm;
          start.max = dates; //结束日选好后，重置开始日的最大日期
        }
      };
      $('#check_ipt1').click(function() {
        laydate(start);
      });
      $('#check_ipt2').click(function() {
        laydate(end);
      });
    },
    //查询按钮事件
    btn_event: function() {
      var me = this;
      var btn = $('#check_btn');

      btn.click(function() {
        if (me.data1.val() == '') {
          layer.msg('请选择起始时间！', { icon: 2, time: 2000 });
          return;
        };
        if (me.data2.val() == '') {
          layer.msg('请选择结束时间！', { icon: 2, time: 2000 });
          return;
        };
        var opts = {
          device_sn: me.sn,
          begin: me.time1,
          end: me.time2,
        };
        // 请求数据
        me.trail_ajax(opts);
      });
    },
    //请求回人车的数据渲染为列表
    trail_ajax: function(opts) {
      var me = this;
      $('#trailInfo_show').html('');
      var trackArr = [
        { start: 1483284545415, end: 1483865656562, distance: 12, unit: 'km' },
        { start: 1483286123456, end: 1483894578545, distance: 0.8, unit: 'km' }
      ];
      if (trackArr.length == 0) {
        layer.msg('该日期无轨迹信息，请重新查询！', { icon: 2, time: 2000 });
        return;
      }
      for (var i = 0; i < trackArr.length; i++) {
        $('#trailInfo_show').append(
          '<p class="info_p"  t1="' + trackArr[i].start + '" t2="' + trackArr[i].end + '">' +
          '<span>轨迹' + (i + 1) + '</span>' +
          // '<span>位置：</span><span>' + (trackArr[i].placeType == 1 ? '室外' : '室内') + '</span>' +
          '<span>起始时间：</span><span>' + cLib.base.formatterDateDay(trackArr[i].start) + '</span>' +
          '<span>截止时间：</span><span>' + cLib.base.formatterDateDay(trackArr[i].end) + '</span>' +
          '<span>轨迹长度：</span><span>' + trackArr[i].distance + trackArr[i].unit + '</span>' +
          '</p>'
        )
      };
      me.info_p_event();
    },
    //列表信息点击事件
    info_p_event: function() {
      var me = this;
      var info_p = $('.info_p');
      for (var i = 0; i < info_p.length; i++) {
        info_p[i].onclick = function() {
          // 当前点击对象
          me.partTime1 = $(this).attr('t1');
          me.partTime2 = $(this).attr('t2');

          var opts = {
            device_sn: me.sn,
            // part: me.type,
            begin: me.partTime1,
            end: me.partTime2
          };
          me.p_ajax(opts);
        };
      }
    },
    //每条记录的轨迹请求
    p_ajax: function(opts) {
      var me = this;
      // 出清地图的线
      if (me.line != null) {
        me.line.setMap(null);
        me.line = null;
      };
      // 重置点容器
      me.pos_arr = [];

      var data = {
        track: [{ lng: 116.4541 + (Math.random() * 0.01), lat: 39.9151 },
          { lng: 116.5245 + (Math.random() * 0.01), lat: 39.4589 },
          { lng: 116.8958 + (Math.random() * 0.01), lat: 39.4852 },
          { lng: 116.4989 + (Math.random() * 0.01), lat: 39.2356 },
          { lng: 116.3778 + (Math.random() * 0.01), lat: 39.7845 },
          { lng: 116.7445 + (Math.random() * 0.01), lat: 39.5689 },
          { lng: 116.1289 + (Math.random() * 0.01), lat: 39.8452 },
        ]
      };
      me.out_trail(data.track);

    },
    // ------------------------------------------------------------------室外轨迹
    //打轨迹
    out_trail: function(arr) {
      var me = this;
      var Point = null;
      for (var i = 0; i < arr.length; i++) {
        Point = new google.maps.LatLng(arr[i].lat, arr[i].lng);
        me.pos_arr.push(Point);
      }
      //最佳显示
      me.m_setVeiwPort(me.pos_arr);
      //打点形成轨迹
      me.line = me.addPolyLine(me.pos_arr);
      console.log(me.line);
    },
    addPolyLine: function(arr) {
      // body... 
      var me = this;
      var flightPath = new google.maps.Polyline({
        path: arr,
        geodesic: true,
        strokeColor: '#21536d',
        strokeOpacity: 0.8,
        strokeWeight: 2
      });
      flightPath.setMap(me.map);
      return flightPath;
    },
    // ---------------------------------------------------------公用函数
    // 设置最优视角
    m_setVeiwPort: function(arr) {
      /* body... */
      var me = this;
      var bounds = new google.maps.LatLngBounds();
      //读取标注点的位置坐标，加入LatLngBounds  
      for (var i = 0; i < arr.length; i++) {
        bounds.extend(arr[i]);
      }
      //调整map，使其适应LatLngBounds,实现展示最佳视野的功能
      me.map.fitBounds(bounds);
    },
  };
  window["Check_trail"] = Check_trail;
})(jQuery, window);
