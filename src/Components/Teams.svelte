<script>
    import { Link } from 'svelte-routing';
    import List, {Group, Item, Graphic, Meta, Label} from '@smui/list';
    import Paper, {Title} from '@smui/paper';
    let selectionTwoLine = '';
    export let listOfTeams=[];
</script>
<Paper square class="team-title">
        <Title>Teams</Title>
</Paper>
<List class="team-list" twoLine avatarList singleSelection>
        {#each listOfTeams as item}
          <Link to={`view-team/${item.id}`}>
            <Item on:SMUI:action={() => selectionTwoLine = item.name} disabled={item.disabled} selected={selectionTwoLine === item.name}>
            <Graphic class="team-graphic">{item.name.split(' ').map(val=> val.substring(0,1)).join('').substring(0,2).toUpperCase()}</Graphic>
          </Item>
        </Link>
        {/each}
</List>    