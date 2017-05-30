import React from 'react';

export default class MapContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <form>
          <label id="searchLabel">
            <img src="img/magnifying-glass.png"/>
          </label>
          <input
            id="searchForm"
            type="text"
            placeholder="Enter a Destination (E.g. Cancun, Mexico)"
          />
        </form>
      </div>
    );
  }
}