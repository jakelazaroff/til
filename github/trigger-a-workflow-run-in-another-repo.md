# Trigger a workflow run in another repo

This is kind of meta: I made a separate repo [`todayilearned`](https://github.com/jakelazaroff/todayilearned) with the website for the content in this repo, and I wanted to trigger a new deploy whenever I pushed a new TIL.

The TL;DR is that there needs to be a GitHub Actions workflow in each repo: one in the "source" to send a [`repository_dispatch` event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch) to the "destination", and one in the destination to do the actual building/deploying/what have you.

I'm sure this has been written in a zillion different places, but it took me a bit of searching to figure out so here goes:

1. Modify the destination repo's workflow YAML file to run the workflow on `repository_dispatch` events:

   ```yaml
   on:
     push:
       branches: [main]
     repository_dispatch: # this line tells the workflow to run on `repository_dispatch` events
       types: [deploy] # this tells what event types should trigger a workflow run; if it's omitted, it'll just run on every event
   ```

2. Create a [Personal Access Token](https://github.com/settings/tokens?type=beta).

   - The new fine-grained tokens require an expiration date with a max of two years, at which point I'll definitely have forgotten about all this. But luckily I'll be able to refer back to this TIL to figure it out again!
   - The only repository access needed is the destination (i.e. the one receiving the event).
   - The only required permissions are read and write access for `content` (which covers the dispatch event) and `metadata` (which I think is mandatory for all personal access tokens).

3. At this point, you can test things out manually with a cURL (replace `PERSONAL_ACCESS_TOKEN`, `USER` and `REPO` with the appropriate values):

   ```bash
   curl --request POST \
    -H "Accept: application/vnd.github.everest-preview+json" \
    -H "Authorization: token PERSONAL_ACCESS_TOKEN" \
    --data '{ "event_type": "deploy" }' https://api.github.com/repos/USER/REPO/dispatches
   ```

   If things are set up correctly, this should trigger a workflow run.

4. Add the personal access token in the Actions secrets settings of the source repo.
5. Add a workflow YAML file to the source repo that runs the cURL command above:

   ```yaml
   name: Deploy
   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Dispatch to workflows
           run: |
             curl -H "Accept: application/vnd.github.everest-preview+json" \
             -H "Authorization: token ${{ secrets.PERSONAL_ACCESS_TOKEN }}" \
             --request POST \
             --data '{ "event_type": "deploy" }' https://api.github.com/repos/USER/REPO/dispatches
   ```
