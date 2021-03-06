import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Icon, Popup, Radio } from 'zarm';
import { Dropdown, Menu } from 'zarm-web';
import classnames from 'classnames';
import docsearch from 'docsearch.js';
import MenuComponent from '@site/web/components/Menu';
import Events from '@site/utils/events';
import Context from '@site/utils/context';
import Locale from '@site/locale';
import { version } from '@/package.json';
import 'docsearch.js/dist/cdn/docsearch.min.css';
import './style.scss';
import '@/components/style/entry';

const initDocSearch = () => {
  docsearch({
    apiKey: '44e980b50447a3a5fac9dc2a4808c439',
    indexName: 'zarm',
    inputSelector: '.search input',
    debug: false,
  });
};

const Icons = Icon.createFromIconfont('//at.alicdn.com/t/font_1340918_lpsswvb7yv.js');

const Header = ({ children }) => {
  const searchInput = useRef();
  const location = useLocation();
  const [menu, toggleMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [lang, setLang] = useState(window.sessionStorage.language || 'zhCN');
  const currentPageKey = location.pathname.split('/')[1] || '/';

  const keyupEvent = (event) => {
    if (event.keyCode === 83 && event.target === document.body) {
      searchInput.current.focus();
    }
  };

  const activeClassName = (keys) => {
    return classnames({
      active: keys.indexOf(currentPageKey) > -1,
    });
  };

  const NAV_ITEMS = [
    { key: 'components', link: '#/components/quick-start', title: <FormattedMessage id="app.home.nav.components" /> },
    { key: 'design', link: '#/design/download', title: <FormattedMessage id="app.home.nav.resources" /> },
    { key: 'gitee', link: 'https://zarm.gitee.io', title: '国内镜像' },
  ];

  if (document.location.host.indexOf('gitee') > -1 || lang === 'enUS') {
    NAV_ITEMS.pop();
  }

  useEffect(() => {
    Events.on(document, 'keyup', keyupEvent);
    initDocSearch();

    return () => {
      Events.off(document, 'keyup', keyupEvent);
    };
  }, []);

  const menuRender = currentPageKey !== '/' && (
    <div className="header-icon header-icon-menu">
      {
        currentPageKey === 'components' && (
          <>
            <Icons type="list" onClick={() => toggleMenu(!menu)} />
            <Popup
              visible={menu}
              direction="left"
              onMaskClick={() => toggleMenu(!menu)}
            >
              <div className="header-menu">
                {/* <div className="header-menu__close"><Icon type="close" /></div> */}
                <MenuComponent />
              </div>
            </Popup>
          </>
        )
      }
    </div>
  );

  const moreRender = (
    <div className="header-icon header-icon-more">
      <Dropdown
        visible={dropdown}
        onVisibleChange={setDropdown}
        direction="bottom"
        content={(
          <div className="header-nav">
            <Menu selectedKeys={[currentPageKey]}>
              {NAV_ITEMS.map((item) => <Menu.Item key={item.key}><a href={item.link}>{item.title}</a></Menu.Item>)}
              <Menu.Item>
                <a href="https://github.com/ZhongAnTech/zarm" target="_blank" rel="noopener noreferrer">
                  Github
                </a>
              </Menu.Item>
            </Menu>
          </div>
        )}
      >
        <Icons type="more" />
      </Dropdown>
    </div>
  );

  return (
    <IntlProvider locale="zh-CN" messages={Locale[lang]}>
      <Context.Provider value={{ lang }}>
        <header>
          <div className="header-container">
            {menuRender}
            <div className="logo">
              <a href="#/">
                <img alt="logo" src={require('./images/logo.svg')} />
            Zarm
                <sup className="logo-version">v{version}</sup>
              </a>
            </div>
            {moreRender}
            <nav>
              <div className="search">
                <Icon type="search" />
                <FormattedMessage id="app.home.nav.search">
                  {(txt) => (
                    <input placeholder={txt} ref={searchInput} />
                  )}
                </FormattedMessage>
              </div>
              <ul>
                {NAV_ITEMS.map((item) => <li key={item.key}><a href={item.link} className={activeClassName([item.key])}>{item.title}</a></li>)}
              </ul>
              <div className="lang">
                <Radio.Group
                  compact
                  type="button"
                  value={lang}
                  onChange={(value) => {
                    setLang(value);
                    window.sessionStorage.language = value;
                  }}
                >
                  <Radio value="zhCN">中文</Radio>
                  <Radio value="enUS">EN</Radio>
                </Radio.Group>
              </div>
              <a className="github" href="https://github.com/ZhongAnTech/zarm" target="_blank" rel="noopener noreferrer">
                <Icons type="github" />
              </a>
            </nav>
          </div>
        </header>
        {children}
      </Context.Provider>
    </IntlProvider>
  );
};

export default Header;
