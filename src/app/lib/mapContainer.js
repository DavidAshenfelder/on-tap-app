import React, { PropTypes } from 'react';
import AltContainer from 'alt-container';

const mapContainer = (mapStateToProps) => {
  return (Container) => {
    const mapAlt = ({ flux }) => {
      return {
        ...flux.getActions('AltActions'),
        ...mapStateToProps(flux.stores.AltStore.state),
      };
    };

    const Component = (props, context) => {
      return (
        <AltContainer
          component={Container}
          stores={context.flux.stores}
          transform={mapAlt}
        />
      );
    };

    Component.contextTypes = {
      flux: PropTypes.object,
    };

    return Component;
  };
};

export default mapContainer;
