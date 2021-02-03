<script>
        import List, { Group, Item,Text,PrimaryText,SecondaryText,Graphic } from "@smui/list";
        import {getClient, query } from 'svelte-apollo';
        import { onMount } from  'svelte';
        import MessageLoader from '../Components/MessageLoader.svelte';
        import Queries from '../Query/index.js';
        export let currentUser;
        export let sender;
        const client= getClient();
        let loaderHeight,loaderWidth;
        
        $: allUserMessages=query(client,{
              query:Queries.getAllUserMessageById,
              variables:{
                receiverId:parseInt(currentUser.id),
              },
              fetchPolicy: 'network-only',
            });
            $: $allUserMessages.then(result=>{
       console.log("Got the subsccription",result);
   })

      
         $: allUserMessages.subscribeToMore({
            document:Queries.newUserMessageSubscription,
            variables:{
              receiverId: parseInt(currentUser.id)
            },
            updateQuery:(prev,{subscriptionData})=>{
             console.log("got subscription Data",subscriptionData,prev)
              if(!subscriptionData) {
                return prev;
              }
              const newFeedItem = subscriptionData.data.newUserMessage;
          
              return Object.assign({}, prev, {
                getAllUserMessageById :{
                 message:[ ...prev.getAllUserMessageById.message,newFeedItem],
                 ok:true,
                 __typename: "CreateuserTouserMessageResponse"
                }
                  });
            }
          });
        onMount(()=>{
               loaderHeight= document.getElementById("message").offsetHeight;
               loaderWidth=document.getElementById("message").offsetWidth-150;
          });
      </script>
      
      {#await $allUserMessages}
      <MessageLoader {loaderHeight} {loaderWidth}/>
      {:then result}  
      <Group>
              <List class="message-list">
                      {#each result.data.getAllUserMessageById.message as message (message.id)}
                      <Item>
                          {#if currentUser.id  == message.senderId}
                          <Graphic class="message-graphic">{currentUser.username.split(' ').map((val,index)=> {
                            if(index<=2) return val.substring(0,1)}).join('').toUpperCase()}</Graphic>
                            {:else}
                            <Graphic class="message-graphic">{sender.username.split(' ').map((val,index)=> {
                                    if(index<=2) return val.substring(0,1)}).join('').toUpperCase()}</Graphic>
                          {/if}  
                          <Text class="text-message">
                                {#if currentUser.id == message.senderId}
                                <PrimaryText class="text-primary-message">{currentUser.username} <span class="created-at">{new Date(message.createdAt)}</span></PrimaryText>
                                {:else}
                                <PrimaryText class="text-primary-message">{sender.username} <span class="created-at">{new Date(message.createdAt)}</span></PrimaryText>
                            {/if}
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
      
      