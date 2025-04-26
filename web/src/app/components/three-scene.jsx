'use client'

import React from 'react';

export class ThreeScene extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  onCanvasLoaded = (canvas) => {
  };

  render() {
    return (
      <div>
        <canvas style={{ width: '80vw', height: '40vw' }} ref={this.onCanvasLoaded} />
      </div>
    );
  }
}