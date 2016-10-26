import React from 'react';
import { trackEvent } from '../../utils/helpers';

const imagePath = `${location.origin}/logos/`;
const onClickItem = e => {
  trackEvent('logo', 'click', e.currentTarget.dataset.shortname);
};

const Item = ({ data, handleClickTag, index }) => (
  <li>
    <a
      href={data.url}
      target="_blank"
      className="app__images__img"
      data-shortname={data.shortname}
      onClick={onClickItem}
    >
      <img src={`${imagePath}${data.files[index]}`} alt={data.name} className={data.shortname} />
    </a>

    <div className="app__images__info">
      <h5><a href={data.url} target="_blank">{data.name}</a></h5>

      <div className="app__images__tags">{
        data.tags.map((t, i) =>
          (<a key={i} href="#tag" onClick={handleClickTag} data-name={t}>{`#${t}`}</a>)
        )
      }</div>
      <div className="app__images__download">
        <a
          href={`${imagePath}${data.files[index]}`}
          className="btn btn-sm btn-outline-secondary btn-icon"
          download={true}
        >
          <i className="i-download" />
          <span>download</span>
        </a>
      </div>
    </div>
  </li>
);

Item.propTypes = {
  data: React.PropTypes.object.isRequired,
  handleClickTag: React.PropTypes.func.isRequired,
  index: React.PropTypes.number.isRequired,
};

export default Item;
