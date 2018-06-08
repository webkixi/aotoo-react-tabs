'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabsMenus = function TabsMenus(props) {
  var myProps = _extends({}, props);
  var propsData = [];
  myProps.data.forEach(function (item) {
    var className = (item.itemClass || '').replace(/ *select/g, '');
    if (item.index == myProps.select || item.path == myProps.select) {
      item.itemClass = className ? className + " select" : "select";
    } else {
      item.itemClass = className.replace(/( *)select/g, '');
    }
    propsData.push(item);
    return item;
  });
  myProps.data = propsData;
  return React.createElement(Aotoo.tree, myProps);
};

var Tabs = exports.Tabs = function (_React$Component) {
  _inherits(Tabs, _React$Component);

  function Tabs(props) {
    _classCallCheck(this, Tabs);

    var _this = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, props));

    _this.state = {
      data: _this.props.data || [],
      select: _this.props.select || _this.props.start || 0,
      selectData: {},
      showMenu: _this.props.showMenu
    };

    _this.prepaireData = _this.prepaireData.bind(_this);
    _this.createMenu = _this.createMenu.bind(_this);
    _this.getContent = _this.getContent.bind(_this);
    return _this;
  }

  _createClass(Tabs, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.prepaireData(this.state);
    }
  }, {
    key: 'prepaireData',
    value: function prepaireData(state) {
      var that = this;
      var props = this.props;

      var menuData = [];
      var contentData = [];
      state.data.forEach(function (item, ii) {
        // 准备菜单数据
        menuData.push({
          index: ii,
          path: item.path,
          title: item.title,
          idf: item.idf,
          parent: item.parent,
          attr: item.attr,
          itemClass: props.itemClass,
          itemMethod: props.tabItemMethod || props.itemMethod
        }

        // 准备内容数据
        );contentData.push({
          index: ii,
          path: item.path,
          idf: item.idf,
          content: item.content
        });
      });

      this.saxer.append({
        MenuData: menuData,
        ContentData: contentData
      });
    }
  }, {
    key: 'createMenu',
    value: function createMenu() {
      var props = this.props;
      var menu_data = this.saxer.get().MenuData;
      return React.createElement(TabsMenus, {
        data: menu_data,
        itemClass: props.itemClass,
        itemMethod: props.navItemMethod || props.tapItemMethod || props.tabItemMethod || props.itemMethod,
        header: props.treeHeader,
        footer: props.treeFooter,
        select: this.state.select
      });
    }
  }, {
    key: 'getContent',
    value: function getContent(id) {
      var select = this.state.select;
      var contents = this.saxer.get().ContentData;
      var _contents = [];
      var selectContent = void 0;

      if (this.props.mulitple) {
        contents.forEach(function (item, ii) {
          if (!item.idf) {
            _contents.push({
              title: item.content,
              itemClass: id && item.path && item.path == id ? 'select' : item.index == id ? 'select' : item.index == select || item.path == select ? 'select' : ''
            });
          }
        });
        return React.createElement(Aotoo.list, { data: _contents });
      }

      contents.forEach(function (item) {
        if (id || id == 0) {
          if (item.path == id || item.index == id) {
            selectContent = item.content;
          }
        } else {
          if (item.index == select || item.path == select) {
            selectContent = item.content;
          }
        }
      });
      return selectContent;
    }
  }, {
    key: 'render',
    value: function render() {
      var content = this.getContent();
      var jsxMenu = this.createMenu();
      if (typeof content == 'function') {
        content = content(this.state.selectData);
      }

      var cls = !this.props.tabClass ? 'tabsGroup ' : 'tabsGroup ' + this.props.tabClass;
      var boxes_cls = !this.props.mulitple ? 'tabsBoxes' : 'tabsBoxes mulitple';

      return React.createElement(
        'div',
        { className: cls },
        this.state.showMenu ? React.createElement(
          'div',
          { className: 'tabsMenus' },
          jsxMenu
        ) : '',
        React.createElement(
          'div',
          { className: boxes_cls },
          content
        )
      );
    }
  }]);

  return Tabs;
}(React.Component);

Aotoo.extend('tabs', function (params, utile) {
  var dft = {
    props: {
      tabClass: 'tabsGroupX',
      mulitple: false,
      tabItemMethod: undefined,
      showMenu: true
    }
  };
  if (params && params.props && params.props.itemMethod) {
    params.props.tabItemMethod = params.props.itemMethod;
    delete params.props.itemMethod;
  }
  dft = utile.merge({}, dft, params);

  var Action = {
    UPDATE: function UPDATE(ostate, opts) {
      var state = this.curState;
      state.data = opts.data;
      return state;
    },
    SELECT: function SELECT(ostate) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var state = this.curState;
      if (typeof opts == 'string' || typeof opts == 'number') {
        opts = { select: opts };
      }
      state.select = opts.select;
      if (typeof opts.cb == 'function') {
        setTimeout(function () {
          opts.cb();
        }, 300);
      }
      return state;
    }
  };

  var myTabs = Aotoo(Tabs, Action, dft);
  myTabs.setProps = function (options) {
    if (options.itemMethod) {
      options.tabItemMethod = options.itemMethod;
      delete options.itemMethod;
      myTabs.config = utile.merge({}, myTabs.config, { props: options });
    }
  };
  return myTabs;
});
//# sourceMappingURL=maps/index.js.map
