<script>
  import List, { Group, Item,Text,PrimaryText,SecondaryText,Graphic } from "@smui/list";
  import {getClient, query } from 'svelte-apollo';
  import { onMount, createEventDispatcher } from  'svelte';
  import MessageLoader from '../Components/MessageLoader.svelte';
  import Queries from '../Query/index.js';
  export let currentChannel;
  export let autoScroll;
  const client= getClient();
  const dispatch = createEventDispatcher();

  $: allMessages=query(client,{
        query:Queries.allMessages,
        variables:{
            channelId:currentChannel.id,
        },
        fetchPolicy: 'network-only',
      });
  let loaderHeight,loaderWidth;
 
   $: $allMessages.then(result=>{
       console.log("Got the subsccription",result);
   })

   $: allMessages.subscribeToMore({
      document:Queries.newChannelMessageSubscription,
      variables:{
        channelId: currentChannel.id
      },
      updateQuery:(prev,{subscriptionData})=>{
       console.log("got subscription Data",subscriptionData,prev)
        if(!subscriptionData) {
          return prev;
        }
        const newFeedItem = subscriptionData.data.newChannelMessage;
    
        return Object.assign({}, prev, {
        allMessages : {
                message: [ ...prev.allMessages.message,newFeedItem],
                ok:true,
                __typename: "MessageResponse"
              }
            });
      }
    });
  onMount(()=>{
         loaderHeight= document.getElementById("message").offsetHeight;
         loaderWidth=document.getElementById("message").offsetWidth-150;
    });

    $: if(autoScroll!=undefined) {
      console.log("autoScroll");
      dispatch('autoScrollEnabled',true);
      autoScroll= false;
    }
</script>

{#await $allMessages}
<MessageLoader {loaderHeight} {loaderWidth}/>
{:then result}  
<Group>
        <List class="message-list" bind:this={autoScroll}>
                {#each result.data.allMessages.message as message (message.id)}
                <Item>
                    <Graphic class="message-graphic">{message.user.username.split(' ').map((val,index)=> {
                      if(index<=2) return val.substring(0,1)}).join('').toUpperCase()}</Graphic>
                    <Text class="text-message">
                      <PrimaryText class="text-primary-message">{message.user.username} <span class="created-at">{new Date(message.createdAt)}</span></PrimaryText>
                      <SecondaryText class="text-secondary-message">{message.text}</SecondaryText>
                    </Text>
                </Item>
                {:else}
                  <div class="noMessage">No Message Found</div>
                {/each}
        </List>
</Group>
{:catch error}
<p>Facing Some Issue While Loading Message</p>
{/await}

