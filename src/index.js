const fs = require('fs');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { exit } = require('process');

const API_URL = 'https://www.youtube.com/watch?v=';
const output = 'downloads/'

downloadVideo('8zpb-0_HxnQ');



// console.time('download')



// JSON.parse(fs.readFileSync('./abgeChunk.json')).forEach(async video => {
//     // console.log(video);
//     try {
//         const id = video.snippet.resourceId.videoId;
//         let title = video.snippet.fileFriendlyTitle.replaceAll(' ', '_');
//         const thumbnail = video.snippet.thumbnails[Object.keys(video.snippet.thumbnails)[Object.keys(video.snippet.thumbnails).length - 1]];
//         const description = video.snippet.description;
//         // console.log(await getVideoName(id));
//         try {
//             fs.mkdirSync(output + title + '/');
//         } catch (error) {
//             if (error.stack.includes('file already exists')) {
//                 title = title += '#' + Math.floor(Math.random() * 100);
//                 fs.mkdirSync(output + title + '/');
//             }
//         }
//         await downloadVideo(id, title);
//         fs.writeFileSync(output + title + '/' + 'info.json', JSON.stringify(video, null, 3));
//         const response = await fetch(thumbnail.url);
//         await response.body.pipe(fs.createWriteStream(output + title + '/thumbnail.png'))

//     } catch (error) {
//         console.error(error);
//         exit();
//     }

// });

// console.timeEnd('download');

async function downloadVideo(ID, name) {
    try {
        const url = `${API_URL}${ID}`
        let title = name;
        if (!title)
            title = await getVideoName(ID);
        if (!title)
            title = ID;
        await ytdl(url).pipe(fs.createWriteStream(output + '/' + ID + '.mp4'));
        // await ytdl(url).pipe(fs.createWriteStream(output + ID + '/' + 'video.mp4'));
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
            title = $('title').html();
        });
    return title;
}