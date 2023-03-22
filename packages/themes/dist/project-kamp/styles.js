"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyledComponentTheme = exports.zIndex = exports.colors = void 0;
const avatar_member_sm_svg_1 = __importDefault(require("../../assets/images/themes/project-kamp/avatar_member_sm.svg"));
const avatar_member_lg_svg_1 = __importDefault(require("../../assets/images/themes/project-kamp/avatar_member_lg.svg"));
const project_kamp_header_png_1 = __importDefault(require("../../assets/images/themes/project-kamp/project-kamp-header.png"));
const button_1 = require("../common/button");
// use enum to specify list of possible colors for typing
exports.colors = {
    white: 'white',
    offwhite: '#ececec',
    black: '#1b1b1b',
    primary: 'green',
    softyellow: '#f5ede2',
    yellow: { base: '#8ab57f', hover: 'hsl(108, 25%, 68%)' },
    blue: '#83ceeb',
    red: '#eb1b1f',
    red2: '#f58d8e',
    softblue: '#e2edf7',
    bluetag: '#5683b0',
    grey: '#61646b',
    green: '#00c3a9',
    error: 'red',
    background: '#f4f6f7',
    silver: '#c0c0c0',
    softgrey: '#c2d4e4',
    lightgrey: '#ababac',
    darkGrey: '#686868',
};
exports.zIndex = {
    behind: -1,
    level: 0,
    default: 1,
    slickArrows: 100,
    modalProfile: 900,
    logoContainer: 999,
    mapFlexBar: 2000,
    header: 3000,
};
const fonts = {
    body: `'Inter', Arial, sans-serif`,
};
const space = [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
    100, 105, 110, 115, 120, 125, 130, 135, 140,
];
const radii = space;
const fontSizes = [10, 12, 14, 18, 22, 30, 38, 42, 46, 50, 58, 66, 74];
const breakpoints = ['40em', '52em', '70em'];
// standard widths: 512px, 768px, 1024px
const maxContainerWidth = 1280;
const regular = 400;
const bold = 600;
// cc - assume standard image widths are 4:3, however not clearly defined
const alerts = {
    success: {
        borderRadius: 1,
        paddingX: 3,
        paddingY: 3,
        backgroundColor: exports.colors.green,
        textAlign: 'center',
        fontWeight: 'normal',
    },
    failure: {
        borderRadius: 1,
        paddingX: 3,
        paddingY: 3,
        backgroundColor: exports.colors.red2,
        textAlign: 'center',
        fontWeight: 'normal',
    },
};
const typography = {
    auxiliary: {
        fontFamily: '"Inter", Helvetica Neue, Arial, sans-serif;',
        fontSize: '12px',
        color: exports.colors.grey,
    },
    paragraph: {
        fontFamily: '"Inter", Helvetica Neue, Arial, sans-serif;',
        fontSize: '16px',
        color: exports.colors.grey,
    },
};
exports.StyledComponentTheme = {
    name: 'Project Kamp',
    profileGuidelinesURL: 'https://drive.google.com/file/d/1fXTtBbzgCO0EL6G9__aixwqc-Euqgqnd/view',
    communityProgramURL: 'https://community.preciousplastic.com/academy/guides/community-program',
    logo: project_kamp_header_png_1.default,
    alerts,
    badges: {
        member: {
            lowDetail: avatar_member_sm_svg_1.default,
            normal: avatar_member_lg_svg_1.default,
        },
    },
    cards: {
        primary: {
            background: 'white',
            border: `2px solid ${exports.colors.black}`,
            borderRadius: 1,
            overflow: 'hidden',
        },
    },
    colors: exports.colors,
    buttons: (0, button_1.getButtons)(exports.colors),
    breakpoints,
    space,
    radii,
    fontSizes,
    fonts,
    forms: {
        input: {
            background: exports.colors.background,
            borderRadius: 1,
            border: '1px solid transparent',
            fontFamily: `'Inter', Arial, sans-serif`,
            fontSize: 1,
            '&:focus': {
                borderColor: exports.colors.blue,
                outline: 'none',
                boxShadow: 'none',
            },
        },
        inputOutline: {
            background: 'white',
            border: `2px solid ${exports.colors.black}`,
            borderRadius: 1,
            '&:focus': {
                borderColor: exports.colors.blue,
                outline: 'none',
                boxShadow: 'none',
            },
        },
        error: {
            background: exports.colors.background,
            borderRadius: 1,
            border: `1px solid ${exports.colors.error}`,
            fontFamily: `'Inter', Arial, sans-serif`,
            fontSize: 1,
            '&:focus': {
                borderColor: exports.colors.blue,
                outline: 'none',
                boxShadow: 'none',
            },
        },
        textarea: {
            background: exports.colors.background,
            border: `1px solid transparent`,
            borderRadius: 1,
            fontFamily: `'Inter', Arial, sans-serif`,
            fontSize: 1,
            padding: 2,
            '&:focus': {
                borderColor: exports.colors.blue,
                outline: 'none',
                boxShadow: 'none',
            },
        },
        textareaError: {
            background: exports.colors.background,
            border: `1px solid ${exports.colors.error}`,
            borderRadius: 1,
            fontFamily: `'Inter', Arial, sans-serif`,
            fontSize: 1,
            padding: 2,
            '&:focus': {
                borderColor: exports.colors.blue,
                outline: 'none',
                boxShadow: 'none',
            },
        },
    },
    maxContainerWidth,
    regular,
    bold,
    text: {
        heading: {
            fontFamily: '"Varela Round", Arial, sans-serif',
            fontSize: fontSizes[5],
            fontWeight: 'normal',
        },
        small: {
            fontFamily: '"Varela Round", Arial, sans-serif',
            fontSize: fontSizes[4],
            fontWeight: 'normal',
        },
        body: {
            fontFamily: fonts.body,
        },
        quiet: {
            fontFamily: fonts.body,
            color: 'grey',
        },
    },
    typography,
    zIndex: exports.zIndex,
};
