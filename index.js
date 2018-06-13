const TabsMenus = (props) => {
  let myProps = {...props}
  const propsData = []
  myProps.data.forEach( item => {
    const className = (item.itemClass||'').replace(/ *select/g, '')
    if (item.index == myProps.select || item.path == myProps.select) {
      item.itemClass = className ? className + " select" : "select"
    } else {
      item.itemClass = className.replace(/( *)select/g, '')
    }
    propsData.push(item)
    return item
  })
  myProps.data = propsData
  return <Aotoo.tree {...myProps}/>
}

export class Tabs extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data||[],
      select: this.props.select||this.props.start||0,
      selectData: {},
      showMenu: this.props.showMenu,
    }

    this.prepaireData = this.prepaireData.bind(this)
    this.createMenu = this.createMenu.bind(this)
    this.getContent = this.getContent.bind(this)
  }

  componentWillMount() {
    this.prepaireData(this.state)
  }
  
  prepaireData(state){
    const that = this
    const props = this.props
    
    let menuData = []
    let contentData = []
    state.data.forEach( (item, ii) => {
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
      })

      // 准备内容数据
      contentData.push({
        index: ii,
        path: item.path,
        idf: item.idf,
        content: item.content
      })
    })

    this.saxer.append({
      MenuData: menuData,
      ContentData: contentData
    })
  }

  createMenu(){
    const props = this.props
    const menu_data = this.saxer.get().MenuData
    return <TabsMenus
      data={menu_data}
      itemClass={props.itemClass}
      itemMethod={props.navItemMethod || props.tapItemMethod || props.tabItemMethod || props.itemMethod}
      header={props.treeHeader}
      footer={props.treeFooter}
      select={this.state.select}
    />
  }

  getContent(id){
    const select = this.state.select
    const contents = this.saxer.get().ContentData
    const stateContents = this.state.data
    let _contents = []
    let selectContent

    if (this.props.mulitple) {
      contents.forEach( (item, ii) => {
        if (!item.idf) {
          _contents.push({
            title: item.content,
            itemClass: (id && item.path && item.path == id) ? 'select' : item.index == id ? 'select' : (item.index == select || item.path == select) ? 'select' : ''
          })
        }
      })
      return <Aotoo.list data={_contents}/>
    }

    contents.forEach( item => {
      if ( (id||id==0)) {
        if (item.path == id || item.index == id) {
          selectContent = item.content || stateContents[item.index]['content']
        }
      } else {
        if (item.index == select || item.path == select) {
          selectContent = item.content || stateContents[item.index]['content']
        }
      }
    })
    return selectContent
  }

  render(){
    let content = this.getContent()
    const jsxMenu = this.createMenu()
    if (typeof content == 'function') {
      content = content(this.state.selectData)
    }

    const cls = !this.props.tabClass ? 'tabsGroup ' : 'tabsGroup ' + this.props.tabClass
    const boxes_cls = !this.props.mulitple ? 'tabsBoxes' : 'tabsBoxes mulitple'

    return (
      <div className={cls}>
        { this.state.showMenu ? <div className='tabsMenus'>{jsxMenu}</div> : '' }
        <div className={boxes_cls}>{content}</div>
      </div>
    )
  }
}

Aotoo.extend('tabs', function(params, utile){
  let dft = {
    props: {
      tabClass: 'tabsGroupX',
      mulitple: false,
      tabItemMethod: undefined,
      showMenu: true
    }
  }
  if (params && params.props && params.props.itemMethod) {
    params.props.tabItemMethod = params.props.itemMethod
    delete params.props.itemMethod
  }
  dft = utile.merge({}, dft, params)

  const Action = {
    UPDATE: function(ostate, opts){
      let state = this.curState
      state.data = opts.data
      return state
    },
    SELECT: function(ostate, opts={}){
      let state = this.curState
      if (typeof opts=='string' || typeof opts=='number') {
        opts = {select: opts}
      }
      state.select = opts.select
      state.selectData = opts.selectData
      if (typeof opts.cb == 'function') {
        setTimeout(function() {
          opts.cb()
        }, 300);
      }
      return state
    },
  }

  const myTabs = Aotoo(Tabs, Action, dft)
  myTabs.setProps = function(options){
    if (options.itemMethod) {
      options.tabItemMethod = options.itemMethod
      delete options.itemMethod
      myTabs.config = utile.merge({}, myTabs.config, {props: options})
    }
  }
  return myTabs
})