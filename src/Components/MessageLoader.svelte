<script>
    import { beforeUpdate } from 'svelte';
    import ContentLoader from 'svelte-content-loader';
    export let loaderWidth='400';
    export let loaderHeight='400';
    let array=[];
    beforeUpdate(()=>{
        array= Array(loaderHeight).fill().map((_, i) => i+1);
        loaderWidth=loaderWidth;
    })
</script>
  
<ContentLoader width={loaderWidth} height={loaderHeight}>
    {#each array as rect,index}
        <rect x="0" y={rect*20} rx="3" ry="3" width={rect%2 ? loaderWidth : (loaderWidth/3)} height="10" />
    {/each}
</ContentLoader>
