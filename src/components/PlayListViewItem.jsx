import React from 'react';

export default class PlayListViewsItem extends React.Component {
  constructor(props) {
    super(props);
    this.play = this.play.bind(this);
  }

  play() {
    this.props.play(this.props.track.get('source'), this.props.track.get('id'),
      this.props.index);
  }

  render() : React.Element {
    const { track, active } = this.props;

    let className = 'playlist-item';
    if (active) {
      className = 'playlist-item active';
    }

    return (
      <div
        key={`pl-item_${track.get('id')}`}
        onDoubleClick={this.play}
        className={className}
      >
        {track.getIn(['metadata', 'artist'])} -
        {track.getIn(['metadata', 'album'])} -
        {track.getIn(['metadata', 'title'])}
      </div>
    );
  }
}
