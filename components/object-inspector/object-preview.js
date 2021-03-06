import React, { Component, PropTypes } from 'react';

import ObjectDescription from './object-description';

function intersperse(arr, sep){
  if (arr.length === 0) {
    return [];
  }

  // TODO: optimise this to a simple loop
  return arr.slice(1).reduce(function(xs, x, i) {
      return xs.concat([sep, x]);
  }, [arr[0]]);
}

/**
 * A preview of the object on root level node
 */
export default class ObjectPreview extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.object !== this.props.object ||
      nextProps.maxProperties !== this.props.maxProperties
    );
  }
  _renderArrayEntry(element, index){
    return <ObjectDescription key={index} object={element} />;
  }
  render() {
    const object = this.props.object;
    if (typeof object !== 'object' || object === null) {
      return (<ObjectDescription object={object} />);
    }

    if (Array.isArray(object)) {
      return <span className="ObjectInspector-object-preview">[
        {intersperse(object.map(this._renderArrayEntry), ", ")}
      ]</span>;
    }
    else if (object instanceof Date) {
      return <span>{object.toString()}</span>;
    }
    else {
      let propertyNodes = [];
      for(let propertyName in object){
        const propertyValue = object[propertyName];
        if(object.hasOwnProperty(propertyName)){
          let ellipsis;
          if (propertyNodes.length === (this.props.maxProperties - 1)
              && Object.keys(object).length > this.props.maxProperties) {
            ellipsis = (<span key={'ellipsis'}>…</span>);
          }
          propertyNodes.push(
            <span key={propertyName}>
              <span className="ObjectInspector-object-name">{propertyName}</span>
              :&nbsp;
              <ObjectDescription object={propertyValue} />
              {ellipsis}
            </span>
          );
          if(ellipsis)
            break;
        }
      }

      return (<span className="ObjectInspector-object-preview">
                  {'Object {'}
                  {intersperse(propertyNodes, ", ")}
                  {'}'}
              </span>);
    }
  }
}

ObjectPreview.propTypes = {
  maxProperties: PropTypes.number // maximum properties displayed in preview
};

ObjectPreview.defaultProps = {
  maxProperties: 5
};
