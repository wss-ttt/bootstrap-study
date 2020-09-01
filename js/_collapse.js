;+(function ($) {
  'use strict'

  // 构造函数
  var Collapse = function (element, options) {
    this.$el = $(element) // 这里包装成了jQuery实例对象
    // 合并参数
    this.options = $.extend({}, options, Collapse.DEFAULTS)
  }
  // 默认配置
  Collapse.DEFAULTS = {
    toggle: true
  }
  // 切换(调用show和hide方法)
  Collapse.prototype.toggle = function() {
    if(this.$el.hasClass('in')) {
      // 执行hide方法
      this.hide()
    } else {
      // 执行show方法
      this.show()
    }
  }
  // 显示
  Collapse.prototype.show = function() {

  }
  // 隐藏
  Collapse.prototype.hide = function() {

  }
  // 入口方法
  function Plugin(options) {
    var data = $(this).data('bs.collapse')
    if(!data) {
      data = new Collapse(this, options)
      $(this).data('bs.collapse', data)
    }
  }

  // 暴露接口(button方法为实例方法)
  $.fn.collapse = Plugin
})(jQuery)
