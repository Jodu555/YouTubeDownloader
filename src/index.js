const fs = require('fs');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { exit } = require('process');


const API_URL = 'https://www.youtube.com/watch?v=';

console.time('download')

JSON.parse(fs.readFileSync('./abge.json')).forEach(async video => {
    // console.log(video);
    try {
        const id = video.snippet.resourceId.videoId;
        const title = video.snippet.fileFriendlyTitle.replaceAll(' ', '_');
        const thumbnail = video.snippet.thumbnails[Object.keys(video.snippet.thumbnails)[Object.keys(video.snippet.thumbnails).length - 1]];
        const description = video.snippet.description;

        // console.log(await getVideoName(id));
        fs.mkdirSync('downloads/' + title + '/');
        await downloadVideo(id, title);
        fs.writeFileSync('downloads/' + title + '/' + 'info.json', JSON.stringify(video, null, 3));
        const response = await fetch(thumbnail.url);
        response.body.pipe(fs.createWriteStream('downloads/' + title + '/thumbnail.png'))
    } catch (error) {
        console.error(error);
        exit();
    }
});

console.timeEnd('download');

async function downloadVideo(ID, name) {
    try {
        const url = `${API_URL}${ID}`
        let title = name;
        if (!title)
            title = await getVideoName(ID);
        await ytdl(url).pipe(fs.createWriteStream('downloads/' + name + '/' + 'video.mp4'));
        console.log('Downloaded Video: \'' + title + '\' ' + ID + '');
    } catch (error) {
        console.log(ID, name);
        throw error;
    }

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