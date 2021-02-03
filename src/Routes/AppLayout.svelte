<script>
    import TeamChannel from '../container/TeamChannel.svelte';
    import DirectMessage from '../container/DirectMessage.svelte';
    import UpperBar from  '../container/UpperBar.svelte';
    export let teamId=undefined;
    export let channelId=undefined;
    export let userId=undefined;
    const activityList=[{
      name:'Teams',
      type:'people',
      disabled:false,
      component:'TeamChannel'
        },{
            name:'Chat',
            type:'chat',
            disabled:false,
            component:'DirectMessage'
        }];
        
   $: selectedOption=userId==undefined ? activityList[0].name: activityList[1].name;
   $:  console.log(`the count is ${userId}`);
   </script>


    <div class="upperbar">
        <UpperBar {activityList} selectedActivity={selectedOption}/>
    </div>   

{#if selectedOption == "Teams"}
    <TeamChannel {teamId} {channelId} layout={selectedOption}/>
    {:else}
    <DirectMessage {userId} layout={selectedOption} />
{/if}

