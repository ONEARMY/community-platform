"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
const project_kamp_header_png_1 = __importDefault(require("../../assets/images/themes/project-kamp/project-kamp-header.png"));
const avatar_member_sm_svg_1 = __importDefault(require("../../assets/images/themes/project-kamp/avatar_member_sm.svg"));
const avatar_space_sm_svg_1 = __importDefault(require("../../assets/images/themes/project-kamp/avatar_space_sm.svg"));
const styles_1 = require("./styles");
exports.Theme = {
    id: 'project-kamp',
    siteName: 'Project Kamp',
    logo: project_kamp_header_png_1.default,
    badge: avatar_member_sm_svg_1.default,
    avatar: avatar_space_sm_svg_1.default,
    howtoHeading: `Learn & share how to recycle, build and work`,
    styles: styles_1.StyledComponentTheme,
    academyResource: 'https://project-kamp-academy.netlify.app/',
    externalLinks: [
        {
            url: 'https://projectkamp.com/support.html',
            label: 'Support Us',
        },
        {
            url: 'https://projectkamp.com/',
            label: 'Project Homepage',
        },
    ],
};
