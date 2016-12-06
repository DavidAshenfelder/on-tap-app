import { LOCATION_TYPES, PILL_GROUP_ORDER, API_TO_UI_TRANSLATIONS } from './constants';
import _ from 'lodash';
import { addToArray, deleteFromArray } from './immutable';
import currencyHelper from './currencyHelper';

export const transformApiSymbol = (val) => {
  // check to see if we have a translation, if not, uppercase the api value.
  let uiVal = API_TO_UI_TRANSLATIONS[val];
  if (!uiVal && val) uiVal = `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
  return uiVal;
};

const buildPillObj = (val, filterArr) => {
  const uiValue = transformApiSymbol(val);
  if (uiValue !== 'Price') {
    const pushObj = {
      name: uiValue,
      value: '',
      apiName: val,
      payload: '',
    };
    filterArr.push(pushObj);
  }
};

const buildFilterArr = (val, nodeType, filterArr) => {
  if (filterArr.length) {
    // if a constant is found, then set the value and payload
    // of the most recently added pill object in the array.
    if (nodeType === 'constant') {
      const lastAddedPill = filterArr[filterArr.length - 1];
      lastAddedPill.value = API_TO_UI_TRANSLATIONS[val] || val;
      lastAddedPill.payload = val;
    } else if (nodeType === 'symbol') {
      buildPillObj(val, filterArr);
    }
  } else {
    buildPillObj(val, filterArr);
  }
};

const reduceConstraint = (obj, filterArr) => {
  if (obj.l && obj.r) {
    reduceConstraint(obj.l, filterArr);
    reduceConstraint(obj.r, filterArr);
  } else if (!obj.l && obj.r) {
    reduceConstraint(obj.r, filterArr);
  } else if (obj.l && !obj.r) {
    reduceConstraint(obj.l, filterArr);
  } else if (obj.nodeType === 'range') {
    if (obj.min && (parseInt(obj.min.value, 10) > 0 || obj.min.value === '0')) {
      filterArr.push({
        name: 'Price Min',
        value: currencyHelper.toShortCurrency(obj.min.value),
        payload: obj.min.value,
      });
    }

    if (obj.max && obj.max.value) {
      filterArr.push({
        name: 'Price Max',
        value: currencyHelper.toShortCurrency(obj.max.value),
        payload: obj.max.value,
      });
    }
  } else {
    buildFilterArr(obj.value, obj.nodeType, filterArr);
  }
};

/**
 *
 */
export const constraintToPills = (constraint) => {
  const pillArray = [];
  const groupedPills = {};
  if (constraint && constraint.r && constraint.l) {
    reduceConstraint(constraint, pillArray);
  }
  // pillArray has been mutated at this point by reduceConstraint
  pillArray.forEach((pill) => {
    if (!groupedPills[pill.name]) groupedPills[pill.name] = [];
    groupedPills[pill.name].push(pill);
  });
  return groupedPills;
};

/**
 * Accepts a nodeType and value and returns a simple node, used to create l and r
 * in the case of simple == operators
 * @param nodeType (string)
 * @param value (string)
 *
 * if you args are `nodeType = 'symbol'` and `value = 'price'`, then return val
 * will be:
 *
 * { nodeType: 'symbol', value: 'price' }
 */
const simpleNode = (nodeType, value) => {
  return { nodeType, value };
};

/**
 * accepts l, r, and value and creates an operator node for use in building the expression tree
 */
const createOperator = (l, r, value) => {
  return { nodeType: 'operator', value, l, r };
};

/**
 * specifially creates a range operator.
 */
const createRangeOperator = (min, max) => {
  let range = null;

  // base range operator, assuming we have at least a min or a max
  if (min || max) {
    range = {
      nodeType: 'operator',
      value: 'IN',
      l: { nodeType: 'symbol', value: 'price' },
      r: { nodeType: 'range' },
    };
  }

  // set min and max accordingly
  if (min) range.r.min = { nodeType: 'constant', value: min };
  if (max) range.r.max = { nodeType: 'constant', value: max };

  return range;
};

/**
 * accepts an array of pill objects and returns an array of operator nodes
 */
const pillsToOperators = (pills) => {
  return pills.map((pill) =>
    createOperator(simpleNode('symbol', pill.apiName), simpleNode('constant', pill.payload), '==')
  );
};

/**
 * Where the magic happens.  Accepts an array of "operands" as well as an operationSymbol,
 * and joins together each operand with the specified operation symbol.
 * In the context of this function, operators can be expression trees themselves, or can be actual operator nodes.
 */
export const buildExpressionTree = (operands, operationSymbol) => {
  /**
   * We are going to build the expression tree starting at the bottom of the tree.
   * at first, constraint is going to equal the first operator.  Each time we iterate,
   * we will be building onto "constraint", 'or'-ing together constraint with the next operator.
   */
  let constraint = operands[0];
  operands.every((operator, i) => {
    if (!operands[i + 1]) return false;
    constraint = createOperator(operands[i + 1], constraint, operationSymbol);
    return true;
  });

  return constraint;
};

const pillsToRangeNode = (minPricePill, maxPricePill) => {
  const minPrice = minPricePill && minPricePill.length && minPricePill[0].payload ? minPricePill[0].payload : 0;
  const maxPrice = maxPricePill && maxPricePill.length && maxPricePill[0].payload ? maxPricePill[0].payload : null;

  return createRangeOperator(minPrice, maxPrice);
};

/**
 * Accepts an array of pill objects with "name", "value", and "payload" keys, and
 * returns a constraint object that can be passed to the API.
 * the basic gist:
 * - group the pills by filter type
 * - for each grouping, convert pills to operator nodes
 * - for each array of operator nodes, create an expression sub tree appropriate for each filter type
 *   (locations, sources, and types will be 'OR'ed together.  For min/max price, a range will be created)
 * - we want to create the final expression tree by AND-ing all of the filter group sub trees together.
 */
export const pillsToConstraint = (pills) => {
  // create one array with all location pill types
  const locationPills = [];
  LOCATION_TYPES.forEach((type) => {
    if (pills[type]) locationPills.push(...pills[type]);
  });

  // convert each grouping to a constraint
  const locationConstraint = buildExpressionTree(pillsToOperators(locationPills || []), '||');
  const sourceConstraint = buildExpressionTree(pillsToOperators(pills.Source || []), '||');
  const typeConstraint = buildExpressionTree(pillsToOperators(pills.Type || []), '||');
  const priceConstraint = pillsToRangeNode(pills['Price Min'], pills['Price Max']);

  // create array for final constraint tree, filter out undefined values.
  const constraintGroupings = [
    locationConstraint,
    sourceConstraint,
    typeConstraint,
    priceConstraint, // if no min and no max, priceConstraint will be null and will be filtered out.
  ].filter((a) => !!a);

  // We need to 'AND' together each sub constraint group
  return buildExpressionTree(constraintGroupings, '&&');
};

/**
 * Used for the filterPills reducer SELECT_LOCATION, SELECT_SOURCE and SELECT_TYPE cases.
 * accepts the state, a pill key (i.e. 'Source' or 'Type'), and the value of the pill.
 * If it doesn't exist, we push it to the new state. If it's already there, we do nothing.
 * Prevents user from selecting the same source or type or location over and over again.
 */
export const handlePillAdd = (state, thePill) => {
  let newState = [];
  let pill = thePill;
  delete pill.remove;
  delete pill.text;
  const foundIndex = _.findIndex(state, thePill);

  // if the user selected this item for the first time, push to array
  if (foundIndex < 0) {
    newState = addToArray(state, thePill);
  // otherwise the item has already been selected, do nothing.
  } else {
    newState = deleteFromArray(state, foundIndex);
  }

  return newState;
};

/**
 * convert a grouped pill object into a single array of pills, prepping
 */
export const combinePillGroups = (pillGroups) => {
  const orderedArrays = [];

  // create array of arrays based on pre-defined pill order
  let grp = [];
  PILL_GROUP_ORDER.forEach((key) => {
    grp = pillGroups ? pillGroups[key] : [];
    if (grp && grp.length) {
      orderedArrays.push(_.sortBy(grp, (o) => {
        return o.value.toString().toLowerCase();
      }));
    }
  });

  // concat them together into a single Pill array
  return [].concat.apply([], orderedArrays);
};

/**
 * accepts a rule and creates an array listing IDs from the listing pills
 * associated with that rule.  The purpose of this array is to bring
 * all of the listing pills into one array, such that we can eventually create an array
 * of promises using this data to retrieve the listing addresses one-by-one, and use the
 * data collected here to update the pill in the rule later.
 */
export const extractListingIdsFromRule = (rule) => {
  const listingIds = [];
  const listingPills = rule.filterPills.Listing;
  // continue processing only if listingPills exist
  if (listingPills && listingPills.length) {
    // loop through pills and build "update data" structure.
    listingPills.forEach((pill) => {
      // because we have old data, make sure the payload is a listingId and not a string
      if (pill.payload % 1 === 0) listingIds.push(pill.payload);
    });
  }
  return listingIds;
};

/**
 * accepts a available sources and maps them to the selected sources to display in the filter pills.
 * The UI facing value for the source is not stored in the API so we need to get that value from the
 * list of pills that we select from.
 */
export const formatSourcePills = (sourceArr, sourceData) => {
  const newArr = [];
  sourceArr.forEach((source) => {
    sourceData.every((src) => {
      if (src.Key === source.value) {
        source.value = src.Value;
        return false;
      } else {
        return true;
      }
    });
    newArr.push(source);
  });
  return newArr;
};

export const formatListingPills = (listingPills, listings) => {
  return listingPills.map((pill) => {
    const listing = listings.find((l) => parseInt(l.Item1.ListingID, 10) === parseInt(pill.payload, 10));
    return listing ? {
      ...pill,
      value: listing.Item1.Location.Address.FullAddress,
    } : pill;
  });
};
