<script>
    import { onMount,beforeUpdate } from 'svelte';
    import MessageLoader from '../Components/MessageLoader.svelte';
    import SideBar from '../container/SideBar.svelte';
    import SendMessage from '../container/SendMessage.svelte';
    import MessageArea from '../container/MessageArea.svelte';
    import MessageUserArea from '../container/MessageUserArea.svelte';
    import Queries from '../Query/index.js';
    import { getClient, query } from 'svelte-apollo'; 
    import jwt_decode from 'jwt-decode';
    const client= getClient();

    export let layout;
    export let userId=undefined;
    console.log("userID",userId);
    let users,currentUser;
    let loaderUserHeight,loaderUserWidth;

 
   const allUser=query(client,{query:Queries.getAllUsers,
    fetchPolicy: 'network-only',
});
   const token= localStorage.getItem('token');
   const {user}=jwt_decode(token);
   console.log("User data",user);
   let modal=false;
   $: $allUser.then(result=> {
         console.log(result);
         if(!result.loading) {
          users=result.data.getAllUsers;  
         getCurrentData();
          }
     });  

     const getCurrentData=()=>{
                 console.log("getCurrentData")
                 const userIndex=userId !=undefined && userId!="" ? users.findIndex(user=>user.id==userId):0; 
           currentUser=users[userIndex];
           console.log("currentUser",userId,currentUser);
         }


         beforeUpdate(()=>{
             if(users)
                getCurrentData();
         })
     
    //  const getCurrentData=()=>{
    //          console.log("getCurrentData")
    //     const teamIndex=teamId!=undefined ? teams.findIndex(team=>team.id==teamId):0; 
    //       team=teams[teamIndex];
    //       channel=channelId==undefined || channelId=="" ? team.channels[0]: team.channels[team.channels.findIndex(channel=>channel.id==channelId)];  
    //  }


//    allTeams.subscribeToMore({
//       document:Queries.newTeamSubscription,
//       updateQuery:(prev,{subscriptionData})=>{
//        console.log("got subscription Data",subscriptionData,prev)
//         if(!subscriptionData) {
//           return prev;
//         }
//         const newFeedItem = subscriptionData.data.newTeamMessage;
//         console.log(newFeedItem);
//         if(newFeedItem.owner.id === team.owner.id)
//         return Object.assign({}, prev, {
//                 otherTeams : [ ...prev.otherTeams,newFeedItem],
//             });
//       }
//     });

//      beforeUpdate(()=>{
//          if(team)
//             getCurrentData();
//      })



    onMount(()=>{
         loaderUserHeight= document.getElementById("userBoard").offsetHeight;
          loaderUserWidth=document.getElementById("userBoard").offsetWidth-10;
    });
</script>

<div class="app-layout-user">
    {#await $allUser}  
    <div class="userBoard" id="userBoard">
        <MessageLoader loaderHeight={loaderUserHeight} loaderWidth={loaderUserWidth}/>
    </div>
    {:then result} 
    <SideBar listOfTeams={users} username={user.username} {layout} {currentUser}/>
    <div class="message-container-user">
    <div class="header">#User</div>
        <div class="message" id="message">
            <MessageUserArea sender={user} {currentUser}/>
        </div>
    </div>
<SendMessage currentChannel={currentUser} {layout}/>
    {:catch error}
        <p>Facing Some Issue While Loading Teams</p>         
        {/await}
</div>