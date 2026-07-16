import React from 'react';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from '@carbon/react';
import { UserAvatar } from '@carbon/react/icons';

/**
 * AppHeader
 *
 * @param {{ currentPage: string; onNavigate: (page: string) => void }} props
 */
const AppHeader = ({ currentPage, onNavigate }) => (
  <Header aria-label="Player Dashboard">
    <SkipToContent />
    <HeaderName href="#" prefix="IBM">
      Player Dashboard
    </HeaderName>

    <HeaderNavigation aria-label="Player Dashboard">
      <HeaderMenuItem
        href="#browser"
        isCurrentPage={currentPage === 'browser'}
        onClick={(e) => { e.preventDefault(); onNavigate('browser'); }}
      >
        Player Browser
      </HeaderMenuItem>
      <HeaderMenuItem
        href="#formation"
        isCurrentPage={currentPage === 'formation'}
        onClick={(e) => { e.preventDefault(); onNavigate('formation'); }}
      >
        Team Formation
      </HeaderMenuItem>
    </HeaderNavigation>

    <HeaderGlobalBar>
      <HeaderGlobalAction aria-label="User Avatar" tooltipAlignment="end">
        <UserAvatar size={20} />
      </HeaderGlobalAction>
    </HeaderGlobalBar>
  </Header>
);

export default AppHeader;
