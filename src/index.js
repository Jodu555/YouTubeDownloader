const fs = require('fs');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
const cheerio = require('cheerio');


const API_URL = 'https://www.youtube.com/watch?v=';

const video = JSON.parse(fs.readFileSync('./firsttest.json'))[0];
console.time('download')

JSON.parse(fs.readFileSync('./firsttest.json')).forEach(async video => {
    // console.log(video);
    const id = video.snippet.resourceId.videoId;
    const title = video.snippet.fileFriendlyTitle.replaceAll(' ', '_');
    const thumbnail = video.snippet.thumbnails[Object.keys(video.snippet.thumbnails)[Object.keys(video.snippet.thumbnails).length - 1]];
    const description = video.snippet.description;

    fs.mkdirSync('downloads/' + title + '/');
    await downloadVideo(id, title);
    fs.writeFileSync('downloads/' + title + '/' + 'info.json', JSON.stringify(video, null, 3));
    const response = await fetch(thumbnail.url);
    response.body.pipe(fs.createWriteStream('downloads/' + title + '/thumbnail.png'))
});

console.timeEnd('download');

async function downloadVideo(ID, name) {
    const url = `${API_URL}${ID}`
    let title = name;
    if (!title)
        title = await getVideoName(ID);

    ytdl(url).pipe(fs.createWriteStream('downloads/' + name + '/' + 'video.mp4'));
    console.log('Downloaded Video: \'' + title + '\'');
}


















async function getVideoName(ID) {
    const url = `${API_URL}${ID}`
    let title;
    await fetch(url)
        .then(res => res.text())
        .then(body => {
            const $ = cheerio.load(body);
            title = $('title').html().replace(' - YouTube', '');
        });
    return title;
}