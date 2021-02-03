<script>
    import Dropzone from 'svelte-file-dropzone';
    import Queries from '../Query/index.js';
    import {getClient, mutate } from 'svelte-apollo'; 
    import IconButton from '@smui/icon-button';
    let file = {
    accepted: [],
    rejected: []
  };
  const client= getClient();
  export let accept="image/*";
  export let disableDefaultStyles=true;
  export let containerClasses= "containerClasses";

  function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    file.accepted = [...file.accepted, ...acceptedFiles];
    file.rejected = [...file.rejected, ...fileRejections];
    console.log("Vsdvds",file);
    mutate(client,{
        mutation: Queries.upload,
        variables: { file }
    });
  }
</script>

<Dropzone on:drop={handleFilesSelect} accept={accept} containerClasses={containerClasses} disableDefaultStyles={disableDefaultStyles}>
    <IconButton class="material-icons">add_circle</IconButton>
</Dropzone>


