;+(function ($) {
  'use strict'

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // 添加实例属性element
    this.element = $(element)
  }
  // 添加静态属性
  Tab.VERSION = '3.3.7'

  //tab原型show函数
  Tab.prototype.show = function () {
    // 获取当前点击的元素 该元素为li下面的a元素
    var $this = this.element
    var $ul = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')
    // 如果通过target属性，没有获取到值，就获取href值
    if (!selector) {
      selector = $this.attr('href') // 获取href属性，后面需要通过href值来获取tab-pane元素
      //正则替换部分：任意个.不对#号记录，以任意非空白字符结束。使用空字符串替换.#号前面字符
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }
    //如果当前li已经触发，返回
    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a') //选择最后active的后代元素 a

    // 获取目标tab-pane元素
    var $target = $(selector)
    // tab的显示和隐藏
    this.activate($this.closest('li'), $ul)
    // tab-pane的显示和隐藏
    this.activate($target, $target.parent())
  }

  Tab.prototype.activate = function (element, container, callback) {
    // 这个$active是li标签(不是里面的a标签)
    var $active = container.find('> .active') //container后代active元素
    $active.length && next()
    // 封装next方法
    function next() {
      $active.removeClass('active')

      element.addClass('active')

      callback && callback()
    }
  }

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    // 闭包  将option值提前植入进来
    return this.each(function () {
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
  var clickHandler = function (e) {
    e.preventDefault() //阻止事件冒泡
    Plugin.call($(this), 'show')
  }

  /* $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler) */

  // 使用了属性选择器
  $(document).on('click', '[data-toggle="tab"]', clickHandler)
})(jQuery)
