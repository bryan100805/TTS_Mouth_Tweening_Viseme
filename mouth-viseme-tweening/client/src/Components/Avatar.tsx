"use client";

import * as React from "react";
import type { SVGProps } from "react";
import { useState } from "react";

import { interpolatePath } from "../helpers/d3interpolator.js";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import viseme_id_0 from "../Assets/visemes/Mouth-01.svg";
import viseme_id_1 from "../Assets/visemes/Mouth-02.svg";
import viseme_id_2 from "../Assets/visemes/Mouth-03.svg";
import viseme_id_3 from "../Assets/visemes/Mouth-04.svg";
import viseme_id_4 from "../Assets/visemes/Mouth-05.svg";
import viseme_id_5 from "../Assets/visemes/Mouth-06.svg";
import viseme_id_6 from "../Assets/visemes/Mouth-07.svg";
import viseme_id_7 from "../Assets/visemes/Mouth-08.svg";
import viseme_id_8 from "../Assets/visemes/Mouth-09.svg";
import viseme_id_9 from "../Assets/visemes/Mouth-10.svg";
import viseme_id_10 from "../Assets/visemes/Mouth-11.svg";
import viseme_id_11 from "../Assets/visemes/Mouth-12.svg";
import viseme_id_12 from "../Assets/visemes/Mouth-13.svg";
import viseme_id_13 from "../Assets/visemes/Mouth-14.svg";
import viseme_id_14 from "../Assets/visemes/Mouth-15.svg";
import viseme_id_15 from "../Assets/visemes/Mouth-16.svg";
import viseme_id_16 from "../Assets/visemes/Mouth-17.svg";
import viseme_id_17 from "../Assets/visemes/Mouth-18.svg";
import viseme_id_18 from "../Assets/visemes/Mouth-19.svg";
import viseme_id_19 from "../Assets/visemes/Mouth-20.svg";
import viseme_id_20 from "../Assets/visemes/Mouth-21.svg";
import viseme_id_21 from "../Assets/visemes/Mouth-22.svg";

import FemaleSpeakers from "../configs/femaleSpeakers";

const config = require("../config.json");

var visemes_arr: Array<sdk.SpeechSynthesisVisemeEventArgs> = [];

