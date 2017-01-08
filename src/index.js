import Immutable from 'immutable';
import { getNewState } from './get-new-states';
import React from 'react';
import { render } from 'react-dom';
import Filter from './Filter';

const SKU = Immutable.fromJS({
    'color:red;size:x;gender:male;': {
        price: 110,
        count: 10,
    },

    'color:red;size:l;gender:male;': {
        price: 100,
        count: 8,
    },

    'color:red;size:xl;gender:male;': {
        price: 100,
        count: 8,
    },

    'color:blue;size:x;gender:female;': {
        price: 90,
        count: 0,
    },

    'color:blue;size:l;gender:female;': {
        price: 90,
        count: 1,
    },

    'color:blue;size:xl;gender:female;': {
        price: 80,
        count: 0,
    },
});

render(
    (
        <Filter
            sku={SKU}
            defaultState={getNewState({}, SKU)}
            getNewState={getNewState} />
    ),
    document.querySelector('#root')
);

window.getNewState = getNewState;
window.SKU = SKU;
