import React from 'react';
import Immutable from 'immutable';
import classnames from 'classnames';
import './style.less';

let conditions = Immutable.Map({});

export default class Filter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            store: props.defaultState,
        };

        this.removeCondition = this.removeCondition.bind(this);
        this.addCondition = this.addCondition.bind(this);
    }

    setNewState() {
        const { getNewState, sku } = this.props;

        this.setState({
            store: getNewState(conditions, sku),
        });
    }

    addCondition(name, value) {
        conditions = conditions.set(name, value);
        this.setNewState(conditions);
    }

    removeCondition(name) {
        conditions = conditions.remove(name);

        this.setNewState(conditions);
    }

    updateCondition(item) {
        if (item.get('disabled')) return;

        if (item.get('active')) {
            this.removeCondition(item.get('name'));
        } else {
            this.addCondition(item.get('name'), item.get('value'));
        }
    }

    render() {
        const { store } = this.state;
        const options = store.get('options');
        const sku = store.get('currentSKU');
        const placeholder = store.get('placeholder');
        const info = sku ? sku : placeholder;

        return (
            <div className='filter'>
                {
                    options.map((popValue, popName) => (
                        <div
                            key={popName}
                            className='row'>
                            <h4>{popName}</h4>
                            <ul>
                                {
                                    popValue.map((item, i) => (
                                        <li
                                            key={i}
                                            className={classnames({
                                                active: item.get('active'),
                                                disabled: item.get('disabled'),
                                            })}
                                            onClick={() => this.updateCondition(item)}>
                                            {item.get('value')}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }


                {
                    info.map((v, k) => (
                        <div key={k}>{k}: {v}</div>
                    ))
                }
            </div>
        );
    }
}

Filter.propTypes = {
    defaultState: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    getNewState: React.PropTypes.func.isRequired,
    sku: React.PropTypes.instanceOf(Immutable.Map).isRequired,
};
