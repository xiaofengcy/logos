/**
 * Configuration
 * @module config
 */

import NPMPackage from '../../package.json';

const config = {
  name: NPMPackage.name,
  title: NPMPackage.title,
  description: NPMPackage.description,
  firebase: {
    apiKey: 'AIzaSyAEsMUc_grpmQgf9gJnDFyFuSe4L736ONY',
    authDomain: 'logos-c87b5.firebaseapp.com',
    databaseURL: 'https://logos-c87b5.firebaseio.com',
    storageBucket: 'logos-c87b5.appspot.com',
    messagingSenderId: '1043723852393',
  },
  startReactotron: false,
  imagePath: 'https://s3-us-west-2.amazonaws.com/svgporn.com/logos/',
};

export default config;
