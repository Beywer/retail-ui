import classNames from 'classnames';
import React from 'react';

import PropTypes from 'prop-types';

import Corners from '../Button/Corners';

import '../ensureOldIEClassName';
import styles from './Group.less';

export interface GroupProps {
  width?: React.CSSProperties['width'];
}

/**
 * Главный *Input*, который должен занимать всю доступную ширину, должен быть
 * помечен свойством *mainInGroup*.
 */
class Group extends React.Component<GroupProps> {
  public static propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  public render() {
    const style: React.CSSProperties = {};
    if (this.props.width) {
      style.width = this.props.width;
    }

    let first: Nullable<React.ReactElement<any>> = null;
    let last: Nullable<React.ReactElement<any>> = null;

    React.Children.forEach(this.props.children, child => {
      if (child && React.isValidElement(child)) {
        first = first || child;
        last = child;
      }
    });

    return (
      <span className={styles.root} style={style}>
        {React.Children.map(this.props.children, child => {
          if (!child || !React.isValidElement(child)) {
            return null;
          }

          const childProps = (child as React.ReactElement<{
            mainInGroup?: boolean;
            width?: React.CSSProperties["width"];
            corners?: number;
          }>).props;

          const wrapCss = classNames({
            [styles.wrap]: true,
            [styles.fixed]: !childProps.mainInGroup,
            [styles.stretch]: childProps.mainInGroup
          });
          const itemCss = classNames({
            [styles.item]: true,
            [styles.itemFirst]: child === first
          });

          let corners = 0;
          if (child !== first) {
            corners |= Corners.TOP_LEFT | Corners.BOTTOM_LEFT;
          }
          if (child !== last) {
            corners |= Corners.TOP_RIGHT | Corners.BOTTOM_RIGHT;
          }

          childProps.corners = corners;
          if (childProps.mainInGroup) {
            childProps.width = '100%';
          }

          child = React.cloneElement(child, childProps);

          return (
            <div className={wrapCss}>
              <div className={itemCss}>{child}</div>
            </div>
          );
        })}
      </span>
    );
  }
}

export default Group;