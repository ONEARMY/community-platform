import * as fs from 'fs';
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
const output = $.html();

console.log(`Persisting configuration and HTML updates back to ../build/index.html`);
fs.writeFileSync('../build/index.html', output, { encoding: 'utf-8' });
