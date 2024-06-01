import React, { useEffect, useState } from 'react'
import "./playvideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
// import jack from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import { API_KEY, valueConverter } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';




const PlayVideo = () => {

    const {videoId} = useParams();
    
    const [apiData,setApiData] = useState(null);
    const [channelData,setChannelData] = useState(null);
    const [commentData,setCommentData] = useState([]);

    const fetchVideoData = async () => {
        const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        await fetch(videoDetailsUrl).then(response => response.json()).then(data => setApiData(data.items[0]));
    }

    const fetchChannelData = async () => {
        const channelDataUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        await fetch(channelDataUrl).then(response => response.json()).then(data => setChannelData(data.items[0]));
    }

    const fetchCommentData = async () => {
        const commentDataUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`;
        await fetch(commentDataUrl).then(response => response.json()).then(data => setCommentData(data.items));
    }
    useEffect(() => {
        fetchVideoData();
    },[videoId]);

    useEffect(() => {
        if (apiData) {
            fetchChannelData(apiData.snippet.channelId);
        }
    },[apiData]);

    useEffect(() => {
        fetchCommentData();
    },[commentData]);

  return (
    <div className='play-video'>
      <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} autoPlay frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
      <div className="play-video-info">
        <p>{apiData?valueConverter(apiData.statistics.viewCount):"16k"} views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : "Loading..."}</p>
        <div>
            <span><img src={like} alt="like" /> {apiData?valueConverter(apiData.statistics.likeCount):"155"}</span>
            <span><img src={dislike} alt="like" /> </span>
            <span><img src={share} alt="like" /> Share</span>
            <span><img src={save} alt="like" />Save</span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="jack" />
        <div>
            <p>{apiData?apiData.snippet.title:""}</p>
            <span>{channelData ? valueConverter(channelData.statistics.subscriberCount) : ""} Subscribers</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData?apiData.snippet.description.slice(0,250):"Loading..."}</p>
        <hr/>
        <h4>{apiData?valueConverter(apiData.statistics.commentCount):"102"} Comments</h4>
        {commentData.map((item,index) => {
            return (
                <div className='comment' key={index}>
            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="user" />
            <div>
                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span></h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay.slice(0,150)}</p>
                <div className='comment-action'>
                    <img src={like} alt="like" />
                    <span>{valueConverter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                    <img src={dislike} alt="dislike" />
                    <span>43</span>
                </div>
            </div>
        </div>
            )
        })}
      </div>
    </div>
  )
}

export default PlayVideo
