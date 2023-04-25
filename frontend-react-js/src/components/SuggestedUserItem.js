import './SuggestedUserItem.css';
import React from 'react';
import ReactDOM from 'react-dom';

export default function SugestedUserItem(props) {
  return (
    <div className="user">
      <div className='avatar'></div>
      <div className='identity'>
        <span className="display_name">{props.display_name}</span>
        <span className="handle">@{props.handle}</span>
      </div>
    </div>
  );
}