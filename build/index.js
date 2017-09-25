'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * depends Aotoo as global variable
 */

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
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      this.prepaireData(nextState);
    }

    /**
     * [
     *   {title, content, idf, parent, attr, path},
     *   {title, content, idf, parent, attr, path},
     * ]
     */

  }, {
    key: 'prepaireData',
    value: function prepaireData(state) {
      var that = this;
      var props = this.props;
      var propsItemClass = props.itemClass ? props.itemClass + ' ' : '';
      var menuData = [];
      var contentData = [];
      state.data.forEach(function (item, ii) {
        var itemCls = ii == state.select ? item.itemClass ? propsItemClass + item.itemClass + ' select' : propsItemClass + 'select' : item.itemClass ? propsItemClass + item.itemClass : propsItemClass;

        // 准备菜单数据
        menuData.push({
          index: ii,
          path: item.path,
          title: item.title,
          idf: item.idf,
          parent: item.parent,
          attr: item.attr,
          itemClass: itemCls,
          itemMethod: item.tabItemMethod
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

      this.createMenu();
    }
  }, {
    key: 'createMenu',
    value: function createMenu() {
      var menu_data = this.saxer.get().MenuData;
      var treeMenu = this.tree({
        data: menu_data,
        itemClass: this.props.itemClass,
        itemMethod: this.props.tabItemMethod,
        header: this.props.treeHeader,
        footer: this.props.treeFotter
      });

      this.saxer.append({
        MenuJsx: treeMenu
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
              itemClass: id && item.path && item.path == id ? 'select' : item.index == id ? 'select' : item.index == select ? 'select' : ''
            });
          }
        });
        return this.list({
          data: _contents
        });
      }

      contents.forEach(function (item) {
        if (id || id == 0) {
          if (item.path == id || item.index == id) {
            selectContent = item.content;
          }
        } else {
          if (item.index == select) {
            selectContent = item.content;
          }
        }
      });
      return selectContent;
    }
  }, {
    key: 'render',
    value: function render() {
      var jsxMenu = this.saxer.get().MenuJsx;
      var content = this.getContent();
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
  if (params.props && params.props.itemMethod) {
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
    SELECT: function SELECT(ostate, opts) {
      var state = this.curState;
      state.select = opts.select;
      if (typeof opts.cb == 'function') {
        setTimeout(function () {
          opts.cb();
        }, 100);
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
}

// import css style
// require('./tabs.styl')


// demo
// const WrapElement = Aotoo.wrap(
//   <div>这个真好吃</div>, {
//     rendered: function(dom){
//       console.log('========= rendered');
//     },
//     leave: function(){
//       console.log('========= leave');
//     }
//   }
// )

// function mkTabs(opts){
//   const dft = {
//     props: {
//       mulitple: false,
//       data: [],
//       tabClass: 'tabs-nornal-top'
//     }
//   }
//   // if (){}
// }

// const tabs = Aotoo.tabs({
//   props: {
//     mulitple: true,         //默认为false ,为true时，组件里所有content都会显示
//     // tabClass: 'tabs-nornal',
//     // tabClass: 'tabs-floor-left',
//     tabClass: 'tabs-nornal-top',
//     data: [
//       // {title: 'aaa', content: '什么', idf: 'le1', itemClass: 'aabbcc'},
//       {title: 'aaa', content: '什么, what'},
//       {title: 'bbb', content: '来了'},
//       {title: 'ccc', content: <WrapElement />},
//     ]
//   }
// })


// const $ = require('jquery')
// // //用于tabs-floor-left
// // tabs.render('test', function(dom){
// //   $(dom).find('.tabsMenus li:not(.itemroot)').click(function(){
// //     let index = $(this).attr('data-treeid')
// //     let num = parseInt(index) + 1
// //     tabs.$select({
// //       select: index
// //     })
// //     let target_top = $(this).parents('.tabsMenus').next('.mulitple').find('>ul>li:nth-child('+num+')').offset().top
// //     $("html,body").animate({scrollTop: target_top}, 500)
// //   })
// // })
// tabs.render('test', function(dom){
//   $(dom).find('.tabsMenus li:not(.itemroot)').click(function(){
//     let index = $(this).attr('data-treeid')
//     let num = parseInt(index) + 1     // mlitple = false  ,tabClass: 'tabs-nornal-top',
//     tabs.$select({
//       select: index,
//       cb: function(){ }
//     })
//     // let target_top = $(this).parents('.tabsMenus').next('.tabsBoxes').offset().top     //适合于 mlitple = true，tabClass: 'tabs-nornal-top',
//     let target_top = $(this).parents('.tabsMenus').next('.mulitple').find('>ul>li:nth-child('+num+')').offset().top - 50   // mlitple = false    50是tabsMenus的高度，tabClass: 'tabs-nornal-top',
//     $("html,body").animate({scrollTop: target_top}, 500)  //适合于 mlitple = true与false，tabClass: 'tabs-nornal-top',
//   })
// })
);
//# sourceMappingURL=maps/index.js.map
