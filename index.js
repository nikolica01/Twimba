import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref , push , onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appsettings={
    databaseURL:"https://twimba-8db0a-default-rtdb.europe-west1.firebasedatabase.app/"
}
const app = initializeApp(appsettings)
const database = getDatabase(app)
const TwimbainDb = ref (database,"twimba-replays")
const LikesInDB =ref(database,"likes")
console.log(TwimbainDb)

console.log(initializeApp)
document.addEventListener('click',function(e){
    if(e.target.dataset.like){
        handleLike(e.target.dataset.like);}
        else if (e.target.dataset.retweet){
            handleRetweet(e.target.dataset.retweet);
        }
        else if(e.target.id === 'tweet-button'){
            handleclickBtn()
        }
})
function handleRetweet(tweetId){
    const tweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0];
    if (tweetObj.isRetweeted){
        tweetObj.retweets--;
    }else{
        tweetObj.retweets++;
    }
    tweetObj.isRetweeted=!tweetObj.isRetweeted;
    renderFeed();
}
function handleLike(tweetId){
    console.log(tweetId)
    const twetObj=tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId;
    })[0];  
    if(twetObj.isLiked){
        twetObj.likes--;
    }
    else{
        twetObj.likes++;
    }
    twetObj.isLiked=!twetObj.isLiked;
    localStorage.setItem('tweetsData',JSON.stringify(tweetsData))
  renderFeed(); 
}
function handleclickBtn(){
   let valueInput=document.getElementById('tweet-input')
   if(valueInput.value){
    push(TwimbainDb,valueInput.value)
    tweetsData.unshift({
        handle:`@Scrimba`,
        profilePic:`images/ekko.jpg`,
        likes:0,
        retweets:0,
        tweetText:valueInput.value,
        isLiked:false,
        isRetweeted:false,
        uuid:uuidv4()

    })
    document.addEventListener("dblclick",function(e){
    console.log(e.target.id)
    })
   }
   valueInput.value=""
    renderFeed();
}

function getFeedHtml(){
    let getFeedHtml=""
    tweetsData.forEach(function(tweet){
        let heartstyle="";
        if(tweet.isLiked){
            heartstyle="redic";
        }
        let retweetstyle="";
        if(tweet.isRetweeted){
            retweetstyle="green";
        }
        getFeedHtml+=`       
         <div class="tmp">
        <img src="${tweet.profilePic}" alt="profile picture" class="profile-pic">
        <div class="tweet">
         <p>${tweet.handle}</p>
         <p>${tweet.tweetText}</p>
        </div>
    </div>
    <div class="tweet-details">
            <span class="tweet-detail">
            <i class="fa-regular fa-heart ${heartstyle}" data-like="${tweet.uuid}"></i>
            ${tweet.likes}</span>
            <span  class="tweet-detail">
            <i class="fa-solid fa-retweet ${retweetstyle}" data-retweet="${tweet.uuid}"></i>
            ${tweet.retweets}</span>
            <span class="tweet-detail">
            <i class="fa-regular fa-comment" data-comment="${tweet.uuid}">
            </i>
            
            </span>
        </div>
</div>`})
return getFeedHtml;

}

function renderFeed(){
    document.getElementById('feed').innerHTML=getFeedHtml();
}
renderFeed()
