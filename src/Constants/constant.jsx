import fileDefault from '../assets/file-blank-solid-240.png';
import fileCSS from '../assets/file-css-solid-240.png';
import filePdf from '../assets/file-pdf-solid-240.png';
import filePng from '../assets/file-png-solid-240.png';

  const API_URL = 'https://medicareb.work.gd/api/';
//const API_URL = 'http://localhost:8080/api/';

const MalePic = {
    0:"https://mighty.tools/mockmind-api/content/human/99.jpg",
    1:"https://mighty.tools/mockmind-api/content/human/80.jpg",
    2:"https://mighty.tools/mockmind-api/content/human/104.jpg",
    3:"https://mighty.tools/mockmind-api/content/human/91.jpg",
    4:"https://mighty.tools/mockmind-api/content/human/92.jpg",
    5:"https://mighty.tools/mockmind-api/content/human/102.jpg",
    6:"https://mighty.tools/mockmind-api/content/human/57.jpg",
    7:"https://mighty.tools/mockmind-api/content/human/112.jpg",
    8:"https://mighty.tools/mockmind-api/content/human/99.jpg",
    9:"https://mighty.tools/mockmind-api/content/human/80.jpg",
    10:"https://mighty.tools/mockmind-api/content/human/104.jpg",
    11:"https://mighty.tools/mockmind-api/content/human/91.jpg",
    12:"https://mighty.tools/mockmind-api/content/human/92.jpg",
    13:"https://mighty.tools/mockmind-api/content/human/102.jpg",
    14:"https://mighty.tools/mockmind-api/content/human/57.jpg",
    15:"https://mighty.tools/mockmind-api/content/human/112.jpg",
    16:"https://mighty.tools/mockmind-api/content/human/99.jpg",
    17:"https://mighty.tools/mockmind-api/content/human/80.jpg",
    18:"https://mighty.tools/mockmind-api/content/human/104.jpg",
    19:"https://mighty.tools/mockmind-api/content/human/91.jpg",
    20:"https://mighty.tools/mockmind-api/content/human/92.jpg",
    21:"https://mighty.tools/mockmind-api/content/human/102.jpg",
    22:"https://mighty.tools/mockmind-api/content/human/57.jpg",
    23:"https://mighty.tools/mockmind-api/content/human/112.jpg",
    24:"https://mighty.tools/mockmind-api/content/human/99.jpg",
    25:"https://mighty.tools/mockmind-api/content/human/80.jpg",
    26:"https://mighty.tools/mockmind-api/content/human/104.jpg",
    27:"https://mighty.tools/mockmind-api/content/human/91.jpg",
    28:"https://mighty.tools/mockmind-api/content/human/92.jpg",
    29:"https://mighty.tools/mockmind-api/content/human/102.jpg",
    30:"https://mighty.tools/mockmind-api/content/human/57.jpg",
    31:"https://mighty.tools/mockmind-api/content/human/112.jpg"
}
const FemalePic = {
    0:"https://mighty.tools/mockmind-api/content/human/97.jpg",
    1:"https://mighty.tools/mockmind-api/content/human/125.jpg",
    2:"https://mighty.tools/mockmind-api/content/human/116.jpg",
    3:"https://mighty.tools/mockmind-api/content/human/123.jpg",
    4:"https://mighty.tools/mockmind-api/content/human/128.jpg",
    5:"https://mighty.tools/mockmind-api/content/human/129.jpg",
    6:"https://mighty.tools/mockmind-api/content/human/87.jpg",
    7:"https://mighty.tools/mockmind-api/content/human/111.jpg",
    8:"https://mighty.tools/mockmind-api/content/human/97.jpg",
    9:"https://mighty.tools/mockmind-api/content/human/125.jpg",
    10:"https://mighty.tools/mockmind-api/content/human/116.jpg",
    11:"https://mighty.tools/mockmind-api/content/human/123.jpg",
    12:"https://mighty.tools/mockmind-api/content/human/128.jpg",
    13:"https://mighty.tools/mockmind-api/content/human/129.jpg",
    14:"https://mighty.tools/mockmind-api/content/human/87.jpg",
    15:"https://mighty.tools/mockmind-api/content/human/111.jpg",
    16:"https://mighty.tools/mockmind-api/content/human/97.jpg",
    17:"https://mighty.tools/mockmind-api/content/human/125.jpg",
    18:"https://mighty.tools/mockmind-api/content/human/116.jpg",
    19:"https://mighty.tools/mockmind-api/content/human/123.jpg",
    20:"https://mighty.tools/mockmind-api/content/human/128.jpg",
    21:"https://mighty.tools/mockmind-api/content/human/129.jpg",
    22:"https://mighty.tools/mockmind-api/content/human/87.jpg",
    23:"https://mighty.tools/mockmind-api/content/human/111.jpg",
    24:"https://mighty.tools/mockmind-api/content/human/97.jpg",
    25:"https://mighty.tools/mockmind-api/content/human/125.jpg",
    26:"https://mighty.tools/mockmind-api/content/human/116.jpg",
    27:"https://mighty.tools/mockmind-api/content/human/123.jpg",
    28:"https://mighty.tools/mockmind-api/content/human/128.jpg",
    29:"https://mighty.tools/mockmind-api/content/human/129.jpg",
    30:"https://mighty.tools/mockmind-api/content/human/87.jpg",
    31:"https://mighty.tools/mockmind-api/content/human/111.jpg"
}

const Public_VAPIDKey= "BFB-ZCxuTJ8EbHar3Drttg1DAxzKafUZV9ipWmbLXT3TRDprxyELDI5ore2KvIdGD8m5g7-p0bUrO3t4KYVdgAA";
const Private_VAPIDKey= "TimAHDR7-2rQ2SB2Yv3RcA2nH4AvEcA9G5NoLcu7OZE";
const DefaultFemale ="src/assets/userProfilePictures/default-female.jpg";
const DefaultMale ="src/assets/userProfilePictures/default-male.jpg";

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

export { FemalePic, MalePic , API_URL ,City , ImageConfig , DefaultFemale , DefaultMale , Public_VAPIDKey , Private_VAPIDKey} ;