import Immutable from 'immutable';

export function searchInResult(condition, result) {
    const conditionArr = [];

    condition.forEach((v, k) => conditionArr.push(`${k}:${v}`));

    return result.update(resultItem => resultItem.filter((v, k) => {
        let valid = true;

        conditionArr.forEach(conditionItem => {
            const reg = new RegExp(`${conditionItem};`, 'g');

            if (!reg.test(k)) valid = false;
        });

        return valid;
    }));
}

function getPriceRange(sku) {
    let min = 0;
    let max = 0;

    sku.forEach(v => {
        const price = v.get('price');

        if (min > price || min === 0) min = price;

        if (max < price || max === 0) max = price;
    });

    return `${min} ~ ${max}`;
}

function getTotalCount(sku) {
    return sku
        .toArray()
        .reduce(
            (preV, curV) => curV.set('count', curV.get('count') + preV.get('count'))
        )
        .get('count');
}

function getInitState(sku) {
    const result = {
        options: {},
        currentSKU: null,
        placeholder: Immutable.Map({
            price: getPriceRange(sku),
            count: getTotalCount(sku),
        }),
    };

    sku.forEach((item, key) => {
        const optionArr = key.split(';').filter(x => x !== '');

        optionArr.forEach(option => {
            const kv = option.split(':');
            const k = kv[0];
            const v = kv[1];

            if (!result.options[k]) result.options[k] = Immutable.Set([]);

            result.options[k] = result.options[k].add(Immutable.Map({
                name: k,
                value: v,
                disabled: false,
                active: false,
            }));
        });
    });

    result.options = Immutable.Map(result.options);

    return Immutable.Map(result);
}

function getOptionCount(optionItem, result) {
    let count = 0;

    const rst = searchInResult(Immutable.Map({
        [optionItem.get('name')]: optionItem.get('value'),
    }), result);

    rst.forEach(item => {
        count += item.get('count');
    });

    return count;
}

function checkOptionDisabled(optionItem, result, conditions, sku) {
    let realResult;

    if (conditions.size === 1) {
        conditions.forEach((v, k) => {
            if (k === optionItem.get('name')) {
                realResult = sku;
            } else {
                realResult = result;
            }
        });
    } else {
        realResult = result;
    }

    return getOptionCount(optionItem, realResult) === 0;
}

function checkOptionActive(disabled, optionItem, conditions) {
    if (disabled) return false;

    let active = false;

    conditions.forEach((v, k) => {
        if (k === optionItem.get('name') && v === optionItem.get('value')) {
            active = true;
        }
    });

    return active;
}

function getNewOptions(oldOptions, result, conditions, sku) {
    return oldOptions.update(options => options.map(option => option.map(
        item => {
            const disabled = checkOptionDisabled(item, result, conditions, sku);

            return item
            .set('disabled', disabled)
            .set('active', checkOptionActive(disabled, item, conditions));
        }
    )));
}

function getNewCurrentSKU(result) {
    if (result.size === 1) {
        let key = '';

        result.forEach((v, k) => { key = k; });

        return Immutable
            .Map(result.first())
            .merge({ sku: key });
    }
    return null;
}

export function getNewState(conditionsObj, sku) {
    const conditions = (
        Immutable.Map.isMap(conditionsObj) ?
        conditionsObj :
        Immutable.Map(conditionsObj)
    );

    const result = searchInResult(conditions, sku);
    const state = getInitState(sku);

    return state.update(
        newState => newState
            .set('options', getNewOptions(newState.get('options'), result, conditions, sku))
            .set('currentSKU', getNewCurrentSKU(result))
    );
}
