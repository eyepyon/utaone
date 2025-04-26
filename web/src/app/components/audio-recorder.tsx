'use client';

import React from 'react';

export class AudioRecorder extends React.Component {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {}

  onAudioLoaded = (audio: HTMLAudioElement) => {};

  render() {
    return (
      <div>
        <audio id="audio" controls ref={this.onAudioLoaded} />
      </div>
    );
  }
}
