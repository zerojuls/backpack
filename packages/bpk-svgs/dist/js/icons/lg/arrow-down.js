import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}><path d="M19.7 10.3L12 17.4l-7.7-7.1c-.6-.6-.2-1.7.7-1.7h14c.9 0 1.3 1.1.7 1.7z" /></svg>;
  }

}