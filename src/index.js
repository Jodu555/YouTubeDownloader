const fs = require('fs');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
const cheerio = require('cheerio');


const API_URL = 'https://www.youtube.com/watch?v=';

downloadVideo('CppB6v12jls');

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
async function downloadVideo(ID) {
    const url = `${API_URL}${ID}`
    const title = await getVideoName(ID);
    ytdl(url).pipe(fs.createWriteStream('video' + '.mp4'));
    console.log('Downloaded Video: \'' + title + '\'');
}

