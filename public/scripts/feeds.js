function loadFeeds(feeds)
{
    for (let i in feeds.feed.entry) {
        let entry = feeds.feed.entry[i];
        let title = entry.title.$t;
        let content = entry.content.$t;
        let postUrl;
        for (let l in entry.link) {
            if (entry.link[l].rel === "alternate" && entry.link[l].type === "text/html") {
                postUrl = entry.link[l].href;
                break;
            }
        }
        let thumbnail = entry.media$thumbnail.url.replace(/\/s72\-c/, '');

        // TODO Vue render function load
        console.dir(entry);
        console.log("title = " + title);
        console.log("postUrl = " + postUrl);
        console.log("content = " + content);
        console.log("thumbnail = " + thumbnail);
    }

}

