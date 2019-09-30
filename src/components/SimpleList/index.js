import React from 'react';
import Filter from '../Filter';
import Header from './components/Header.js';
import Body from './components/Body.js';
import Sections from './components/Sections.js';

type DefaultPropShape = {
  addFilter: void,
  bgcAlt: boolean,
  clickAct: Function,
  filterOpts: Array<{
    text: string,
    value: string,
  }>,
  tableTitle: string,
  sections: boolean,
  enableSearch: boolean,
  showDatepicker: boolean,
  children: false,
  allowClick: boolean,
  groupSelection: Object[],
  onScroll: Function,
};

export type SimpleListPropsShape = {
  name: string,
  headings: [
    {
      name: string,
      sortable: boolean,
      text: string,
    },
  ],
  addFilter?: Function, // returns some JSX to render an additional filter
  bgcAlt?: boolean,
  clickAct?: Function,
  filterOpts?: Array<{
    text: string,
    value: string,
  }>,
  tableTitle?: string,
  sections?: boolean,
  sectionTarget?: string,
  sectionTitleKeys?: string[],
  enableSearch?: boolean,
  showDatepicker?: boolean,
  children?: any,
  allowClick?: boolean,
  initialSearch?: string,
  groupSelection?: Object[],
  searchValue?: string,
};

type PropsShape = SimpleListPropsShape & {
  updateQuery: Function,
};

// TODO: this is outdated....
// before i flesh this out...
export type SimpleListContextShape = {
  updateQuery: Function,
  name: string,
  initial_sort: string,
  sortString: string, // not sure what the difference is here...
};

export const SimpleListContext = React.createContext({
  name: '',
  headings: [],
  sortString: '',
  initial_sort: '',
  onItemClick: null,
  updateQuery: null,
  onSort: null,
  pageData: {
    currentPage: 0,
    lastPage: 0,
    perPage: 0,
  },
  sectionData: {
    sections: null,
    sectionTarget: null,
    sectionTitleKeys: null,
  },
  childrenRenderer: null,
  allowClick: false,
  data: [],
  isLoading: false,
  searchValue: '',
});

class SimpleList extends React.Component<PropsShape> {
  static defaultProps = {
    baseClass: 'simple-list',
    clickAct: null,
    filterOpts: [],
    bgcAlt: false,
    addFilter: undefined,
    tableTitle: '',
    enableSearch: true,
    showDatepicker: false,
    noPointer: false,
    children: false,
    allowClick: true,
    initialSearch: '',
    sections: false,
    sectionTarget: '',
    sectionTitleKeys: [],
    groupSelection: null,
    searchValue: '',
  };

  defaultProps: DefaultPropShape;

  updateQuery = (searchType, searchValue) => {
    const { updateQuery } = this.props;
    updateQuery(searchType, searchValue);
  };

  changePerPage = (perPage: string | number): any => {
    this.updateQuery('per-page', perPage);
  };

  sortData = (column: string, sortType: 'asc' | 'desc'): any =>
    this.updateQuery('sort', column, sortType);

  groupData = (grouping: string): any => {
    this.updateQuery('group', grouping);
  };

  searchData = (term: string): string => {
    this.updateQuery('search', term);
  };

  paginateData = (pageNumber: number): Function => (): any => {
    this.updateQuery('paginate', pageNumber);
  };

  filterDataByDate = ({ start, end }: Object): Function =>
    this.updateQuery('date-filter', start, end);

  render() {
    const {
      baseClass,
      name,
      headings,
      sortString,
      initial_sort,
      clickAct: onItemClick,
      currentPage,
      lastPage,
      perPage,
      sections,
      sectionTarget,
      sectionTitleKeys,
      children: childrenRenderer,
      allowClick,
      data,
      isLoading,
      bgcAlt,
      noPointer,
      tableTitle,
      enableSearch,
      addFilter,
      filterOpts,
      showDatepicker,
      initialSearch,
      groupSelection,
      filterPlaceholder,
      searchValue,
    } = this.props;
    return (
      <SimpleListContext.Provider
        value={{
          name,
          headings,
          sortString,
          initial_sort,
          onItemClick,
          updateQuery: this.updateQuery,
          onSort: this.sortData,
          changePage: this.paginateData,
          changePageLimit: this.changePerPage,
          pageData: {
            currentPage,
            lastPage,
            perPage,
          },
          sectionData: {
            sections,
            sectionTarget,
            sectionTitleKeys,
          },
          childrenRenderer,
          allowClick,
          data,
          isLoading,
        }}>
        <div
          ref={this.listRef}
          className={`${baseClass} ${bgcAlt ? `${baseClass}--bgc-alt` : ''} ${
            noPointer ? `${baseClass}--no-pointer` : ''
          }`}>
          {tableTitle !== '' ? (
            <h3 className={`${baseClass}__title`}>{tableTitle}</h3>
          ) : null}
          {enableSearch ? (
            <Filter // TODO: add a context-wrapped Filter component
              callback={this.searchData}
              // TODO: use context props within - when merging Filter changes into this
              addFilter={addFilter || undefined}
              predefined={filterOpts}
              addDatepicker={showDatepicker}
              datepickerCallback={this.filterDataByDate}
              connectName={name}
              initialText={initialSearch}
              groupSelection={groupSelection}
              groupSelectionCB={this.groupData}
              // new!
              searchValue={searchValue}
              searchInputPlaceholderText={filterPlaceholder}
            />
          ) : (
            <div />
          )}
          <Header
            // updateSearchValue needs to merge the new query into the existing search params - see Assa
            updateSearchValue={this.updateSearchValue}
          />
          {sections === true ? <Sections /> : <Body />}
        </div>
      </SimpleListContext.Provider>
    );
  }
}

export default SimpleList;
