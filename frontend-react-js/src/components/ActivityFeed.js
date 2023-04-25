import './ActivityFeed.css';
import ActivityItem from './ActivityItem';
import React from 'react';
import ReactDOM from 'react-dom';

export default function ActivityFeed(props) {
  return (
    <div className='activity_feed_collection'>
    {props.activities && Array.isArray(props.activities) && props.activities.map(activity => {
    return  <ActivityItem setReplyActivity={props.setReplyActivity} setPopped={props.setPopped} key={activity.uuid} activity={activity} />
    })}
  </div>
);
}