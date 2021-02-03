<script>
  import List, { Item, Text } from "@smui/list";
  import IconButton from '@smui/icon-button';
  import  AddChannel from './AddChannel.svelte';
  import  AddMember from './AddMember.svelte';
  import Notification from "../Components/Notification.svelte";
  import { isLoggedIn } from '../utlis.js';
  import { Link } from 'svelte-routing';

  let selectionTwoLine = "";
  export let currentTeam;
  let modal=false;
  let modalName=null;
  const userId=isLoggedIn();
  console.log("UserId owner",userId);
  function handleModal(e) {
      console.log("hancledefcdsccf");
        modal=e.detail.close ? false:true;
        if(e.target)
            modalName=e.target.name;
  }
  export let listOfChannels = [];
</script>
 <div class="relative">
        <!-- <Notification/> -->
     </div>
<div class="header-title text-align-left">Channels 
    <span class="align-middle">
       {#if userId.user.id == currentTeam.owner.id }
        <IconButton class="material-icons" name="channel" on:click={handleModal}>add_circle</IconButton>
        {/if}
    </span>
</div>
<List class="channel-list" twoLine avatarList singleSelection>
   {#each listOfChannels as item (item.id)}
   <Link to={`view-team/${currentTeam.id}/${item.id}`}>
  <Item>
    <Text>{item.name}</Text>
  </Item>
  </Link>
 {/each}
</List>
<div class="header-title text-align-left">Add Member
    <span class="align-middle">
       <IconButton class="material-icons" name="add_member" on:click={handleModal}>add_circle</IconButton>
    </span>
</div>
{#if !!modalName}
{#if modalName=="add_member"}
 <AddMember  {modal} on:modalClose={handleModal} teamId={currentTeam.id}/>
{:else}
    <AddChannel {modal} on:modalClose={handleModal} currentTeam={currentTeam}/>
{/if}
{/if}
