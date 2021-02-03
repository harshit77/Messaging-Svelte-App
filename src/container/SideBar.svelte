<script>
   import Teams from '../Components/Teams.svelte';
   import Channel from '../Components/Channel.svelte';
   import CreateTeam from '../Components/CreateTeam.svelte';
   import MessageLoader from '../Components/MessageLoader.svelte';
   import { onMount, createEventDispatcher } from 'svelte';
   import { Link } from 'svelte-routing';
   import IconButton from '@smui/icon-button';
   import Notification from "../Components/Notification.svelte";
   import Users from '../Components/Users.svelte';
    const dispatch = createEventDispatcher();

   export let listOfTeams;   
   export let team;
   export let username; 
   export let layout;
   export let currentUser;
   let modal=false;
  function handleTeamModal(e) {
      console.log("handleTeamModal",e.detail.close )
      modal=e.detail.close ? false:true;
  }
</script>

<!-- <Notification/> -->
{#if layout== "Teams"}
<div class="team" id="team">
   <Teams {listOfTeams}/>
</div>
<div class="text-center createTeam flexCenter">
    <span class="align-middle">
            <IconButton class="material-icons" on:click={handleTeamModal}>add_circle</IconButton>
    </span>
</div>
<div class="channel" id="channel"> 
        <div class="header-title text-align-left font-semi-bold">{username}
            <div class="sub-header-title no-space text-align-left font-semi-bold">{team.name}</div>
        </div>
    
     <Channel listOfChannels={team.channels} currentTeam={team}/>
    
</div>
{#if modal}
<CreateTeam {modal} on:forwarded={handleTeamModal}/>
{/if}
{:else}
<div class="userBoard" id="userBoard">
    <Users users={listOfTeams} {currentUser}/>
</div>
{/if}