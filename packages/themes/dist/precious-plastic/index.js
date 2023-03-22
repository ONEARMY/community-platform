"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
const precious_plastic_logo_official_svg_1 = __importDefault(require("../../assets/images/precious-plastic-logo-official.svg"));
const avatar_member_sm_svg_1 = __importDefault(require("../../assets/images/themes/precious-plastic/avatar_member_sm.svg"));
const styles_1 = require("./styles");
exports.Theme = {
    id: 'precious-plastic',
    siteName: 'Precious Plastic',
    logo: precious_plastic_logo_official_svg_1.default,
    badge: avatar_member_sm_svg_1.default,
    avatar: '',
    howtoHeading: `Learn & share how to recycle, build and work with plastic`,
    styles: styles_1.styles,
    academyResource: 'https://onearmy.github.io/academy/',
    externalLinks: [
        {
            url: 'https://bazar.preciousplastic.com/',
            label: 'Bazar',
        },
        {
            url: 'https://preciousplastic.com/',
            label: 'Global Site',
        },
    ],
};