function Avatar(props: SVGProps<SVGSVGElement>) {
  interface IMap {
    [key: string]: string;
  }

  // Define the viseme map (containing URLs to SVGs for each viseme ID)
  const visemeMap: IMap = {
    0: viseme_id_0,
    1: viseme_id_1,
    2: viseme_id_2,
    3: viseme_id_3,
    4: viseme_id_4,
    5: viseme_id_5,
    6: viseme_id_6,
    7: viseme_id_7,
    8: viseme_id_8,
    9: viseme_id_9,
    10: viseme_id_10,
    11: viseme_id_11,
    12: viseme_id_12,
    13: viseme_id_13,
    14: viseme_id_14,
    15: viseme_id_15,
    16: viseme_id_16,
    17: viseme_id_17,
    18: viseme_id_18,
    19: viseme_id_19,
    20: viseme_id_20,
    21: viseme_id_21,
  };

  // define the states
  // const [imageIndex, setImageIndex] = useState(0); // Used for initial implementation of text-to-speech without in-betweens
  const [numFrames, setNumFrames] = useState(10);
  const [cp1x, setCp1x] = useState(0.25);
  const [cp1y, setCp1y] = useState(1);
  const [cp2x, setCp2x] = useState(0.25);
  const [cp2y, setCp2y] = useState(1);
  const [selectedVoice, setSelectedVoice] =
    useState<string>("en-Us-JennyNeural");
  const [sentence, setSelectedSentence] =
    useState<string>("Hello.");
  let lastVisemeId: number | null = null; // Initialize outside to retain state across events

  // Add more sentences here:
  const sentences = [
    "Hello.", "My name is the Avatar."
  ];
  let inbetweens: string[][] = [];

  function synthesizeSpeech() {
    let viseme_Number = 0;
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      config.SpeechKey,
      config.SpeechRegion
    );
    // Creates an instance of a speech synthesizer using the default speaker as audio output.
    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

    // SSML format for the speech (controls audio output style and viseme generation)
    const ssml = `<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
        <voice name='${selectedVoice}'> \r\n \
            <mstts:viseme type='redlips_front'/> \r\n \
            ${sentence} \r\n \
        </voice> \r\n \
    </speak>`;

    // // Subscribes to viseme received event
    // speechSynthesizer.visemeReceived = function (s, e) {
    //   window.console.log(
    //     "(Viseme), Audio offset: " +
    //       e.audioOffset / 10000 +
    //       "ms. Viseme ID: " +
    //       e.visemeId
    //   );

    //   visemes_arr.push(e);

    //   const nextVisemeId = e.visemeId;
    //   console.log(`Viseme Number: ${viseme_Number}`);
    //   if (lastVisemeId !== null && lastVisemeId !== e.visemeId) { // Only interpolate if the last ID is different
    //     interpolateAndSetViseme(lastVisemeId, e.visemeId);

    //   };
    //   lastVisemeId = nextVisemeId;
    //   viseme_Number+=1;
    //   console.log(`Visemes Array`, visemes_arr.length);
    //     for (let j=0;j<visemes_arr.length-1;j++){
    //       // console.log(`Stuff inside visemes array`,index, e.visemeId, e.audioOffset)
    //       var duration = visemes_arr[j+1].audioOffset / 10000;
    //       for (let i=0; i<inbetweens[0].length; i++){
    //         // console.log(`SVG stufzz`, inbetweens[j][i])

    //         setTimeout(() => {
    //           document.getElementById("avatar_svg__d")!.innerHTML = inbetweens[j][i];
    //         }, duration/numFrames/(i+1)+400);

    //       }
    //     };

    // };
    // speechSynthesizer.speakSsmlAsync(
    //   ssml,
    //   (result) => {
    //     if (result.errorDetails) {
    //       console.error(result.errorDetails);
    //     } else {
    //       console.log(JSON.stringify(result));

    //     }

    //     // visemes_arr = [];
    //     speechSynthesizer.close();
    //   },
    //   (error) => {
    //     console.log(error);
    //     // visemes_arr = [];
    //     speechSynthesizer.close();
    //   }
    // );

    // Both functions are placed in a Promise.all to ensure that the visemeReceived event is triggered the same time as the speakSsmlAsync function
    Promise.all([
      // First function to subscribe to visemeReceived event
      (speechSynthesizer.visemeReceived = function (s, e) {
        window.console.log(
          "(Viseme), Audio offset: " +
            e.audioOffset / 10000 +
            "ms. Viseme ID: " +
            e.visemeId
        );

        visemes_arr.push(e);

        const nextVisemeId = e.visemeId;
        console.log(`Viseme Number: ${viseme_Number}`);
        if (lastVisemeId !== null && lastVisemeId !== e.visemeId && visemes_arr.length > 1) {
          // Only interpolate if the last ID is different
          //Interpolate between every 2 visemes to generate the inbetweens (helpers/d3interpolator.js)
          const lastEvent = visemes_arr[visemes_arr.length - 2];
          const currentEvent = visemes_arr[visemes_arr.length - 1];
          const durationMS = (currentEvent.audioOffset - lastEvent.audioOffset)/10000; // Find the duration between the last viseme and the current viseme in ms since audio offset is cumulative
          console.log("Last Event", lastEvent.visemeId, ":" ,lastEvent.audioOffset);
          console.log("Current Event", currentEvent.visemeId, ":" ,currentEvent.audioOffset);
          console.log("Duration", durationMS);
          
          // If the duration between the last viseme and the current viseme is greater than 41.666ms (24fps), interpolate between the last viseme and the current viseme
          if (durationMS > 41.666) {
            interpolateAndSetViseme(lastEvent.visemeId, currentEvent.visemeId);
          }
          else{
            pushKeyframes(currentEvent.visemeId)
          }

          // interpolateAndSetViseme(lastVisemeId, e.visemeId);
        }

        lastVisemeId = nextVisemeId;
        viseme_Number += 1;
        //If inbetweens array is a 2x2 array:
        // Loop through the outer dimension of the inbetweens array
        for (let j = 0; j < visemes_arr.length - 1; j++) {
          // console.log(`Stuff inside visemes array`,index, e.visemeId, e.audioOffset)

          // Calculate the duration of each viseme starting from the second viseme (since audioOffset is cumulative) and requires two visemes to calculate the duration of inbetweens display
          var duration = visemes_arr[j + 1].audioOffset / 10000;

          // Loop through the inner dimension of the inbetweens array
          for (let i = 0; i < inbetweens[0].length; i++) {
            // if(!inbetweens[j][i]){
            //   console.log(`Undefined`, inbetweens[j][i]);
            // }
            console.log(`Checking for InBetween SVG [`,j,`][`,i,`]`, inbetweens[j][i]);

            // Set the innerHTML of the SVG to the interpolated inbetweens, set a timeout to display each inbetween frame from the moment the viseme is detected
            // i+1 is added to the duration to stagger the display of the inbetweens (cannot be 0 as no number can be divided by 0)
            // 400ms is added to the duration as manual delay to ensure that the inbetweens are displayed after the viseme is detected
            setTimeout(() => {
              document.getElementById("avatar_svg__d")!.innerHTML =
                inbetweens[j][i];
            }, duration / numFrames / (i + 1) + 400);
          }
        }
      }),
      // Second function to speak the SSML
      speechSynthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.errorDetails) {
            console.error(result.errorDetails);
          } else {
            console.log(JSON.stringify(result));
          }

          visemes_arr = [];
          speechSynthesizer.close();
        },
        (error) => {
          console.log(error);
          visemes_arr = [];
          speechSynthesizer.close();
        }
      ),
    ]);
  }


  // Handle click event selects a random sentence to be said now
  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setSelectedSentence(sentences[randomIndex]);
    inbetweens = [];
    synthesizeSpeech();
  };

  // Handle voice change event
  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(event.target.value);
  };

  // Fetch SVG and extract paths
  const fetchSvgAndExtractPaths = (url: string): Promise<string[]> => {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((svgContent) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(svgContent, "image/svg+xml");
        const paths = xmlDoc.querySelectorAll("path");
        // Convert the NodeList to an array of paths
        const paths_arr = Array.from(paths).map(
          (path) => path.getAttribute("d") || ""
        );
        console.log(`Paths`, paths_arr);
        return paths_arr;
      })
      .catch((error) => {
        console.error("Failed to fetch or parse SVG:", error);
        return [];
      });
  };

  // Interpolate every 2 visemes to generate inbetweens
  const interpolateAndSetViseme = async (startId: number, endId: number) => {
    const [startPaths, endPaths] = await Promise.all([
      fetchSvgAndExtractPaths(visemeMap[startId]),
      fetchSvgAndExtractPaths(visemeMap[endId]),
    ]);

    console.log(`Interpolating between viseme ${startId} and ${endId}`);
    // console.log(`Start Paths:`, startPaths);
    // console.log(`End Paths:`, endPaths);

    // Create a set of interpolated frames for each path
    let inner_frames = createFrameSvg(startPaths, endPaths, numFrames);
    inbetweens.push(inner_frames);

    console.log(`Inbetweens`, inbetweens);
  };

  const createFrameSvg = (
    startPaths: string[],
    endPaths: string[],
    numFrames: number
  ) => {
    let inner_frames = [];
    const paths = startPaths.map((startPath, index) => {
      const endPath = endPaths[index] || startPath;
      const interpolated_path = interpolatePath(
        startPath,
        endPath,
        numFrames - 1,
        cp1x,
        cp1y,
        cp2x,
        cp2y
      );
      console.log(`Interpolated Path`, interpolated_path);
      return interpolated_path;
    });

    for (let j = 0; j < paths[0].length; j++) {
      let int_paths = [];
      for (let i = 0; i < paths.length; i++) {
        int_paths.push(paths[i][j]);
      }
      const svgContent = createSvgContent(int_paths);
      inner_frames.push(svgContent);
      // console.log(`SVG Content`, svgContent);
    }
    return inner_frames;
  };

  const createSvgContent = (paths: string[]) => {
    //Hardcoded fill color for now
    const fillColor = [
      "#801817",
      "#f2898b",
      "#fff",
      "#fff",
      "#e18788",
      "#d18381",
    ];
    // const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`
    // const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">`;
    // Ensure that every interpolated path is placed in a path element with its corresponding fill color
    const pathElements = paths
      .map(
        (path, index) =>
          `<path d="${path}" fill="${fillColor[index % fillColor.length]}"/>`
      )
      .join("");
    // const svgFooter = `</svg>`;
    return pathElements;
  };

  // Push keyframes for the current viseme if the duration between current viseme and last viseme is less than 41.666ms
  const pushKeyframes = (visemeId: number) => {
    fetchSvgAndExtractPaths(visemeMap[visemeId]).then((paths) => {
      const svgContent = createSvgContent(paths);
      inbetweens.push(Array(numFrames).fill(svgContent));
    });
  }

  return (
    <div className="outer-div">
      <div className="control-panel">
        <div className="input-group">
          <label htmlFor="voiceselect">Voice:</label>
          <select id="voiceselect" value={selectedVoice} onChange={handleVoiceChange}>
            {FemaleSpeakers.map((voice) => (
              <option value={voice.value}> {voice.label} </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="numFrames">Number of Frames:</label>
          <input
            id="numFrames"
            type="number"
            value={numFrames}
            onChange={(e) => setNumFrames(parseInt(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="CP1x">Control Point 1 X:</label>
          <input
            id="CP1x"
            type="number"
            value={cp1x}
            onChange={(e) => setCp1x(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="CP1y">Control Point 1 Y:</label>
          <input
            id="CP1y"
            type="number"
            value={cp1y}
            onChange={(e) => setCp1y(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="CP2x">Control Point 2 X:</label>
            <input
              id="CP2x"
              type="number"
              value={cp2x}
              onChange={(e) => setCp2x(parseFloat(e.target.value))}
            />
        </div>
        <div className="input-group">
          <label htmlFor="CP2y">Control Point 2 Y:</label>
          <input
            id="CP2y"
            type="number"
            value={cp2y}
            onChange={(e) => setCp2y(parseFloat(e.target.value))}
          />
        </div>
        <div className="speak">
          <button className="button" onClick={handleClick}>
            {" "}
            Speak{" "}
          </button>
      </div>
      </div>

      <div className="animation">
        <svg
          id="avatar_svg__d"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="400"
          height="400"
          fill="none"
          viewBox="0 0 1920 1080"
        >
          {/* Default path data is here and will be substituted out */}
          <path
            id="Inner_Mouth"
            data-name="Inner Mouth"
            d="M271.38,539.02c18.83-3.61,304.45-136.48,672.5-136.48s647.12,134.29,709.9,135.24c-57.17,38.61-369.63,199.09-689.95,199.09-276.11,0-605.83-149.77-692.46-197.84Z"
            fill="#801817"
          />
          <path
            id="Tongue"
            d="M471.71,620.3c71.18-51.16,151.79-58.27,369.96-57.62,41.87.13,77.79,4.43,122.4,4.43s76.83-7.2,131.38-5.79c260.43,6.73,303.4,15.15,366.64,58.98-52.12,36.8-315.43,153.6-498.02,151.66-182.6-1.94-469.13-125.02-492.36-151.66Z"
            fill="#f2898b"
          />
          <path
            id="Lower_Teeth"
            data-name="Lower Teeth"
            d="M519.21,558.26c25.7,5.11,49.19,10.04,69.11,17.7-6.3,15.57-11.37,27.47-13.62,36.09,11.37-14.32,14.1-21.44,26.72-31.66,3.21.12,65.01,11.73,65.01,11.73l-4.24,48.52,13.83-46.34,78.92,5.08,3.69,55.2,6.64-54.47,83.34,1.45,3.69,63.91,8.11-62.46,103.08,2.91,3.85,73.36,7.32-74.81,101.09.72,5.16,58.83,3.69-60.28,87.02-2.9,8.11,53.02v-55.2l71.54-7.99,13.28,53.74,3.69-55.2,81.87-2.18,5.9,33.05,4.43-33.77,58.27-3.63s5.91,15,11.6,34.6c-201.11,94.15-319.22,139.7-462.57,139.7-143.35,0-290.24-61.11-468.62-160.71,10.64-17.52,20.09-38.01,20.09-38.01Z"
            fill="#fff"
          />
          <path
            id="Upper_teeth"
            data-name="Upper teeth"
            d="M473.51,523.54l88.15-10.79,17.7-38.74-1.18,37.53,105.76-27.81,13.77-32.92,4.92,32.93,120.95-5.23,7.86-49.39,3.93,49.39,132.75,4.84,9.5-55.2,8.67,55.2h124.42l10.82-55.2,5.42,51.09,118.81-6.13,9.14-25.91,10.81,26.48,94.06,29.32.83-23.43,25.61,24.31,85.6,18.7-10.03-41.94s-378.56-118.26-496.56-117.96c-107.26-3.74-461.59,111.06-491.7,120.18v40.67Z"
            fill="#fff"
          />
          <path
            id="Upper_Lips"
            data-name="Upper Lips"
            d="M1657.16,538.15c-31.58-11.55-407.48-229.5-589.61-229.5-67.57,3.73-87.47,40.5-101.42,46.37-11.06-5.87-51.13-44.68-95.34-44.68-61.28-10.98-395.42,141.83-599.41,228.68,41.4-3.92,254.87-5.98,350.45-5.32,189.38,2.72,317.08-.3,346.57-.44,29.5-.14,243.59.13,346.87,1,255.6,2.16,319.2,3.89,341.88,3.89Z"
            fill="#e18788"
          />
          <path
            id="Lower_Lips"
            data-name="Lower Lips"
            d="M1657.16,538.15c-178.39,115.81-446.3,233.54-561.7,251.38-60,2.8-89.58-3.84-131.38-3.84-28.66,0-80.7,3.23-122.4,3.84-167.49-10.48-422.3-138.65-570.29-250.51,48.93-1.18,78.46-.39,346.12-1.18,123.57,0,231.81,2.28,348.94,2.11,165.02-.24,217.36-2.11,343.74-2.11,216.25,0,246.56.31,346.98.31Z"
            fill="#e18788"
          />
        </svg>
      </div>
      
    </div>
  );
}
export default Avatar;
