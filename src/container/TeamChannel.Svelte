<script>
        import { onMount,beforeUpdate } from 'svelte';
        import MessageLoader from '../Components/MessageLoader.svelte';
        import SideBar from '../container/SideBar.svelte';
        import SendMessage from '../container/SendMessage.svelte';
        import MessageArea from '../container/MessageArea.svelte';
        import IconButton from '@smui/icon-button'
        import Queries from '../Query/index.js';
        import { getClient, query } from 'svelte-apollo'; 
        import jwt_decode from 'jwt-decode';
        const client= getClient();
    
        export let teamId=undefined;
        export let channelId=undefined;
        export let layout;
        console.log("Team Id and acahannel Id",teamId,channelId);
        let team,channel=[];
        let teams;
        let loaderTeamHeight,loaderTeamWidth,loaderChannelHeight,loaderChannelWidth,messageContainer; 
    
     
       const allTeams=query(client,{query:Queries.teams,
        fetchPolicy: 'network-only',
    });
       const token= localStorage.getItem('token');
       const {user:{username}}=jwt_decode(token);
       let teamIndex, channelIndex;
       let modal=false;
       $: $allTeams.then(result=> {
             console.log(result);
             if(!result.loading) {
              teams=[...result.data.allTeams,...result.data.otherTeams];  
              getCurrentData();
              }
         });  
         
         const getCurrentData=()=>{
                 console.log("getCurrentData")
            const teamIndex=teamId!=undefined ? teams.findIndex(team=>team.id==teamId):0; 
              team=teams[teamIndex];
              channel=channelId==undefined || channelId=="" ? team.channels[0]: team.channels[team.channels.findIndex(channel=>channel.id==channelId)];  
         }
    
    
       allTeams.subscribeToMore({
          document:Queries.newTeamSubscription,
          updateQuery:(prev,{subscriptionData})=>{
           console.log("got subscription Data",subscriptionData,prev)
            if(!subscriptionData) {
              return prev;
            }
            const newFeedItem = subscriptionData.data.newTeamMessage;
            console.log(newFeedItem);
            if(newFeedItem.owner.id === team.owner.id)
            return Object.assign({}, prev, {
                    otherTeams : [ ...prev.otherTeams,newFeedItem],
                });
          }
        });
    
         beforeUpdate(()=>{
             if(team)
                getCurrentData();
         })
    
    
    
        onMount(()=>{
             loaderTeamHeight= document.getElementById("team").offsetHeight;
              loaderTeamWidth=document.getElementById("team").offsetWidth-10;
              loaderChannelHeight= document.getElementById("channel").offsetHeight;
             loaderChannelWidth=document.getElementById("channel").offsetWidth-10;
        });

        function autoScrollEnabled() {
            console.log("Invoked autoScrollEnabled");
            messageContainer.scrollTo(0,messageContainer.scrollHeight);
        }

    </script>

<div class="app-layout">
        {#await $allTeams}  
        <div class="team" id="team">
            <MessageLoader loaderHeight={loaderTeamHeight} loaderWidth={loaderTeamWidth}/>
        </div>
        <div class="channel" id="channel">
            <MessageLoader loaderHeight={loaderChannelHeight} loaderWidth={loaderChannelWidth}/>
        </div>
        {:then result} 
        <SideBar listOfTeams={teams} {team}  {username} {layout}/>
        <div class="message-container" bind:this={messageContainer}>
        <div class="header">
            <div>#{channel.name}</div>
            <div>
                <IconButton class="material-icons">video_call</IconButton>
                <IconButton class="material-icons">call</IconButton>
                <IconButton class="material-icons">screen_share</IconButton>
                <IconButton class="material-icons">create</IconButton>
            </div>
        </div>
            <div class="message" id="message">
                <MessageArea currentChannel={channel} on:autoScrollEnabled={autoScrollEnabled}/>
            </div>
        </div>
    <SendMessage currentChannel={channel} {layout}/>
        {:catch error}
            <p>Facing Some Issue While Loading Teams</p>         
            {/await}
</div>