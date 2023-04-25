import './Search.css';
import React from 'react';
import ReactDOM from 'react-dom';

export default function ActivityFeed(props) {
  return (
    <div className='search_field'>
      <input type='text' placeholder='Search Cruddur' />
    </div>
  );
}