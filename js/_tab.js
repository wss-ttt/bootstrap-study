/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

;+(function ($) {
  'use strict'

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150 //过渡时间css3的transition
  //tab原型show函数
  Tab.prototype.show = function () {
    var $this = this.element
    var $ul = $this.closest('ul:not(.dropdown-menu)') //closest() 方法获得匹配选择器的第一个祖先元素，从当前元素开始沿 DOM 树向上。
    var selector = $this.data('target') //data() 方法向被选元素附加数据，或者从被选元素获取数据。

    if (!selector) {
      //如果selector没有数据
      selector = $this.attr('href') //attr() 方法设置或返回被选元素的属性值，返回href地址
      //正则替换部分：任意个.不对#号记录，以任意非空白字符结束。使用空字符串替换.#号前面字符
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }
    //如果当前li已经触发，返回
    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a') //选择最后active的后代元素 a
    // console.log('$previous', $previous)
    // console.log('a', $previous.html())
    console.log('aa')
    //jQuery.Event 构造器暴露出来，然后通过$.trigger来触发hide.bs.tab事件
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })
    //trigger在每一个匹配的元素上触发hideEvent自定义事件
    $previous.trigger(hideEvent)
    $this.trigger(showEvent)
    //isDefaultPrevented()根据事件对象中是否调用过 event.preventDefault() 方法来返回一个布尔值。
    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)
    //传参进入原型activate函数，实现隐藏显示效果
    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find('> .active') //container后代active元素
    var transition =
      callback &&
      $.support.transition && //jQuery.support 属性包含表示不同浏览器特性或漏洞的属性集。
      (($active.length && $active.hasClass('fade')) ||
        !!container.find('> .fade').length)
    //下一个
    function next() {
      $active
        .removeClass('active') //移除active类
        .find('> .dropdown-menu > .active') //选择后代dropdown-menu的后代active元素
        .removeClass('active') //移除active类
        .end() //主要是在利用 jQuery 的链条属性（命令链）通过 end()，我们可以把所有方法调用串联在一起 恢复选择上一级元素
        .find('[data-toggle="tab"]') //在.find('> .dropdown-menu > .active')上找到data-toggle="tab"属性的元素
        .attr('aria-expanded', false) //无障碍阅读设置为false

      element
        .addClass('active') //在传入元素上增加active类
        .find('[data-toggle="tab"]') //选择data-toggle="tab"属性的元素
        .attr('aria-expanded', true) //设置无障碍阅读为true
      //如果transition存在
      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in') //增加in类
      } else {
        element.removeClass('fade') //移除fade类
      }
      //若传入元素的父级dropdown-menu存在
      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown') //closest() 方法获得匹配选择器的第一个祖先元素，从当前元素开始沿 DOM 树向上。
          .addClass('active') //增加active类
          .end() //主要是在利用 jQuery 的链条属性（命令链）通过 end()，我们可以把所有方法调用串联在一起 恢复选择上一级元素
          .find('[data-toggle="tab"]') //选择data-toggle="tab"属性元素
          .attr('aria-expanded', true) //无障碍阅读属性 true
      }

      callback && callback() //若callback为true，则把callback当做函数执行;类似于if(callback){callback()}
    }
    //若 $active和transition都为true，则执行$active
    $active.length && transition
      ? $active
          .one('bsTransitionEnd', next) //将next()绑定到bsTransitionEnd事件上
          .emulateTransitionEnd(Tab.TRANSITION_DURATION)
      : next()

    $active.removeClass('in')
  }

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    // 闭包  将option值提前植入进来
    return this.each(function () {
      //加each是jquery插件的标配，意为选中多个dom时挨个处理
      var $this = $(this)
      var data = $this.data('bs.tab') //先取一下bs.tab   这一步是为了缓存Tab对象的，这是必须的，不可能点击一下tab就new Tab(this)，
      if (!data) {
        $this.data('bs.tab', (data = new Tab(this))) //如果没有data，那么将点击的a标签传入tab,然后把Tab对象赋值给data
      }
      if (typeof option == 'string') data[option]() //如果传入的是字符串，则执行相应的方法
    })
  }

  var old = $.fn.tab

  $.fn.tab = Plugin
  $.fn.tab.Constructor = Tab

  // TAB NO CONFLICT
  // ===============
  //防冲突代码，为了规范，应该加上
  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }

  // TAB DATA-API
  // ============
  // TAB DATA-API   自动给你初始化了，这样就可以不用写js代码了
  var clickHandler = function (e) {
    e.preventDefault() //阻止事件冒泡
    Plugin.call($(this), 'show')
  }

  /* $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler) */ //pill这个是给胶囊导航用的，其实tab和pill原理都一样，只是名字不一样而已

   // test
  /* $(document).on('click', function() {
    console.log('好好学习')
  }) */
  /* $(document).on('click', '[data-toggle="tab"]', function() {
    console.log('好好学习')
  }) */
  // 使用了属性选择器
  $(document).on('click', '[data-toggle="tab"]', clickHandler)
})(jQuery)
