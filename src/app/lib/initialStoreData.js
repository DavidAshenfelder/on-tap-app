import { defaultErrMsg } from './general';

export default {
  leadMatching: {
    ruleModalData: {
      assignAgentSelect: {
        searchTerm: '',
        selectedIndex: 0,
        isOpen: false,
      },
      priceSelect: {
        priceIsOpen: false,
      },
      typeDropdown: {
        isOpen: false,
        selectedIndex: 0,
      },
      sourceDropdown: {
        isOpen: false,
        sources: [],
        searchTerm: '',
        selectedIndex: 0,
      },
      rule: {
        assignments: [],
        constraint: {},
        name: '',
        paused: false,
      },
      locationSearch: {
        suggestedListings: [],
        timerId: 0,
        searchTerm: '',
        selectedIndex: 0,
        isOpen: false,
      },
      filterPills: {
        // object where keys are filter groupings and values are arrays of pill objects
      },
      isSaving: false,
    },
    manageLeadFlowModalData: {
      displayModal: false,
      hasError: {
        error: false,
        errorMsg: defaultErrMsg,
      },
      showOnlyAgentsWithLeads: false,
    },
    manageLeadRotationModalData: {
      displayModal: false,
      hasError: {
        error: false,
        errorMsg: defaultErrMsg,
      },
      showOnlyAgentsWithLeads: false,
    },
    confirmModalData: {
      displayModal: false,
      hasError: {
        error: false,
        errorMsg: defaultErrMsg,
      },
      modalData: {
        actionHandler: () => console.error('No click handler provided'),
        bodyText: '',
        buttonColor: 'primary',
        buttonText: '',
        headerText: '',
      },
    },
    rules: [],
  },
  notifications: [],
  agents: {
    data: [],
    loading: false,
  },
  sources: {
    data: [],
    loading: false,
  },
  globals: {
    tenantId: '0',
    noScroll: false,
    disableESC: false,
  },
};
