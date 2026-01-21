import fileDefault from '../assets/file-blank-solid-240.png';
import fileCSS from '../assets/file-css-solid-240.png';
import filePdf from '../assets/file-pdf-solid-240.png';
import filePng from '../assets/file-png-solid-240.png';

import {useState} from "react";
import defaultFemaleImg from "../assets/userProfilePictures/default-female.jpg";
import defaultMaleImg from "../assets/userProfilePictures/default-male.jpg";

  // const API_URL = 'https://medicareb.work.gd/api/';
const API_URL = 'http://localhost:8080/api/';

const MalePic = {
    0:"src/assets/userProfilePictures/Male/m1.jpg",
    1:"src/assets/userProfilePictures/Male/m2.jpg",
    2:"src/assets/userProfilePictures/Male/m3.jpg",
    3:"src/assets/userProfilePictures/Male/m4.jpg",
    4:"src/assets/userProfilePictures/Male/m5.jpg",
    5:"src/assets/userProfilePictures/Male/m6.jpg",
    6:"src/assets/userProfilePictures/Male/m8.jpg",
    7:"src/assets/userProfilePictures/Male/m9.jpg",
    8:"src/assets/userProfilePictures/Male/m1.jpg",
    9:"src/assets/userProfilePictures/Male/m2.jpg",
    10:"src/assets/userProfilePictures/Male/m3.jpg",
    11:"src/assets/userProfilePictures/Male/m4.jpg",
    12:"src/assets/userProfilePictures/Male/m5.jpg",
    13:"src/assets/userProfilePictures/Male/m6.jpg",
    14:"src/assets/userProfilePictures/Male/m8.jpg",
    15:"src/assets/userProfilePictures/Male/m9.jpg",
    16:"src/assets/userProfilePictures/Male/m1.jpg",
    17:"src/assets/userProfilePictures/Male/m2.jpg",
    18:"src/assets/userProfilePictures/Male/m3.jpg",
    19:"src/assets/userProfilePictures/Male/m4.jpg",
    20:"src/assets/userProfilePictures/Male/m5.jpg",
    21:"src/assets/userProfilePictures/Male/m6.jpg",
    22:"src/assets/userProfilePictures/Male/m8.jpg",
    23:"src/assets/userProfilePictures/Male/m9.jpg",
    24:"src/assets/userProfilePictures/Male/m1.jpg",
    25:"src/assets/userProfilePictures/Male/m2.jpg",
    26:"src/assets/userProfilePictures/Male/m3.jpg",
    27:"src/assets/userProfilePictures/Male/m4.jpg",
    28:"src/assets/userProfilePictures/Male/m5.jpg",
    29:"src/assets/userProfilePictures/Male/m6.jpg",
    30:"src/assets/userProfilePictures/Male/m8.jpg",
    31:"src/assets/userProfilePictures/Male/m9.jpg"
}
const FemalePic = {
    0:"src/assets/userProfilePictures/Female/f1.jpg",
    1:"src/assets/userProfilePictures/Female/f2.jpg",
    2:"src/assets/userProfilePictures/Female/f3.jpg",
    3:"src/assets/userProfilePictures/Female/f4.jpg",
    4:"src/assets/userProfilePictures/Female/ff5.jpg",
    5:"src/assets/userProfilePictures/Female/66.jpg",
    6:"src/assets/userProfilePictures/Female/ff5.jpg",
    7:"src/assets/userProfilePictures/Female/f1.jpg",
    8:"src/assets/userProfilePictures/Female/f1.jpg",
    9:"src/assets/userProfilePictures/Female/f2.jpg",
    10:"src/assets/userProfilePictures/Female/f3.jpg",
    11:"src/assets/userProfilePictures/Female/f4.jpg",
    12:"src/assets/userProfilePictures/Female/ff5.jpg",
    13:"src/assets/userProfilePictures/Female/66.jpg",
    14:"src/assets/userProfilePictures/Female/ff5.jpg",
    15:"src/assets/userProfilePictures/Female/f1.jpg",
    16:"src/assets/userProfilePictures/Female/f1.jpg",
    17:"src/assets/userProfilePictures/Female/f2.jpg",
    18:"src/assets/userProfilePictures/Female/f3.jpg",
    19:"src/assets/userProfilePictures/Female/f4.jpg",
    20:"src/assets/userProfilePictures/Female/ff5.jpg",
    21:"src/assets/userProfilePictures/Female/66.jpg",
    22:"src/assets/userProfilePictures/Female/ff5.jpg",
    23:"src/assets/userProfilePictures/Female/f1.jpg",
    24:"src/assets/userProfilePictures/Female/f1.jpg",
    25:"src/assets/userProfilePictures/Female/f2.jpg",
    26:"src/assets/userProfilePictures/Female/f3.jpg",
    27:"src/assets/userProfilePictures/Female/f4.jpg",
    28:"src/assets/userProfilePictures/Female/ff5.jpg",
    29:"src/assets/userProfilePictures/Female/66.jpg",
    30:"src/assets/userProfilePictures/Female/ff5.jpg",
    31:"src/assets/userProfilePictures/Female/f1.jpg"
}


let user = JSON.parse(localStorage.getItem("userData"));

const Public_VAPIDKey= "BG4RexXOjw1VP-aLtSrCVCva4p5rk9crSInF8848SvWXGESDpZRqBb3YNNEtmRGI0VANCYft2DojG8QhHIhCPnU";
const Private_VAPIDKey= "_xqlMZjKw2GdCXKIKCh4CYz7itOnIjJMku7vjhVR9Qo";
const DefaultFemale = defaultFemaleImg;
const DefaultMale = defaultMaleImg;

const City = [
    "Cairo",
    "elsheikhZayed",
    "Alexandria",
    "Giza",
    "Mansoura",
    "Tanta",
    "Asyut",
    "Suez",
    "PortSaid",
    "Ismailia",
    "Dakahlia",
    "Qalyubia",
    "Gharbia",
    "Sharqia",
    "KafrElSheikh",
    "Beheira",
    "Matrouh",
    "BeniSuef",
    "Minya",
    "Fayoum",
    "Qena",
    "Luxor",
    "Aswan",
    "RedSea",
    "SouthSinai",
    "NorthSinai",
    "NewValley",
    "Sohag",
]


 const ImageConfig = {
     default: fileDefault,
     pdf: filePdf,
     png: filePng,
     css: fileCSS
 }

export { FemalePic, MalePic , API_URL ,City , ImageConfig , DefaultFemale , DefaultMale , Public_VAPIDKey , Private_VAPIDKey ,user } ;