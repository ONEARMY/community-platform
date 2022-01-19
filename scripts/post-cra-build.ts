import * as fs from 'fs';
import * as fsExtra from 'fs-extra'
import * as path from 'path';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { _supportedConfigurationOptions } from '../src/config/constants';

dotenv.config({ path: path.resolve('../.env'), debug: true });

const builtHTML = fs.readFileSync('../build/index.html', { encoding: 'utf-8' });

const $ = cheerio.load(builtHTML, { recognizeSelfClosing: true });

/**
 *  A post build script that is run to:
 *  - Inject the installation configuration details
 *  - Customise the HTML shell to include installation details
 * 
 *  1. Load build/index.html the result of the CRA build scripts
 *  2. Load variables from process.ENV
 *  3. Write ENV vars into global window object
 *  4. SEO changes
 *    - Update <title> element
 *    - Update description elements
 *  5. Load assets into public/
 *    - favicon
 *    - og:url
 * 
 * */


// 3. Write ENV vars into global window object
$('script#CommunityPlatform').html(`window.__OA_COMMUNITY_PLATFORM_CONFIGURATION=${JSON.stringify(
    getWindowVariableObject()
)};`);


//  2. Load variables from process.ENV
function getWindowVariableObject() {
    const configurationObject = {};

    _supportedConfigurationOptions.forEach((variable: string) => {
        configurationObject[variable] = process.env[variable] || '';
    });

    if (_supportedConfigurationOptions.filter(v => !process.env[v]).length) {
        console.log(`The following properties were not found within the current environment:`)
        console.log(_supportedConfigurationOptions.filter(v => !process.env[v]).join('\n'))
    }

    return configurationObject;
}

// 4. SEO Changes
const siteName = process.env.SITE_NAME || 'Community Platform';
$('title').text(siteName)
$('meta[property="og:title"]').attr('content', siteName);
$('meta[name="twitter:title"]').attr('content', siteName);

const platformTheme = process.env.REACT_APP_PLATFORM_THEME;

if (platformTheme) {
    console.log(`Applying theme: ${platformTheme}`);
    console.log(`Copying src/assets/theme/${platformTheme}/public to build/`);
    fsExtra.copySync('../src/assets/images/themes/' + platformTheme + '/public', '../build');

    const siteDescription = platformTheme === 'precious-plastic'
        ? 'A series of tools for the Precious Plastic community to collaborate around the world. Connect, share and meet each other to tackle plastic waste.'
        : 'A platform for the Project Kamp community to collaborate around the world. Connect, share and meet each other to figure out how to live more sustainably'

    $('meta[property="og:description"]').attr('content', siteDescription);
    $('meta[property="twitter:description"]').attr('content', siteDescription);
    $('meta[name="description"]').attr('content', siteDescription);
}


const output = $.html();

console.log(`Persisting configuration and HTML updates back to ../build/index.html`);
fs.writeFileSync('../build/index.html', output, { encoding: 'utf-8' });
