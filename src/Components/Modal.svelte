<script>
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import {beforeUpdate, afterUpdate } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  let dialog;
  export let modal=false;
 const dispatch = createEventDispatcher();
  beforeUpdate(()=>{
      console.log("before MOdal changed",modal);
      modal && dialog!=undefined ? dialog.open():null;
  });
  afterUpdate(()=>{
      console.log("AfterMOdal changed",modal);
  });
  function closeHandler() {
    dispatch('modalClose',{close:true});
    console.log("Get that closeHandler")
  }
</script>

<Dialog bind:this={dialog} on:MDCDialog:closed={closeHandler}>
  <Title>
    <slot name="title">
    </slot>
  </Title>
  <Content id="dialog-content">
      <slot name='content'>
      </slot>
  </Content>
  <Actions>
      <slot name="actions">
      </slot>
  </Actions>
</Dialog>
