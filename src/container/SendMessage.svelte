<script>
  import Textfield from "@smui/textfield";
  import FileUpload from './FileUpload.svelte'
  import Queries from '../Query/index.js';
  import jwt_decode from 'jwt-decode';
  import {getClient, mutate} from 'svelte-apollo';
  import { danger, success } from "../store/notificationStore.js"

  export let valueFullwidth = "";
  export let currentChannel;
  export let layout;
console.log("currentChannel",currentChannel);

  const client=getClient();

  const handleSendMessage = (e) => {
      if(e.keyCode === 13) {
        sendMessage(valueFullwidth);
        valueFullwidth='';
      }
  };
  const handleSendDirectMessage = (e) => {
      if(e.keyCode === 13) {
        sendDirectMessage(valueFullwidth);
        valueFullwidth='';
      }
  };

  const sendMessage=(sendvalue) =>{
      console.log(currentChannel);
       mutate(client,{
                mutation:Queries.createMessage,
                variables:{
                    channelId:currentChannel.id,
                    text: sendvalue
                },
            }).then((res)=>{
                console.log("We got the data",res);
                const { ok }= res.data.createMessage;
                if(ok) {
                   console.log('Member added succesfully');
                   const token=localStorage.getItem('token');
                   const {user:{username}}=jwt_decode(token);
                    success(`Message  sent successfully by ${username} `,10000);
       
                } else {
                    danger(res.data.createMember.errors[0].message,10000);
                } 
              
            }).catch(error=>{
                danger("Exception Occurred",10000);
            });
        }

        const sendDirectMessage=(sendvalue)=>{
          console.log("sendDirectMessage",currentChannel,sendvalue);
          mutate(client,{
                mutation:Queries.createuserTouserMessage,
                variables:{
                    receiverId:parseInt(currentChannel.id),
                    text: sendvalue
                },
            }).then((res)=>{
                console.log("We got the data",res);
                const { ok,message }= res.data.createuserTouserMessage;
                if(ok) {
                   const token=localStorage.getItem('token');
                   const {user:{username}}=jwt_decode(token);
                    success(`Message  sent successfully to ${message[0].receiverId} by ${username} `,10000);
       
                } else {
                    danger(res.data.createuserTouserMessage.errors[0].message,10000);
                } 
              
            }).catch(error=>{
              console.log("Error",error)
                danger("Exception Occurred",10000);
            });
        }
</script>

<style>
.FileUploadSection {
    display: grid;
    grid-template-columns: 3% 97%;
}
</style>

<div class="input">
    <div class="FileUploadSection">
    <FileUpload containerClasses="spacingTopMedium"/>
    {#if layout== "Teams"}
        <Textfield fullwidth lineRipple={false} bind:value={valueFullwidth} class="containerClasses"
        on:keyup={handleSendMessage} label={`#${currentChannel.name}`}
        input$aria-controls="helper-text-fullwidth"
        input$aria-describedby="helper-text-fullwidth" />
        {:else}
        <Textfield fullwidth lineRipple={false} bind:value={valueFullwidth} class="containerClasses"
        on:keyup={handleSendDirectMessage} label={`#${currentChannel.username}`}
        input$aria-controls="helper-text-fullwidth"
        input$aria-describedby="helper-text-fullwidth" />
        {/if}
    </div>
</div>
