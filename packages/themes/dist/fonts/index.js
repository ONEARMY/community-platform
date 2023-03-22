"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalFonts = void 0;
const VarelaRound_Regular_woff_1 = __importDefault(require("../../assets/fonts/VarelaRound-Regular.woff"));
const VarelaRound_Regular_ttf_1 = __importDefault(require("../../assets/fonts/VarelaRound-Regular.ttf"));
const Inter_Regular_woff2_1 = __importDefault(require("../../assets/fonts/Inter-Regular.woff2"));
const Inter_Regular_woff_1 = __importDefault(require("../../assets/fonts/Inter-Regular.woff"));
const Inter_Regular_ttf_1 = __importDefault(require("../../assets/fonts/Inter-Regular.ttf"));
const Inter_Medium_woff2_1 = __importDefault(require("../../assets/fonts/Inter-Medium.woff2"));
const Inter_Medium_woff_1 = __importDefault(require("../../assets/fonts/Inter-Medium.woff"));
const Inter_Medium_ttf_1 = __importDefault(require("../../assets/fonts/Inter-Medium.ttf"));
// declare global styling overrides (fonts etc.)
exports.GlobalFonts = `
  @font-face {
    font-family: 'Varela Round';
    font-display: auto;
    src:  url(${VarelaRound_Regular_woff_1.default}) format('woff'),
          url(${VarelaRound_Regular_ttf_1.default}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Inter';
    font-display: auto;
    src:  url(${Inter_Regular_woff2_1.default}) format('woff2'),
          url(${Inter_Regular_woff_1.default}) format('woff'),
          url(${Inter_Regular_ttf_1.default}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Inter';
    font-display: auto;
    src:  url(${Inter_Medium_woff2_1.default}) format('woff2'),
          url(${Inter_Medium_woff_1.default}) format('woff'),
          url(${Inter_Medium_ttf_1.default}) format('truetype');
    font-weight: bold;
    font-style: normal;
  }
`;
