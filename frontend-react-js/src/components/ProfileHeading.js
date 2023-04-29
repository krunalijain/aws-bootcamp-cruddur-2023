import './ProfileHeading.css';
import EditProfileButton from '../components/EditProfileButton';
import React from 'react';
import ReactDOM from 'react-dom';

export default function ProfileHeading(props) {
  const backgroundImage = 'url("https://assets.iamdevopsgeek.cloud/banners/banner.jpg")';
  const styles = {
    backgroundImage: backgroundImage,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  return (
  <div className='activity_feed_heading profile_heading'>
    <div className='title'>{props.profile.display_name}</div>
    <div className="cruds_count">{props.profile.cruds_count} Cruds</div>
    <div className="banner" style={styles} >
      <div className="avatar">
        <img src="https://assets.iamdevopsgeek.cloud/avatars/processed/data.jpg"></img>
      </div>
    </div>
    <div class="info">
      <div class='id'>
        <div className="display_name">{props.profile.display_name}</div>
        <div className="handle">@{props.profile.handle}</div>
      </div>
      <EditProfileButton setPopped={props.setPopped} />
    </div>
    <div class="bio">{props.profile.bio}</div>

  </div>
  );
}