import React from "react";
import {withRouter} from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import {InputField} from "../../views/design/InputField";
import {Button} from "../../views/design/Button";
import {NotificationContainer} from "react-notifications";
import {OverlayContainer} from "../../views/design/Overlay";


class DeckEditor extends React.Component{
  constructor(props) {
    super(props);

  }

  render() {
    return(
      <OverlayContainer>
        <LoadingOverlay
          active={this.state.loading}
          spinner
          text='Loading ...'
        >

        </LoadingOverlay>
        <NotificationContainer/>
      </OverlayContainer>
    )
  }
}

export default withRouter(DeckEditor);