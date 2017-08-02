import React from 'react';

const Footer = () => (
  <footer className="app__footer">
    <div className="app__container">
      <div className="app__footer__social">
        <a href="https://twitter.com/intent/follow?screen_name=svgporn" target="_blank">
          <i className="i-twitter" />
        </a>
        <a href="https://github.com/gilbarbara/logos" target="_blank">
          <i className="i-github" />
        </a>
        <a href="https://www.facebook.com/svgporn" target="_blank">
          <i className="i-facebook" />
        </a>
      </div>
      <div className="app__footer__github">
        <iframe
          title="star-count"
          src="https://ghbtns.com/github-btn.html?user=gilbarbara&repo=logos&type=star&count=true"
          frameBorder="0"
          scrolling="0" width="110px" height="20px"
        />
        <iframe
          title="follow-count"
          src="https://ghbtns.com/github-btn.html?user=gilbarbara&type=follow&count=true"
          frameBorder="0"
          scrolling="0" width="130px" height="20px"
        />
      </div>
    </div>
  </footer>
);

export default Footer;
