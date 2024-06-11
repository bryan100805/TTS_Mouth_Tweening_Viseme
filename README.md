# Tweening_TTS_Mouth_Viseme
This repository contains a TypeScript-based React system that integrates text-to-speech synthesis with dynamic viseme generation, using Azure's Cognitive Services Speech SDK. Designed to animate talking characters by synchronizing spoken output with accurate mouth movements, including dynamically generated in-between shapes for smoother transitions. Note that this is still in a work in progress project.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js 
- yarn

## Installation
To install **Tweening_TTS_Mouth_Viseme**, follow these steps:

```bash
# Installation of packages in project repositoty (i.e. Azure Speech Synthesizer SDK)
cd mouth-viseme-tweening
npm install

# Installation of packages in client folder (i.e. yarn package)
cd client
npm install
```

## Configuration for Azure Speech Synthesizer SDK
1) Under the src folder, create a config.json file to include the configuration keys and values to use the Azure Speech Synthesizer SDK.

```bash
{
    "SpeechKey":  //Insert your own Speech Key from Azure,
    "SpeechRegion" //Insert your own Speech Region from Azure:  
}
```

## Starting the Server
To run the project, I have used this yarn command to start the server in client folder.

``` bash 
yarn start
```

## Ideas (Integration of In-Between & Viseme Mapping)
In order to integrate in-between animation into viseme mapping animation to produce a smoother display of mouth animation with Text-to-Speech via Azure Speech Synthesizer SDK, I have come up with a few ideas with their own corresponding issues.
1) **First Idea**: Animate the in-betweens directly on the key frames (Read as static images fetched as URLs) that was input into the speech synthesizer as svgs. 
   - However, the original way of implementing the text-to-speech (without the in-betweens) was using an image tag that dynamically changes the URL to move around the different key frames. 
   - The problem with that was that the svgs were read as images meant that the key frames of the mouth shapes was static and not interactive, and I will not be able to animate the in-betweens.
2) **Second Idea**: Not use an image tag but rather, dynamically adding in 6 path tags for every mouth shape that was chosen by the Azure Speech Synthesizer SDK. **(File is in Components_extra folder)**
   - Each path tag would have an animate tag, which would then animate the in-between values for every two key frames for the 6 parts of the mouth. 
   - The duration for each in-between to be displayed would also get passed in based on the audio-offset output by the Azure Speech Synthesizer to synchronize the in-betweens being displayed with the audio. 
   - However, the animation has a lot of issues: the animation is inconsistent, it does not get displayed more than half of the time and the audio does not synchronize with the animation at times as well.
3) **Third Idea**: Use setTimeout() to replace the path tag of the svg element with every interpolated path using .innerHTML() while the duration will be the audiooffset in ms/number of in-betweens/(i+1) via multiple for loops.
   - Managed to obtain each interpolated path between every two keyframes and place all the paths for each part of the mouth together in a single svg content automatically
   - Synchronization of audio to each in-between cannot be handled by Speech Synthesizer itself as text-to-speech service relies on viseme mapping, hence I came up with an idea
   - Use setTimeout() to replace the path tag of the svg element with every interpolated path calculated using .innerHTML()
   - As for the duration in setTimeout(), I formulated a formula to swap out the interpolated paths at specific timing (i.e. Audiooffset in ms/number of frames/each index of the interpolated path in an array+1).
   - I got the animation to work for a short text like "Hello" but the audio still did not synchronized with the animation.
   - I solved this issue when I deliberately added a fixed delay (i.e. add in 400ms for the word 'Hello') in the initial display of animation but the delay is not fixed. The delay timing depends on the length of text input.
   - I found online that some people recorded the audio and realised it does not match the duration of the audio offset. Since duration was based on the audio offset output by the speech synthesizer, this caused a delay.
   - Even after running both functions concurrently, there was still a delay and the issue was still not solved.
   - Ultimately, no one online has done inbetweening animation with viseme mapping animation for text-to-speech before and ChatGPT did not provide any useful assistance or results.

## Ideas (Refinement of Key Frames Animation via Path Control)
- Some programmers faced the same issue where Illustrator unnecessarily complicates the path values, making path data in SVGs inconsistent (like merging some control points sometimes).
- Hence, you may notice the weird morphing of some keyframes of the mouths.
- Found a github repo that tried to resolve the issue by optimizing the svgs and it look promising so I made that repo worked (fixed the bugs) and tried them on the mouth shapes to simplify some of the path data. [https://github.com/petercollingridge/SVG-Optimiser]
- However, for SVG elements like path data, due to how complicated the shapes are (i.e. Teeth), automated software does not effectively simplify the paths as it does not know which path to completely eliminate. 
- For those parts of the mouth like the teeth, it has a lot of curves and move commands, so these shapes were messed up badly.
- Works for less complicated shapes like circle or rect.
- I tried out other svg optimizers like SVGOMG [https://jakearchibald.github.io/svgomg/] as well but they also affected the animation quite badly.
- Directly manipulation of the paths is also quite difficult as a small change in the path data will affect the shape of the mouth in the svg quite significantly. Requires an expert in svg for assistance.

## Contributors
Thanks to the following people who have contributed to this project.
1. Bryan Tan [https://github.com/bryan100805]