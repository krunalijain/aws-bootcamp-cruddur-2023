import {ReactComponent as HeartIcon} from './svg/heart.svg';
import React from 'react';
import ReactDOM from 'react-dom';

export default function ActivityActionLike(props) { 
  const onclick = (event) => {
    console.log('toggle like/unlike')
  }

  let counter;
  if (props.count > 0) {
    counter = <div className="counter">{props.count}</div>;
  }

  return (
    <div onClick={onclick} className="action activity_action_heart">
      <HeartIcon className='icon' />
      {counter}
    </div>
  )
}