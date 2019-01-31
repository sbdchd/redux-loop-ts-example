import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveCount, loadCount, incrementCounter, Action } from '../reducers/';
import { IState } from '../reducers/';

interface StateProps {
  readonly counter: number;
  readonly isLoading: boolean;
  readonly isSaving: boolean;
  readonly error: Error | undefined;
}

interface DispatchProps {
  readonly loadCount: () => Action;
  readonly saveCount: (value: number) => Action;
  readonly incrementCounter: () => Action;
}

interface OwnProps { }

type Props = StateProps & DispatchProps & OwnProps;

class CounterContainerComponent extends React.Component<Props> {
  saveCount = () => {
    this.props.saveCount(this.props.counter);
  };

  increment = () => {
    this.props.incrementCounter();
  };

  render() {
    return (
      <div>
        <div className="hero">
          <strong>{this.props.counter}</strong>
        </div>
        <button onClick={this.increment}>click me!</button>
        <button disabled={this.props.isSaving} onClick={this.saveCount}>
          {this.props.isSaving ? 'saving...' : 'save'}
        </button>
        <button disabled={this.props.isLoading} onClick={this.props.loadCount}>
          {this.props.isLoading ? 'loading...' : 'load'}
        </button>
      </div>
    );
  }
}

function mapStateToProps(state: IState): StateProps {
  return {
    counter: state.counter,
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    error: state.error,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IState>): DispatchProps {
  return bindActionCreators(
    {
      loadCount: loadCount.request,
      saveCount: saveCount.request,
      incrementCounter: incrementCounter,
    },
    dispatch
  );
}

export const CounterContainer = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(CounterContainerComponent);
