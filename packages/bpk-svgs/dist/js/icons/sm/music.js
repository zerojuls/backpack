import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" {...this.props}><path d="M9.9 2.1C5.7 1.5 2 4.8 2 9v5c0 1.1.9 2 2 2h2v-5H4V9.2C4 6.6 5.9 4.3 8.5 4c3-.3 5.5 2.1 5.5 5v2h-2v5h2c1.1 0 2-.9 2-2V9.3c0-3.6-2.5-6.8-6.1-7.2z" /></svg>;
  }

}