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
  const [imageIndex, setImageIndex] = useState(0);
  const [numFrames, setNumFrames] = useState(10);
  const [cp1x, setCp1x] = useState(0.25);
  const [cp1y, setCp1y] = useState(1);
  const [cp2x, setCp2x] = useState(0.25);
  const [cp2y, setCp2y] = useState(1);
  const [selectedVoice, setSelectedVoice] =
    useState<string>("en-Us-JennyNeural");
  const [sentence, setSelectedSentence] = useState<string>(
    "Hello, how are you?"
  );

  const sentences = [
    "Hello, how are you?",
    "The quick brown fox jumps over the lazy dog",
    "The total number of stars in the universe is greater than the number of grains of sand on all the beaches on Earth"
  ];

  function synthesizeSpeech() {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      config.SpeechKey,
      config.SpeechRegion
    );
    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

    const ssml = `<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
        <voice name='${selectedVoice}'> \r\n \
            <mstts:viseme type='redlips_front'/> \r\n \
            ${sentence} \r\n \
        </voice> \r\n \
    </speak>`;

    let lastVisemeId = 0;

    // Subscribes to viseme received event
    speechSynthesizer.visemeReceived = function (s, e) {
      window.console.log(
        "(Viseme), Audio offset: " +
          e.audioOffset / 10000 +
          "ms. Viseme ID: " +
          e.visemeId
      );

      visemes_arr.push(e);

      const nextVisemeId = e.visemeId;
      interpolateAndSetViseme(lastVisemeId, nextVisemeId);
      lastVisemeId = nextVisemeId;
    };
    speechSynthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        if (result.errorDetails) {
          console.error(result.errorDetails);
        } else {
          console.log(JSON.stringify(result));
          visemes_arr.forEach((e) => {
            var duration = e.audioOffset / 10000;
            setTimeout(() => {
              setImageIndex(e.visemeId);
            }, duration);
          });
        }

        visemes_arr = [];
        speechSynthesizer.close();
      },
      (error) => {
        console.log(error);
        visemes_arr = [];
        speechSynthesizer.close();
      }
    );
  }

  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setSelectedSentence(sentences[randomIndex]);
    synthesizeSpeech();
  };
  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(event.target.value);
  };

  const interpolateAndSetViseme = async (startId: number, endId: number) => {
    const [startPaths, endPaths] = await Promise.all([
      fetchSvgAndExtractPaths(visemeMap[startId]),
      fetchSvgAndExtractPaths(visemeMap[endId])
    ]);
  
    console.log(`Interpolating between viseme ${startId} and ${endId}`);
    console.log(`Start Paths:`, startPaths);
    console.log(`End Paths:`, endPaths);
  
    // Assuming equal number of paths or handling it differently if needed
    const interpolatedFrames = startPaths.map((startPath, i) => {
      const endPath = endPaths[i] || startPath; // Handle cases where there might not be a matching end path
      const interpolated_path =  interpolatePath(startPath, endPath, numFrames, cp1x, cp1y, cp2x, cp2y);
      console.log(`Interpolated Path`, interpolated_path);
      return interpolated_path;
    });
  
    animatedFrames(interpolatedFrames);
  };
  

  const fetchSvgAndExtractPaths = (url: string): Promise<string[]> => {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(svgContent => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(svgContent, "image/svg+xml");
        const paths = xmlDoc.querySelectorAll('path');
        const paths_arr = Array.from(paths).map(path => path.getAttribute('d') || '');
        console.log(`Paths`, paths_arr);
        return paths_arr;
      })
      .catch(error => {
        console.error('Failed to fetch or parse SVG:', error);
        return [];
      });
  };
  

  const animatedFrames = (frames:any) => {
    frames.forEach((frame:any, index:any) => {
      setTimeout(() => {
        updateSVG(frame);
      }, index * 200);
    });
  };

  const updateSVG = (paths:string[]) => {
    const svgElement = document.getElementById('avatar_svg__c');
    if (svgElement){
      svgElement.innerHTML = ''; // Clear existing paths
      paths.forEach((d) => {
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('values', d);
        svgElement.appendChild(pathElement);
      });
    }

  };

  return (
    <div>
      <div className="options">
        <select value={selectedVoice} onChange={handleVoiceChange}>
          {FemaleSpeakers.map((voice) => (
            <option value={voice.value}> {voice.label} </option>
          ))}
        </select>
      </div>
      <div>
        <label>
          Number of Frames:
          <input
            type="number"
            value={numFrames}
            onChange={(e) => setNumFrames(parseInt(e.target.value))}
          />
        </label>
        <label>
          Control Point 1 X:
          <input
            type="number"
            value={cp1x}
            onChange={(e) => setCp1x(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Control Point 1 Y:
          <input
            type="number"
            value={cp1y}
            onChange={(e) => setCp1y(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Control Point 2 X:
          <input
            type="number"
            value={cp2x}
            onChange={(e) => setCp2x(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Control Point 2 Y:
          <input
            type="number"
            value={cp2y}
            onChange={(e) => setCp2y(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="500"
        height="500"
        fill="none"
        viewBox="0 0 500 500"
        {...props}
      >
        <path fill="url(#avatar_svg__a)" d="M0 0h500v500H0z" />
        <path fill="url(#avatar_svg__b)" d="M216 224h69v66h-69z" />
        <defs>
          <pattern
            id="avatar_svg__a"
            width={1}
            height={1}
            patternContentUnits="objectBoundingBox"
          >
            <use xlinkHref="#avatar_svg__c" transform="scale(.002)" />
          </pattern>
          <pattern
            id="avatar_svg__b"
            width={1}
            height={1}
            patternContentUnits="objectBoundingBox"
          >
            <use
              xlinkHref="#avatar_svg__d"
              transform="matrix(.00196 0 0 .00205 -.002 0)"
            />
          </pattern>
          <image
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAO3RFWHRDb21tZW50AHhyOmQ6REFGbjFXT2ZBcWs6NSxqOjc1NDE2NzMyMTg4MjMwMzI2MDEsdDoyMzA3MDYwNXdQf/AAAAT7aVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAABodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nPgogICAgICAgIDxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogICAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgICAgICAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICAgICAgICA8ZGM6dGl0bGU+CiAgICAgICAgPHJkZjpBbHQ+CiAgICAgICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgICAgICAgPC9yZGY6QWx0PgogICAgICAgIDwvZGM6dGl0bGU+CiAgICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CgogICAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgICAgICAgeG1sbnM6QXR0cmliPSdodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvJz4KICAgICAgICA8QXR0cmliOkFkcz4KICAgICAgICA8cmRmOlNlcT4KICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz4KICAgICAgICA8QXR0cmliOkNyZWF0ZWQ+MjAyMy0wNy0wNjwvQXR0cmliOkNyZWF0ZWQ+CiAgICAgICAgPEF0dHJpYjpFeHRJZD4wODNkY2M5Zi0wMTQyLTQ0NDItOTI0Yi05YzZmM2ViZmJiMDM8L0F0dHJpYjpFeHRJZD4KICAgICAgICA8QXR0cmliOkZiSWQ+NTI1MjY1OTE0MTc5NTgwPC9BdHRyaWI6RmJJZD4KICAgICAgICA8QXR0cmliOlRvdWNoVHlwZT4yPC9BdHRyaWI6VG91Y2hUeXBlPgogICAgICAgIDwvcmRmOmxpPgogICAgICAgIDwvcmRmOlNlcT4KICAgICAgICA8L0F0dHJpYjpBZHM+CiAgICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CgogICAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgICAgICAgeG1sbnM6cGRmPSdodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvJz4KICAgICAgICA8cGRmOkF1dGhvcj5SZWVtIEdvZHk8L3BkZjpBdXRob3I+CiAgICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CgogICAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgICAgICAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkNhbnZhPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgICAgPC9yZGY6UkRGPgogICAgICAgIDwveDp4bXBtZXRhPhpZFiIAAHbfSURBVHic7N1pjJ3XfR7w513uvbNv5JCzkBzuFEVxk0RRpCiKoii7piU4rhToSxvHn5IPBVKgdYIGtYuihusibVC0AeymdYI4aRonimPLUdVEUmySIs1F3HdyuMyQM5zt7tu7n364lCKumuXee97l+QEER5yZO3/N9tyz/Y8ihBAgIt8o2gKme/ePU/nb8gSMuy87HuB6AgKAJyp/hAA8IeDh3v92P/PTrasKNAVQFUBTFKifvKwCqvKo1yl3/63y/g2agoSuIKFVXm6KKbI+TUR0H4WBTlQflitQcgSKtkDR9lC6+3fZ+cfwdgP40/hJ0DfolYBvjatoiSloiatoiyvQVYY+UT0w0ImqKGt6KNwX2EVboGQL2F40f9QSmoKWuIKWmFoJ+7svtyVUaMx6oqphoBPNQt7ykLMEsqaHrOkhb1X+pplp1JUHQr49rnIqn2gWGOhEj1F2BNJGJaxzloec6SHD4K65hKagq1FFV4OGrgYVXQ0q4hzOEz0WA53oLtcDUoaLlOEhWa78XXb44+EXzTHl04DvvBv2zHiif8RAp8jKmh5ShodU2UXSqIy++cMQHAqAtkRl9N7VWAn69oQKZjxFFQOdIiNZ9jBRcjFRcpE0XLicOQ+l7iYNC5o0LGzSMK9RlV0OUd0w0Cm0cpaHiaKL8ZKLyZIX2V3mURbXFCxo0tDTXPnTqHP8TuHFQKfQKDsCY0X301G4wfVvuk9rXEXv3XBf2KzJLoeoqhjoFGgpw8PtvIPRgou8xTl0mj5dVdDXoqGvRUNvs8YGOBR4DHQKnLTh4Vbewe28g6LNb1+aO1UBFjRp6GvR0d+ioYFT8xRADHQKhPTdkfgthjjVQVeDiv4WHX2tGtri3FhHwcBAJ9/KmB5u5Rzczrso2JxOJzla4yr6Wyqjd+6aJz9joJOvlByBoayDm1mHIU6+06Ar6G/RsaRNw/xGbqojf2Ggk3SOJ3Ar72Io52Cy5Mouh2haWuMqlrbrWNauI8GWdeQDDHSSQgAYK7oYyjoYLTiBvDaUCKh0rOtp0bCsPYa+Zg0Ks50kYaBTXaUND8M5BzdzDiymOIVMXFOwtF3Hyo4YmnljHNUZA51qTgjgVt7B1bSNlMF1cYqGnmYNKztj6GUDG6oTBjrVjO0JXM9Ugpy3llFUNccUrOiIYXmHjhib11ANMdCp6oq2wOWUjZtZm2vjRJ+xtF3H6s4Y2hM8/kbVx0Cnqpksu7iasjFacHkNKdFj9DRrWNMVw4ImTsdT9TDQac6Gcw6upG2kuT5ONCMdCRVPzIthcasuuxQKAQY6zYongJtZB5dSFluxEs1RS0zF6i4dy9pj4DI7zRYDnWbEFcC1tI3LaZvXkxJVWUJTsKYrhpUdMWhcZqcZYqDTtNiewNV0Zcc6z48T1RaDnWaDgU6PZboCV1I2rmUc2B6/VYjqKaEpeGJeDCs6YmB3Wfo8DHR6qLIjcDFp41rGll0KUeQ16JUR++rOmOxSyMcY6HQP2xO4lLRxNc0z5ER+06greGp+HAPtOjhgp/sx0AlAZdf6YNrGxRTXyIn8rj2hYkN3HD1sK0ufwUAnDOUcnJuyUOLxM6JA6W7SsGlBHB3sPEdgoEfaWNHF2UkLGZMNYYiCbKBNx1PdcTTpnIiPMgZ6BGVMD6cmLEyWXNmlEFGVqAqwujOGtfNi0NmdJpIY6BFiugKnJiwM5xzZpRBRjSQ0BWvnxbCKO+Ijh4EeAQKVDW/np2yeJSeKiNa4io3dcfS2cONcVDDQQy5lePh4zESW6+REkTS/UcPTC+O8sjUCGOghZXsCpycs3Mhyep0o6hQAKztjeGp+HDpzPbQY6CF0Pevg7KTF8+REdI9GXcGWngQW8vx6KDHQQyRrVqbXU7yXnIgeY6BNx6YFccTZID5UGOghcXrCwpU0+64T0fTENQWbFsQx0KbLLoWqhIEecGnDw5E7JvIWR+VENHM9zRqe7UmgkU1pAo+BHlBCAOeTFi6lbPArSERzEVMVbFgQx/J2jtaDjIEeQDmzMipny1YiqqbuJg1behJojnG0HkQM9AARAC4nbZxPWmB/GCKqBV0F1s+PYyU7zQUOAz0gCpaHw3dMpLmDnYjqYH6jhi09cbTEeXA9KBjoAXA1bePUhCW7DCKKGE0BNi9MYBnX1gOBge5jpitw5I6J8SJvRSMieZa06Xi2JwEeW/c3BrpPTZRcHLljwnD45SEi+driKrb1J9DGKXjfYqD7jBDAuaSFy0kb/MIQkZ9oKvD0ggSWcgrelxjoPlJyBA6NGNz4RkS+xil4f2Kg+8RIwcWxOybvKyeiQGiLq3ihP8Fd8D7CQJfMFcDJcZPXnBJR4OgqsKUngUWtnIL3Awa6RDnLw6ER9mEnomBb1RnDpgVx2WVEHgNdkrGii1+OGnCY5UQUAl0NKrb3N/CSF4kY6BJcTNo4N8VGMUQULnFNwfa+BLqbNNmlRBIDvY5cARy5Y2Ikz/Vyqg5RykIYRcAoQZgl4P7DjloMih4H9Bigf/JyvPJ3vEFKzRRuCoD13XGs6WIv+HpjoNdJ2RHYf9tAjjek0TSJcgEiN3X3TxIil4SXm4TITcG7ea4S5HOkNLVD6eqB2rEQSlcPlI6FUDt7oHQuhNqxEIglqvB/QlG0pE3Hlp4EVM7A1w0DvQ6myi4OjpiwXH6q6V6ilINIjsCbGoGXHKm8nByBSI5WJbDnRFGgdvVC7VsFtW8l1N6VUPtXQWlqk1sXBUZXg4oXFzUgzgPrdcFAr7HBTOViFX6WCQBEPgV38ATcm2fgXvkYIjclu6QZU9rnQ+1dCa1/NdSBJ6EtWceRPD1Sk65gx6IGtCd4Xr3WGOg1dHzMxHWeL480YRThXjsJ79pJuNdPw5scll1STaj9q6EteRLqsvXQlq6H0twhuyTyEV0FtvY2oK+Fm+VqiYFeA64HHBw1eEtaRLnXT8G9dhLu4Al4ty/LLkcKpXMh9DVboa3fBW3pU7LLIZ/YwM1yNcVArzLLFdh3y0CGm98iQxgFOCfeh3vlKNyb5wDblF2SryitXdA37oa+/iWoi9bILockW9ERw9ML2YSmFhjoVVR2BH4xbKBgM8yjwL15Fs6Rn8E58wvZpQSG2tUHbf1O6Jv3QO1eIrsckqSvRcO2vgbugK8yBnqV5EwP+24bvL885EQpC+f438P5+D14U7dllxNo2pInoW/ZC339S9xUF0HdTRp29CegM9WrhoFeBcmyh/23DTi8KS20vKnbsPf/CM6pDwGXGx2rSUk0Qdu4G7Ete6H2rZRdDtVRW0LFS4sa0MB2sVXBQJ+jkbyDQ6NcMw0rd/AE7EN/A/fyEdmlRIK6cCn0ra8jtvV12aVQnTTqCl5a3IBWXsM6Zwz0ObiRdXB8zLy/2SaFgHPyA9gfvQ1v7LrsUiJJaWqHvvXLiD3/FSgtnbLLoRpLaAp2Lm5AB8+qzwkDfZYuJW2c5QUr4WKbsD9+D/ZHfw2RGZddDQGAHoO+cTdiO9+COn+R7GqohmJqZaTe2cBQny0G+iycmbRwOWXLLoOqRBgFOId+AvvQjyHKBdnl0CNoa7Yi9tJb0AZ4rj2sdFXBzkUJzGtkA5rZYKDP0MkJC4NphnkYCLMM++d/BvvwOzw7HiDaqmcRf+WfQ128VnYpVAOaAry4qIFXsM4CA30G2Mo1JISAc/zvYP39H0EUM7KroVnSVm9BfM/XoPavll0KVZmqADv6G7CwmaE+Ewz0afp4zMQNhnngebcuwXznv8EbHZRdClWJ9sRWxF/9OtSe5bJLoSp7oZ/932eCgT4NR++YGMoxzINM5FOw3v0enLP7ZJdCNRLb8Sbir/waEG+QXQpViaIA2/sY6tPFQH8MAeDIqIlbeYZ5kDkn3of1f7/HDW8RoLR3I/H6v4C2dpvsUqhKGOrTx0B/BCGAX44aGCnwxrSgErkkzLd/D+61E7JLoTrT1mxF4iu/BaV9vuxSqAoUBXi+N4FFrbrsUnyNgf4Ih0YY5kHmfPwerHe/D2GVZZdCssQSiO/5GmI73pRdCVXJtj6G+uMw0O/DafZgE/kUzL/+z3Cvfiy7FPIJbWAd4m98A+q8Ptml0BwpAJ5nqD8SA/0+3M0eXM75j2D9+PchDK6V0330OOKv/jpiL7xRmb+lQNve34B+rqk/gIH+GWwaE0zCKsN65w/gnHxfdinkc+riJ5B487fZRjbgVAXYyeYzD2Cg33UhaeM8e7MHjjt8AeaP/iN7r9OMxPf+JmIv/FPZZdAcaCqwa3Ejutj7/VMMdACDaRsnJxjmQWMf/imsd78PeNy8SDOnrXoGiTd/m7e5BVhMVbB7SQPaeEsbAAY6hnIOjt5hH+9AcR2Yf/P7cE5+ILsSCjilqR2JN/81tDVbZZdCs5TQFOxZ2ogmnXsjIh3ot/IOjozyPvMgEfkUjD/9JryRq7JLoRCJbX0d8b2/Aehx2aXQLDTHFLwy0IiEFu1Qj2ygjxZcHBwxZJdBM+Ddugjjh9+CKGVll0IhpPauQMOvfRu5xi60x6IdDEHUnlCxe0kDdDW6X7tIBnra8PDz4TLcyP2fB5dz/iOYP/oO4PJIIdVQcweOv/Yt9K5Yi1W86StwFjZreHFRA6Ia6ZEL9LIj8P7NMkymeWDY+/4C1vt/XOnHS1Rjnqbj0p7fgrt+N55pjyHG/VaBsrRdx5aehOwypIhUoDse8OFQGTnLk10KTYfnwfzxf+H5cpJi+Jk3MPLir+PZjjg6OAUfKBu641jTFZNdRt1FJtAFgAO3DYwXecQpKIwf/lu4l4/KLoMibHLldpzf+2+wtlXHcjYxCZQo9n2PTKCfGLdwLcMucIFgGTD+5Hfh3jwnuxIipBdtwNnXv4n5LU3Y3B4DT0cFg6oAu5c0ojNCjWciEehsHBMcwijA+KPf4bE08pVC93Kc+uq3EWtuw5aOGFqZ6oEQ1xS8OtCIpogsmYQ+0MeLLg7cNnjWPABEMQPjf30D3sSQ7FKIHlDu6MXJr34Hdtt8rGvVMdDIKfggaE+o2DPQiCicZgt1oOcsDx8OleFwD5zviWIWxv/4l/CSI7JLIXoks2UeTr7xXZTbe9DboGJTWwwR72USCEvadGztDf/O99AuLliuwIFbBsM8AEQ5D+N//iuGOfleopDE03/1DTQnh3HH8LA/aaHghHZMFBrDOQdXI3CTZigDXQA4NGqixB803xNGsTLNPjksuxSiaYmXMnj67d9By+R1FF2BAykLIwZHDn53esLCZDncp5xCGegXpixMlsL9hQsDYZVh/OAb8Mauyy6FaEZ0s4DNP/5dtI1fhSuAk1kbZ3IOPI4hfEsAODRiohzigV7oAn2y5OJCMvxTK4EnBMz/8214o4OyKyGaFd0sYuNPvoWG3AQAYLjs4kDKQoldKH3LcgUOjhihfeIVqkAvOwKHRnkVahBYH/4Q7pVjsssgmhPdLGDTT74J3SoBAPKOwP6khXGTU/B+lTY8nBgPZ06EJtCFAA6OGLD47Nj33AuHYP/8f8sug6gqGjOjWP+z/wBFVELcEcCxjI3zeYfHZX3qRtbBUC58Fz2FJtDPTFpIc2OK73kTQzD+6ruyyyCqqo6Rc1j1i+/f8283Si4OpiwYYZ3fDbjjY2bo7vUIRaCPFlxcicCRhKATVhnmn/47wOI99BQ+/Wffw+KTP73n3zK2wL6khQlOwfuOK4CDIyacED3hCnygl2yBI3fCuR4SKkLA/IvvwEuNyq6EqGZWfPQDzLtx794Q2wOOZmxcKnAK3m8Klheq/Ah8oB8cMUL1DCus7F/8OdzLR2SXQVRTihB46r3vomXq5gOvGyy6OJSyYfL3la+MFtzQNJ0JdKCfmrCQ4VSW77lD52B98CeyyyCqC9WxsOFn/x66VXzgdWnbw76kjWTI1m6D7tSEhVQI9mAFNtDHS+F5VhVqjgXzL/+T7CqI6iqRn8LK/T946OssT+Bw2sbVIptf+cnh0eC3Cg9koJuuwBGeNw8E670/hMiMyy6DqO56L7yPzlunH/o6AeBywcHhtA074CESFkVb4NREsHMlkIF+ZNSEyfPmvufeOAP78DuyyyCSZu0H//XTpjMPM2V52Je0kLH5+8wPbmQdjBaCO3MSuEC/mrYxzj7t/mcZMN/+PdlVEEmVyE9h1b4/fOzbGJ7AwZSF6/y95gvHxkwYAe33HqhAz5oezkxassugaTA51U4EAOi5+CHmDR1/7NsIABfyDo5lbAQ0S0LDcgUOB/QoW2AC3RXAL0fN0DbVDxNvdBDO0b+VXQaRb6z58A+gup8/GBk3K3es55nqUk0GdNN1YAL9zISFPI96BIL5zn+XXQKRryQKU1h0anr7SUp371gfCvnd3X53KoCZE4hAHy+5GMwE79lSFLmXj8C7dVF2GUS+M3DsbcSM/LTe1hPA2ZyD41kb3P8rz9GATb37PtBtTwTukxpZQsB693uyqyDyJd0qYuDYX87ofe4YlSn4AqfgpUgZHgYDNPXu+0A/PWEFdsdh1DjH/w5ekr3aiR5l0em/RaIwNaP3Kd6dgh8JQSezIDozaaEckAzydaBPll3cyIbvztqwsv7hh7JLIPI1xXOw7PCfz/j9XAGczNo4k3O4MbjOXFE5yhYEvg10TwDHONUeGM7JDyCyMxt5EEVRz6V/QLyUmdX7DpddHEhZKHFhva7Giy5uBmBw6dtAv5C0UGT3pMCwP3pbdglEgaB4Lhad/tms3z/vCOxPWhjnxVR1dSoAy7++DPSc6eFiMjgbEaLOvXYC3th12WUQBUbf2fegObOfgXQEcCxj43yed6zXi+0JnJrwd2MzXwZ6mC6cjwL7AEfnRDMRM/LoufDhnB/nRsnFwZQFgwvrdXEr72DCxy16fRfog2mbd5wHiDcxBPfqx7LLIAqcxad+WpXHydgC+5IWJvh7sy4+HvNvx1JfBXrZETg7xan2IHGOviu7BKJAasyMovP2mao8lu0BRzM2LhU4BV9rRVvgQtKfU+++CvTj4yYcvz71oQe5DpyT78uugiiwei98UNXHGyy6OJSyYfL3aE1dTNq+bAvrm0C/U3RxJ8D30EaRc/GXEEZRdhlEgdV99SA026jqY6ZtD/uSNpI+DJwwOTbmv1G6LwJdAL7fPUgPco7/P9klEAWa6lpYcGV/1R/X8gQOp21cLXKQVCvJsouhnL/Opvsi0AfTNgp8NhkoIp/iZjiiKqj2tPsnBIDLBQeH0zZs/nqtiTOTlq+WiaUHuuUKnONGuMBxzvwcEP75RiYKqvY7F9GQn6zZ409ZHvYlLWTYqKvqDMdf+SU90M9O+esZDk2Pe+mw7BKIQmPejWM1fXzDEziYsnDdx2eog2owbSPnkxlmqYGeszxcz/hrDYKmwTbh3jwruwqi0Jh3s7aBDlSm4C/kHRzL2PB5B9NAEQBO+GSDnNRA98sngWbGuXwE8PzxjJQoDDpvnYbq1mfqdtys3LGeZ6pXzWTZxa28/MGptEC/nXcwWeb0TxC5l4/ILoEoVFTXRuet03X7eKW7d6wP8Xdw1ZyasOBKHudICXRPAKcnOToPJCHgXjoquwqi0Jl3s76nRjwBnM05OJ61wdtY585wBC6m5OaalEC/krJR4o7LQPImbkKUsrLLCL3tr+2QXQLVWbXawM7UHaMyBV/gFPycXUzaUq/9rnug2578ZzE0e97wRdklhN7mXU9j+VPL8fTLz8guheqoKXULulWS8rGLd6fgRwzujZmr81Py8q3ugX4lZcPh90xgucMXZJcQam1dbVj3/FMAgCe3rsPiVYslV0T11DZ2WdrHdgVwMmvjTM7x7W1iQTCcc6T1ea9roNuewJW0fw7h08x5DPSa2vLqc/f89/bXdqClo0VSNVRvbXcuyS4Bw2UXB1IWSlxYnxUBSLs1tK6Bfpmj80ATZhne1G3ZZYRW77I+9C7ru+ffYokYdr3xMjRdk1QV1VO7xBH6Z+Udgf1JC+O8Y31WRvIOMhI+d3ULdNsTuMrReaB5Q+dklxBqz+x++Jp5R3cndnxlZ52rIRlax6/ILuFTjgCOZWycz/OO9dk4K+EkV90C/RJH54Hnjd+UXUJoPfHsWnR0dz7y9YtXLeYmuQiIGXnEiynZZdzjRsnFwZQFgwvrMzJWdJGq8ybDugS65QoMcnQeeF5yRHYJodTY3IhNOzd/7ts9uXUdVmxYWYeKSKamzKjsEh6QsQX2JS1McAp+Rs7U+VrwugQ6187DQUwx0GvhuS9uhR7Xp/W22/Zuf2CdncKlMXtHdgkPZXvA0YyNSwVOwU/XZNnFeB3vpK95oFsu187DgiP06utb3o/Fq5fM6H12/spOtHa21qgikq3RhyP0zxosujiUsmFyCn5aztRxLb3mgX4pxbaCoeDYELkp2VWEiqZpeO4LW2f8frFEHC//6ivTHtVTsPhxyv1+advDvqSNpE+uDfWzjOnhTp1G6TUNdMsVGMxwdB4GXpLH1artqe3rZ33GvK2rDbve2F3lisgPGrNjskuYFssTOJy2cbWOU8pBdSlZnxysaaAPZhzpt89QdYgsR+fV1NTWjCefXzenx+gZ6MGLv/ISFEWpUlXkB37b5f44AsDlgoPDaRs2f9c/0lS5PjveaxbongDXzkNElHKySwiVrV/YCk2be7OYgScGsOULz33+G1JgxMrBu/xoyvKwL2khw0u3HulisvZr6TUL9BtZGxYXz0ODN6xVT9/yfvSvXFS1x1u9eQ027NhYtccjuRQhoFtF2WXMmOEJHExZuF7iFPzDjBbcmvd4r0mgC1SOqlF4iCJH6NVSixH1hh0bsXrzmqo/LskRK+dllzArAsCFvINjGRu8jfVBl2qcizUJ9JG8I/VOWKo+jtCrY/Oup9HaUZsjZ899cSsG1i6tyWNTfcWMYD+BHjcrd6xnmer3GMo5KNfwc1KTQL9Qpx19VEflguwKAq99fjue3Dq3jXCfZ8frL2IRr1wNPN0I/s9bya1MwQ+VOQX/CSFQ0xtHqx7oEyUXWbYHDB/Br+lcKIqCHa+/WPMd6Yqq4KWv7mKoB5zihSMEPQGczTk4nmU/kk9czzhwatSUp+qBzrXzsOLRqLlY+9yT6FzYVZePpagKdr3xMhZVceMd1ZcSsifQd4zKFHyBU/BwPIHBtFOTx65qoGdND2NsMhBOPOs8a43Njdj44qa6f9ydX92F3qW9df+4NHdhC3QAKLoCB1IWRup8A5kfXa1Rw7WqBjpH5yHGQJ+1LV94Dpo+9zPnM6VqKna9uZuhHkQhDHQAcAVwMmvjTM5BlFvBG47A7Xz1R+lVC3TLFRiuQYHkFwz02Vi4pAdL1gxI+/iarmHXm7uxYPFCaTXQzCleOAP9E8NlFwdSFkoRXlgfzPg40G9kHYjofm3CT4/JriCQtu3dJrsEaLqGV97ag/4VXFMPjAjMiOUdgf1JC+MR3UQ9WXJRqHKjmaoFOi9hCTelpVN2CYGz5dXn0FKjM+czpekaXv7V3VixfoXsUmga7MY22SXUhSOAYxkb5/PRvGO92qP0qgT6RMlFiY1kQk1prc8O7bDo7u/GmmeekF3GA7Z9+QWsf2GD7DLoc5jN0fp5u1FycTBlwYjYwvrNbHX3ElQl0K/VYC2A/IWBPn16TMeOr+yUXcYjbXxxE7a/9gJvafMxqzl6M2IZW2Bf0sJEhKbgbU9gKFe9/JxzoFuuwEiBgR52Sts82SUExrN7nkNzW7PsMh5r+VMr8Mpbe6DHdNml0H2EqsGJ+/v7p1ZsDziasXGpEJ0p+GtVXK6ec6Bfy3AzXBRwhD49PQM9WLlxpewypqVnaS++9LUvo6m1SXYp9BlG6wLZJUg3WHRxKGXDjMAUfNrwkK7S2fw5B/r1LDfDRYHaNl92Cb6nx3S88PoO2WXMSPv8duz9+muY18uvr18Yrd2yS/CFtO1hX9JGssZXjvpBtUbpcwr0sSI3w0WGHofavUR2Fb72zCvPorEleKPdhqYGfPGf/RMsW7dcdikEoNC9THYJvmF5AofTNq6GvAPpjawDuwqzEXMK9GrO/ZP/qYtWyy7Bt3qW9mLVpuB+flRNxQuv78DmXc/ILiXy8guD+31UCwLA5YKDw2kbdogH67fzc3/SMutANxyB0UK4nzXRvdR+/qJ5mHhDPHBT7Y+y7vl12P3WHsQSbCQkS25BMPZg1NuU5WFf0kImpLPCw1XY7T7rQL/FNq+Rw0B/uG17t6OxuVF2GVXTt6wPe7/+Gtrnt8suJXKceBPKHX2yy/Atw6vcsX69FL7B5ETJhTHH2+gY6DRtWu+KSLSknImVG1dh8erw7S1o7WjFl772ZfTzCta64nT75xMALuQdHMvYCNttrHM9kz6rQC85AslyiBcz6OFiCag93Dj1idbOVjy7Z4vsMmpGj+l4+c3deP5L2xBviMsuJxJyPQz06Ro3K3esZ0OU6nOddv//AAAA///s3XlYW/eZL/DvOUc7CASYfTG2MQ44Mbax4yULthMnzeY4cdMmXRKnvc0yM+3tpJ1pn5npbZv2TmfmTttJ751n0nSytGnSmaRp7DSLlzjxEse7DV6wwRhjFmNjBEICLUdnuX/IEDAIdITgdyS9n+fJEweOpK+IzHt+e1QFvS2GO9uQ+CLMnv5zvfWI4zncsr4mKTZmKauai3VPrGd6alyy6C2uYh0hrnjlUBf8BV9idMG7Agrck9gpL7qCTt3tSUsoW8w6gi4sqlmMzNzk2WzHYrPg1gdqsGrDalhsFtZxEpIiGOEqvJ51jLijqMAJt4QjfUEkwmmsFyZRXzUX9H4xdrvakPgjzF4I8ALrGEzlFOeictl81jGYKJpbjHVPrMdsOrUt5lxFC6ByMTsAM+l0+kNd8P1x3gXf2jeNBb0tBmvlSBwzGCHMTN5WhNlqxi06PnhlOpgsJqy85yas+cJtSHWkso6TMHpKFrGOEPcGZBV7ekR0xHGj0yup6I5yCCGKgk7d7ckumbvdb32gBtbUxFmiNhkFswtx3zfux6JVi2EwJf5cgqnWU0LzU2JBVoFjfUEcd8f2aNLpFO1sd00FvV9U0JdER9uRsQlzp243MWuqFTesXICKpZXIyNHXEZI33LQAuSV5rGPoiiAImL/8eqx/6sGE7oa3paWgrKoMC26uQmZe7E8eFG0ZGMiiSYex1OqTsadHhDcOB9Y7ouwJ13RbHctzW0n84gvmgktJhzrQF9PnzczLwu0Prx2xRKqrvQsHPtiHPmdsX0ur3JI8VN1CLahwLDYLVt5zE2ZVzsKn7+2Fr9/HOlJMWGwWLFl7I0orSoe+tuDmKnz67l40nzwXs9dxzloSs+cin/FIKnY7RSxKNyLXHD/zEwJyqNt9hlXbfCVN75DGzwkAgOMglMd2/bXRZMSqDatHrXfOKcrB3Y/fi/xZ7HbPstltuPWBGmavH0/yZxVg3RPrUb5oHusok5aanoq7H793RDEftOKelTFtqTtLE3c/A9YkFTjkCuKUJ77OWI9ma/WIC7pHVOBJgmPsSGSE8htj+nzzllwX9lxuwSBg8Sp24/arNqyG2Wpm9vrxxmgy4sY7l+Fzj94FR7aDdZyoXbekIuxnkuM4LIrRZ1LlePTMTN55KdPlvFfG3h4R/jgZWJ/Sgk4HsZDhhPKlMdsGVjAIqFhaOe41rArqyntumpIx02QwoyAb93ztPiy5fSmM5vjbac40wWcuvzQfGTHYi8BVdANkA90wTgdXUMUup4iuOJgL5hEVDGg8iCbigt5JBZ0Mw1lSIJSMX4QjVVRWPGHBtjA4/GTe4nkJPdFrOnAch+uWVOD+J9Zj9vXx9bO02CYusnNi8Pmg7vbpFVSAg64gzvTrvwu+XeOqsogKelCJfl0cSVyx6nafWTHx7F5e4CEYpm9Dm5ziXCxZG9thhWRmSbFg5b034e6N92BGwQzWcSISSa9QLLbDpQlxbDQNyPi0J4iAjrvgtfaMR1TQO/tl3d/JkOkXq4lx+aX5EV03XVuOpmWlY/Xn14Cjk+ViLjMvC5979G7cdN/NYcen9cJsnfjzZrPbJrW5TiAlE15HYdSPJ5PTG1SwyxmEU6fzw7p9MoIabjgiK+gD1Dono/EFZeBSJjfpKSUtJeLxVXMEXaCTZUmx4PaH18JoNk75ayWzWfNnY90T61G5bD44Xp83TpF+3jJzo59j0T1nRdSPJbEhKir29wZxVqd1Tsua9Ihb6ISMZbKbzKRnpUd8bSQtpskwmk247Ytrdd9yTBQGowGLV1fj3q+tQ1a+vrrheYGH0RTZTV1aZlrUr+MsnbpNmkjkVAAN/RL29wYR1Flj/aKGG40JN5bR2uQnyUUoXwqpdkfUj7elp0R87VTOdDeajFj7yB2T2p1u99HGMb+enmpFVXlx1M8bb3YfbUTLRSfqGttR19g27rU11eVD/+5LTYHQfgkBX2A6Yo5Ly82jLS26G0BFMKC3mPZv15NuUcEup4glDiMcRn30HF0ekABE9rtvwoJOy9XIeIR5N4aWr6nR3fRZNcxen6qCLhgErPni7cjMi2wJUl1jG3YfPYvahjZc6HRi15GxC/lYaqrL4bDbUFVehKryYlSVF2Fmfnwvixv8eWzeWTvuz+LWxeWjvrbzcOOIf6uqAq/biyxOxaKCTFyXHXkPTiyZrZEvs7PYoluB4Sq8AYpAe+DrjV8JnbFeYTdgto39yZKSAlzxysiOIMuEnybqbifj4Syp4PNmQ+mMbhvMSLs1gamZFCcYBNz2xduRXZg97nV1jW3YdaQRLk9oS9Oa6nIsmFs01MIc6/rBawf/PPjvnYcbsHln7dC1DrsN62qqcP+qhVhXUxWjdza1XB4vXn1vP377530jWuEz8zNRUz1v6IaltCArqhuWhqZ27Nh6ENuPnYXVKOC67HTMmIY5FIPMGj5rxigPpuktjo//18lIBVDvkeAUFSxKN8LAuLHeFYuC7pdUuHU6+4/oB184N+qCbjBG/stwKlroNQ+uQk5xbtjvDxZhh92Kbz1yW8TPO7yLfayi7/J4UdfYjgudTtQ2tKGusR0bvvsfAIBH712B//XEvbpsuV/odOLZF97F797dByBUwB+9dwVqqsuxrqYKjhjNP5hXVoR5ZUV4pKsXB7fux+mz7ej2BqatqFs0fNaiXU7pzov/7XET3eVA6Iz1aocR6QyrepdXwfwIrhv3tyl1t5NICIXzIB3eEt2DNfwdiWVB5zgOtz6wCgWzwy8Zcnm8Uzb27bDbhgr9o/d+NtN515FGbN5Zi9ue/DlqqufpqrD/5Dfv4tkX3sW6miq8+MPHUFNdPuXZMnIycOdX78KcuiYc23lk2sbXtX3WtP+iVzkO7tyxe3eIvnjlUBf8fLsBMzUelhIrTr8MWQWECT5q4xb0K7SZDIkAXxR9S0PVMOEyVgVdEATc+kANCsuKxr0uVq1NLWqqy1FTXY5ffOcLqGtsw3Ov78DCecUjiv50G2yV11SX48pHv2DycymrKkNxeTGO7TyCprqmKX89LZPiVFV7L6Y3swSKIf62w01WigqccEvoFhUsTDNOWFhjTVWBbq+M3JTxbyjGLehdXiroZGJ8bikgGABZ+/G6ihz5L0Mt45rhGM1GrH7oNuQU5Uz6uaZaVXkxfvGdYrg8Xuw60hh2vH4quTxeuDxevPjDx6b9ta9ltpqx/K6VmLtoHg5tO4Dui91T91oauvZlSfvvSWqdx6dOvwJ3UMRShxGp09wF3xVBQQ+7Dn0gqMIv0XI1EgHBAD4/uj2tpWDkNwGTbaFbbBbc+ZXPxUUxH2549zyL19bbkrusq7vN3bzulinbM0DLZy0oar+RdedRQY9XA7KKPT0iOvzTO78skgZ22IJ+hVrnRAM+b3ZUjxP9YsTXTmaWe6rDjjsfvQuO7OjXmRN9Ka2chfuffABVtyyM+XNrKeiSGNT8/P0zZml+DNEPWQWO9QVx3C1hurZp6fUrkCZ4sfAFncbPiQZcWnSTo/xef8TX8gKvaVb8IEd2Bj736F2wO+yaH0v0TTAIuOGmBVj/9IMonhu7ngQtwzvBKAp6IEUfEx3J5LT6ZOzpEeGVp76qqwCu+MbvFaAWOokJ3h7dLyhvv1fT9Vr3c8+bmYc7v/q5aTvYhbCRmp6Kmg2rseYLtyE1BjdumrrcA1oLOgcxhXqKEoVHUrHbKeLyNJyx3jXBNrBjFnSfpGo+WJ0kt6hb6P0+TddrmX1ctnAubn/kDk2b15D4VjC7EOufegCLVi2OqjdnkEXD58yn8TMs2tKh8ux3ICOxI6nAIVcQpzxTe8b6RD3nY37iqXVOtOKibKH7BiLvcgciazlxHIfFq6tRcWNlVJlI/Ju//HrMWVCGYzuP4txxbcvceIGHQcPub74Bbb1MgVTqbk9U570yeoMKqtONsE7B2jaXXxl3PfqYLXQq6ESraFvooj8AWY788zZRQTcYDVj9hduomBNYbBasuHsl7n78XuQUR76yQetqCq9HYws9JbIzA0h8cgVV7HKK6JqCLngVQK8//O/LsQv6BAPvhFyLs6ZG/ViveyDia8cbC7elpeDujfegYFZB1FlI4snMzcQdX/4cah5cFdHESK3zLQb6+jVdHzRH/3eFxAdJBQ66gjjTH/su+J5x6vOofqWArMJD+7cTjVQp8uVn1+rvG4A9I7IzpcO1nrILs1GzYTVNfiNhFZeXoLi8BKcP1uPEp8fDLpnU0kKXJVnTSg0AMAS1tehJ/GoakOEUVSxxGGDmY9MF3zPO+vdRBb13mhfLkwQRjL6ga2nhmMb4ZTtv8TwsvWNZ1K9PkkvFjZWYs2AO6nbXouFow6jvj/UZC6ffpa11DgCCqO0GgMS33qCCXc4gqtMNyDKFXVgWMaeWLncq6CQqk2ih9zn7Ir7WMmzZmmAQcOv6GirmRDOTxYyldyzD/U+uR15p/ojvaZnh7up2aX5tgVroSUdUVOzvDeLsBMvOIuENqgiEWfc+qoXumoa1dCTxTKbL3dXVG/G1g8vWUtNTseqhNXDMcET9upPh8njDHlKiyAokfxCyKEMOSgj6glCH7VlvsJpgtBhhSjFDMCXW8qWgPwhxIACxPzDiPQsmAwSTAIPFCF7gYUqZvrPNx2PPSMPtD69Fa0Mrjuw4hAH3gKa9DrR8dgcJorZZ8SQxqAAa+kNnrFenG2GcRGO9x6cgP3X0744xutxphjuJwiS63HuvaCnoZhSVFeGmdbfEdH25LIYKrynVDF6Y+G9aT48HwQERKSYjZFG6+o+MoE8cOnCm3dmH9qu9D/Vtl5FmtaBoRjoAYHl5CQDAaDUhJdsOW2ZKzN7LdFNkBQNXPPD1DEC6uq/58Pe+v+ECKotzkXZ1fsPgezeYDBBMBphSQwXUnGrB8aYOzC7NRaZj4p+HLEoI9AdgzbCB4yY3PlkyrwSFcwpRt6dW0xh6b1eP5teiMfTk1i0q2OUUscRhhMMY3ee2xy9PXNBlFbShDImKOolxQf+AH75+L6ypEx+0Yc+wY9Xn10T9WuEIJgO6Gy8NFSSj1QRe4OH2+ocK0fBibQbQ7e3F8/tOIM1qwR0L5wIAttedRZ/XD7c3gMriHKTZLEizmvH46uqh19rf2IqtR88AwNB1iypmIqN0BgQN65/1IODxo6e5Cy6PF/XtXXB7/Wh39qGyOBdFWekoykrHsrIiuL1+1Ld3AQB+uXk30mxmpFktqCzOQVFWOty+APY3tGL5vBL4FB4duAIA8KkKeIEf+n/g9vqRYjAM/X+yZabG7GZIMAhYvLp66LkjcaXjiubXMfg8mh9DEotfCZ2xXmE3YLZNey9duIlxI3579ND+7SRKateFST3+0oVLmDV/4gNeJrP710TSCjPgbLoMty+ANFkZamF2ASjKSke7sw/17V2oLAoVIbvZhMdXVePJX7+NNz89DiDU+kyzmrGsrAgHzrYNPfe2Y40jXquyOAfL5oaudfsCaGruxMWjjbhv3XIYbfFxTnb/5T60NlwM9T7YLFg2J3S+fH17F7bXnQ37uKKsdKgA+gZ8ePHDQ6hv70Ka1Yxv33MTCh12qLICty8w9LyVRTloau4M/X+xmpFms8Dt9aMkJwPpxbFf0x3pZ6zf5UHAF9D8/IIUgMVzBX57tubHksShAqj3hLrgF6UboeU0VmeYpWsjPrk0fk6ipVxqntTju9q6IiroU8makQJLmhV9/T68+elxFGWGWo4dPW4UZoaW1S2fW4z69i68tOMQOI6D3WLGhhvnI81mxvbjTTjQ2Ir9wwr5RO5YUIYNy67H2gVlKHTY0XT4HMqqZ8OokzHmcNztPehr74EqK1g2pwjtPX34yZs7sK2uCe09kU1yTLOasXxuMb5910qk2czY39CK/Q2tsFvN8PgC2LB8Pk63X0Ffvw9uXwDtzj7cUVWGN/cex/K5xbBXzYpoeEQrWZYhGCZuNXW1a2+dD0pxtlBBJwCAywEFu50iqh1GpEdY1YOKin5RQeo1s+Y5VVWH+tgPdgZwwa39bF9C/C88A/nCyagfn5aZhnVPrI9hougokoKD246hIN2O57bsw4Gmdqy9YQ72N7Uh3WqB2xeA2+cHwKGjp+/qfwdQWZiN+ii6XwctKyvG//zcciwrKwZv4JG3cCYMZn3uQe9z9uPKmYsAALcvgF9t2YeXdx2N+vmKrt4sua+2disKB3d1U1FZmIP6ji4sKysGB2B/Uxue//r96JZFrLqzeuwnnCRZiqygH9iyH2drGye8bizNKx/DhSWfj+qxJDHxHDDfbsBMa2Rd8CsKzCiyj+xNohY6iQnl8vlJPd7d44bX44UtzMzx6cIbeCy+dT6OfHwSaytnodCRiu/91/ZQV6/VjPYe95iPG6+YL5tbCgA4cLYl7DUHmtrwkz/5UFmYg7+//1YYz3Qit6pkMm9lSkj+ILobLkKVZbx1qB6v7D4GzwRn2lcU5SHNakF9+yV4fKPnWlz7Mz3Q1Dbsz+0oykzDr7bsw41zCvEvD9+Bwxc68ehjt8XmDY0h0gl2nS0Xo36NFGdL1I8liUlRgRNuCd2igoVpxrD7tQ9yi6Pnuw211xUVcFNBJ1FQ2hug+iPfvjWci80dMUgzeaZUCxbdUgFwHNqdffjnL9wOu8UUtpiHs6xiLhaUzcLlfh/6JRVzC/NRMbMY188qwey8z/YWT7NacOPsQqhqaNLXc1v24ejJZvR3al/jPNVc57sgB4J4bss+bD9xDmlWM67LnzGsVQ3MzsvB/FkzMX/WTMwtzAdvNKNfUmGzmLH0urKhCW6Rau9x45trb8TGmxficNslPPrYbeAjaEFHK5Ju/L7uvqg2lRmU2Vob9WNJYuv0h7rg+6XxJ6iPVa+FH/3oRz8CgN6AguY+6m4n2gUPfQDl/PFJP4+iqMzH0QcZLCaUzMzBTKMZr31yHBUF2bAYDbBbzAhIEkRp7AmkN1RW4JEvfRlPPfUUtuzYibJ5Ffjbv/t7rF57Bw4cPAxvIAhJ5cAZjMh0OJCVloqCzAwcPncBs3MzMSPFim6PD6qqAgMBlF0/c5rfeXiST8S5I+fwh/0nYTYIOH3xCgozHTh04RLuefAh/PjZZ1GQl48zjU2QVA6SykHlDUN/NpmtUA0mPPTII1i7qgZ2kxFnz7eEfb1Chx1FGWlYWJKHbs8Abr5hNh7buHZKi3mkzh5rxOXWS1E/XpACcM5aRge1kDEFVaDNL8Mm8EgLN67OAWWOkcNyQ13ufdQ6J1GSGw7E5HkutXRC9IswWfQxy9tkt6Ji9fX4l9x0vPz2J/jTkdNjdi8XZWfime/+DR74wsMoLS0FADz++OPY8OCD+Od//T9D152pP42XX3ppxGNV3gCXKKMgNw+XvBIu93fjL1ctwtbjZ7G0JA+njp3D/EVzpvR9Rqqn6RLq27pwuuMKZuZnITM3Gx+dOo//fPE/8fmHHgIA3HX33fjTW2+FfQ6/348D+/fjvfffh8PhgMvlwo7338VvnvtXbD1YN+LaDpcHHS4PlpUV4dtfXaubnwMAnD81uUmgAJB14TA8Ofp5T0RfZBU41heEUxRwvd2Aa7eCH6uFPlTQ6UAWEg3V0wOlI7qJQddSFAWtZy6g7Oqabj3gDQJKF5TixwtK8fTGO3C49hz21rfAYbfBYDHixrV3Y/WGJ0c8xuVy4YP338fhI0dGfN2eFv4AGkVRwBlM4M0WtKfnY92tNrxd24inCvTRglOCMtyt3Wi40ovP33Mjtp7uwqHGBjz8xS8OFfNBy5Yvx4H9+0c9R0AUYTaZcOliJ55//nl8//vfh8PhwIYvfQUbvvQVnKvbj22/fQ5Brw9tV1yYmZeJ6qo5WLq4bLreZkR6LvXArXH4ZSyZLYfRsvSLMUhEElmrL3TG+lKHEbZrBtbdooK0YTPdhwp6PxV0EgXp+M6YPl/zyXMTFvRgIAgjgxngeTNzcO/MHNx7/woAAF+8EnzuDaOu+4e//3vIQQlFRUUjvt7R3h72uVNsNnj6+2GQDOgLcLDfeDOeWlyG45+eQfWaKvBGtt3M/Zd6cdLjwcKbKpA1swIPVJdi654nUVxcPOI6j8czZjEHALPJNFTUf/mLX+D73//+iO/PqVqOp346F3LDO4Ac/c6Dk+Eb8MGaYh33mnMnmmLyWumdZ2Du70YgdUZMno8kLo+kYrdTxKJ0I3LNnxVwd2BkQR/6k2eMGXOETEQ69F5Mn6+rvQvOS85xr5HDjF9PJ85ROmYxB4BNmzfDYrGMKGyvvPQy3vrjH8d9zqAkwWqx4Le//S1W3/15LHvwG3j8ybvR08t+ZzEp1YJFNddj9rxKrH7423jllVegygr2D3uPHR0d+NIXHx73eRQl1HAQDAbU1o6eGMbZsiDMWh3b8BqIE2wUE/AF0DTOpjla5Z/aHrPnIolNUoFDriBOeT47Y/3aofJhBZ1a6EQb5WITlCuRb6ISqYNbD2DY9gijX1dh/1kNV8xbWlrQ0dEBs8mEv3nmO3j6iSex6uZb8NNnn434uRcsWIBNmzaBnzEPhqKFmJHD5gCa4TIzUuHIysHi+56Gy+XC5s2bYbhalNfdex+efuJJ1Nx0M07X14/7PKIYannzHIdNmzaNeQ3nKAVntsf8PUQiGBx/YvCRHYdiekOZd+ajmD0XSQ7nvTL29ojwyeqopWs8ENq/ndrnRCvp2NS0Lpyd3ajbo+9lPZy9YMyvt7S0IM0eGis/19yM7du2oX2crvbhBJ5HQBThHRgYar3yxSvB2bJiE3qSMhc+AAimoWxWiwWKouCTTz7B9m3bInoOgyE0yucd8GLnzp1hrwv3851ySvjfhC3159F8cvKT4Yaz9l1C+sXxb4IIuZYrqGKXU8SZvuCIr/MAjZ8T7dSAD9KRLVP2/Cc/PYHWhtYxvxfJLl6s1NbWInj15DmjIfJ955ctXw6TyQRFUZCZmYmWlpah7/Fz7ox1TM34giVDNxbDs2mxbPly8HyoU9BsmmAlg4lNC33UVOKrnJec2Pfep1PyksXHNk/J85LEJqnAzisi3jjvHboP5QHAE6SCTrSR9m+GGpjaYyD3bN6FC2dGH/oSy2NToyZOPK4taxga2Pi1x4f+bLWOnJTFme3gZ8yLPFusCaYRQwyDS/O02vi1x4eGSwYLeziqJ/pd2CZjrFyubhc++u8PIctTM3cj+9w+WNyXp+S5SeJ7r82PhqstdQMA9NOEOKKFLCG4N/xa41hRFRV7Nu3C+bIizFtSgbyZeeA4Dn3OPlhTrbBo3HEslpTeljHH0RcuXAi7PdS6nGisv6KyEoWFhdjw0Oex9o478PNf/hLbtm5Ft7Mbs+eMXJ/MOUqB7oaY5deCsxcAwtgt6okK87Xv8cWXX8Y7mzah+XwzRCnMeLUsMivovn4fkBv6s/OSE+dPNqPh6Bmo43TFT56KmYffRMOav5rC1yCJrPvq5DgDQBPiiDbSse1QByI7USsW2pva0d40chz69ofXIq80f9oyXOt87UeYc+fogl5aWopAIAC7LWXCgn66vh6n6+tRXFyMtXfcgffefRd79+yByWbF4uprDh4R2J2+xtlGLqtauHAhgM/Wlff2hd+i9tr3uHXLB/hw+3ZYU1Nw2+23j/mYnrOfIvyK/amjqip2/vGjcSdkTpWCk1txfvmXIdoypv21SfxzXj0fPTSGHqQWOomQqkL8+HXWKeDqZrvPuct5BR+/8/tRXy8tLUXWjBlDxU4K1wod5uWXXsKv/u05/PnPfwbP87jY0YH169mfPDdEHrmUy+FwoLKycmjGukGYeK7Ayy+9hJdefBGb3w7NbHd7PNi4ceOo61rOncX52l2TzxyFvm4Xk2I+qPjo2LP+CZnIYAudVwEMUAudREg6sQuqi/14X1/39PUQjKWqvBjH9ryPTX/8w6jv/eAHP4AkSzAYDAiIkW2Qsn3bNhgNBvj8fmRmZQ21godEMGY/Vcbq/v7GN74B7uohJik2G3z+0aeoXeuF538Ng8EASZKgKMqo91hbW4uXn3sWM3NZtM/Zf6YKT34AQyD6A19I8hpqofskWrJGIhf8+DXWEQCEWlOsPXr3UvzoB3+HV155ZcTXN27cCMFggKIoQwVsIkePHkWKzQaz1YKr5yWNoFw8HKPU2qleJ1RP54ivrV+/Hj6/H4qiwGqxDLXWw5EkCV2XQzeC9vR0/OQnPxnx/ZaWFvz1Xz2JmZkCHIyO0GXd6yOIPhTVvcs0A4lP3YHQhE1elKmck8jIp/dB6Ro965yFiXaTm2p1jW34H8/+Duk2E/7tX36K5557bsT3/9+//zuMZhPMJhOCERR0RVHA8zxUYFRXtNL2KdQA293ilJaPR2zHWlpair94+mm43KE9ze2pqeP2RvA8D57nkTVjBhyZGSPeY21tLdbfdzdKMgQ89/oObN7JZg+Cnss9TF53uKLadyAEJ+7tIGQ4p1+BCoAPUEEnkVBViFt+wzrFEFmSmbao6hrbsa6mCjt+/Qy+9YWb8dLzz+HxjY/B5QplWr9+PaoWLYLBaITVYhm32ElXt3wNKjLefvvtz74hi1BadkK5fGKq386E1IAHcsM7I1rqP/unf4LFZh26GRlv3T3P87Db7VB5Dq+++urQ1zdt2oRv/+WTqCp14MUfPoY//fxpvLOrDi6Pd0rfz1i6O65M+2tey+j3oOTI1K8gIYlFVoE+UaEWOomMdGw7lO7IdjybLs6L3cxeu6a6HI/eu2Lov1s7LuPtt97EqptXDO2A9sYbb+DGFcthMBrH3UiF53mA4/C9730PCxcuRG9nM5SWneje+xsojJaqjUX1OiE3vAO5aSt6mw8DsogDBw7AaA69t/GWsCmKgsKSYrzwwgsoLS2Fy+XCA/ffh2//5ZOoO3ESLo8XLo8XM/Oz8PNnHkJd4/R+1gb6BhCYYB/36VJ8bBOMfvb795P44vQrEP7ib3/wo0sD7A+7IDomS/D//odAYPpbTeOxplhRVFY08YVTYHCcd9eRRvzqDx/hvf/7TVx2umE1An/4rz/ghef/AxZBwV8/8x04e11obm6GFGaf8MxMB6oXlGPpnHR4z+1Gmr8FZtkNi3H8Nd7M+F0w+zpx/tgOfLTjQ+Tk5uJUYzNkSR6zqJvNZiy+cSleevll1B78BP/8v3+Mn/30x3AYRZiNAl77x6/D5fFh675TuHPlfFjMRpQWTO92t50tnWgdYxMjFnhFAi+J6CmtnvhiQq6qyjKCO9Utqqe62RxVSOJDcO9bEN//NesYo2TkZuKex+9lmuHrP/4tfv7MQ0MFfvPOWnznF2/gQmcPZuZn4UJnaKy/pCAbsqzCagm1Zi1GAQaBx4oFs7DhtsWoqS5n9h5ioa6xDe/sOo7D9a1ovdQD8Dz8gdDuVVd6+uCwW3Hhao+Kw26Dy+PFo/euGPGze/aFd/GtR9YwmRR39OMjqD9watpfdzz7Nr4If1oO6xgkTjw+NwUGGkMn41EDXgR3vDrxhQz0Xu5hdjY6ALg83lEFyGG3IT3Vhg+f34hdRxoBAFXlRSOuufa/E0FVeTGqykNno7s8XjjstqH3P6iusQ0ujw+lBVlwebzYdaRxxM/hW4+sQV+/j8nPpquta9pfcyKz972K+ju/wzoGiRN9QQUGGkMn4wnu/ANUnXW1D9d5/iJKrpvJ5LUddtuo4rN5Zy12/PoZOOy2uG91R2vwZ3Lt+7/2v10e31DxH/646RYMiOi+yH5C3LVyG3biwpINGMgqZR2FxAG3qNIsdxKe6u5G8NO3J76QoY7mDtYRRnjsvhUJ1/qeKt96ZM3QkMQgFj+7i+c7J76IkbJPXmYdgcQJd5BmuZNxiB/9HpD0Pb+io0lfM+9n5uvj7PJ44LDbhrrpWeo8r6+bwuEyLxyFo+Mk6xgkDrhFhVroZGxq35UpPe88VvxeP3p1sCHIIGqdx5/2s/q6KbzWHGqlkwi4gyq10MnYxA9fATSc581S29k21hFInOq53AO/V987s6VdbsSM5gOsYxCd6xMV8FJ8/M4m00jpbod0dDvrGBHTy/phEn/aGlpZR4jI7H2/Yx2B6NyApEKnO1cQloKf/JF1BE1c3S54et2sY5A41NoQHzeDKc5WZJ/7lHUMonNU0MkI6kAfpKPbWMfQrKW+hXUEEmc8vW70OdkemapFyeH4utEm048KOhkhuPctQJ74dDC9aTl9nnUEEmdaTrewjqBJ2uWzSL9YzzoG0TEq6OQzoh/SgT+zThGVvu4+Xc12J/p3/lT83QSWHP0T6whEx6igkyFS7YdQ/QOsY0Tt3IlzrCOQONFzqQfuOOpuHzSj+SAsHv3takf0gQo6GRLct5l1hElpPnkOSpwstSNsnT/VzDpClFQUnNT//hCEDSroBAAgt9ZD6YqPGb/hiH4RHU363fWL6IOqqnFc0IGCEx+AU+jIazIaFXQCAJAOvss6Qkw01Z1lHYHo3MXmDt1vJjMeo99DG82QMVFBJ0AwAOnkHtYpYqLjXDvcPbQmnYR35vAZ1hEmLa/hY9YRiA5RQSeQzuwHggHWMWLm1H46zIKMzd3jRuf5i6xjTFpmy2EIoo91DKIzVNAJ5BO7WEeIqeaT5+D16PcMd8JOotzs8bKEGeep252MRAU92Yl+SA0HWaeIKVVRcfoQbcBBRgr4Ajh3vIl1jJjJadrLOgLRGSroSU6+cEr3Z55Ho/FoAwK+xBlGIJNXfyAxWueDHG3HWUcgOkMFPcnJradYR5gSsiQnTPcqmTzRL6LhaAPrGDFlEL1IcbawjkF0hAp6klNaErfoNRw5Q610AgA4fagekhh/ZxRMJL0z/mfsk9ihgp7MVBVya+KONcuSjJP7TrCOQRiTRAkNRxKz8KV3nmYdgegIFfQkpjg7EnL8fLjGIw3w9dOM92R26sBJiP7E/JyndrewjkB0hAp6ElN7L7GOMOVkWcbhDw+zjkEY8Xv9qN+fmPNEAMDi7mIdgegIFfQklgwFHQAunGlB90U6oSoZ1e46CllO3H3PDYF+8Aney0YiRwU9iSlJUtAB4OBW2oQj2Xh6PWiqS5x15+HYXPG/8x2JDSroSUzt72UdYdr0XO7B2dpG1jHINDqwdT/rCNPC6HOxjkB0ggp6MkvgrsixHNt5lJaxJYm2xjZcaulkHWNa0FGqZBAV9GSmqqwTTCvRL+Lox0dYxyBTTJZlHPowsbYzHg/HOgDRDSroyUxVWCeYdueON+FKB02QS2T1B07B6x5gHWP6JNmNOQmPCnoyM5pZJ2Bi75/3QAom3q5hJHQ86slPk2szIdloYR2B6AQV9CTGZ+SxjsBEv6sfB5NkwlQyUWQFu9/eCVlKrjFlf1ou6whEJ6igJzEuq4B1BGaaTzajpf486xgkhmp3H4PrSnLN+FY5Hn57NusYRCeooCcxPjOfdQSm9n+wD55eD+sYJAa62rpQfyBxd4QLx5dRyDoC0REq6EmMyy5mHYEpKShhz+ZdUBWaVBTPpKCEvX/ewzoGEwOZyf13mIxEBT2JcZZUCKU3sI7BVM+lHtTtqWUdg0zCoW0HMJBMs9qH6SlZzDoC0REq6ElOuP4W1hGYO7nvBO31Hqcunr+IcyfOsY7BCIcrZStZhyA6QgU9yRmuvxXgaGuK3W/vgn/AzzoG0WDAPYC97yRnVzsAuHPnImixs45BdIQKepLj7JkQZi1gHYM5r8eLHf+9PemWPMUrWZLx0RsfJvVWvlfm3sw6AtEZKugExtVfYR1BF3q7erF70y7WMUgE9mzejb7uPtYxmAla7Oi44S7WMYjOUEEnEGZXQZhVxTqGLnQ0tdN+7zpXt6cW7WfbWMdg6sKSh2iHODIKb6CSTgCY7vwa6wi6UX/gFB21qlOtDRdwYu9x1jGYEm0OdFTdwzoG0RmzwIG3CFTRCcAXV8BQtYZ1DN04uPUAOs51sI5BhnFecmLvO5+wjsFcw23fhCKYWMcgOpNu4sCbDTTDmYSY7v8WuLQs1jF0QVVV7Nm0Cz2XnKyjEIRmtH/03x9ClpN70uLl61aje9aNrGMQHUo38uAtAusYRC84sw3mh77HOoZuSEEJH/7Xh+hzJu/kKz3we/3Y/vq2pJ7RDgBiSiYaVz3FOgbRqXQTD95Cg+hkGGH2QhhXPsA6hm6I/gC2v7YVnl436yhJSfSL+PD1beh30Z77J+/6HiSTjXUMolOOUEGnLncykumuJ8AXzmUdQzf8Xj+2/X4rHeQyzSRRwkdvfAhXd3KdoDaWppu/hr6CStYxiI6lmTjwFoEKOrkGL8DylR+Ds6WxTqIbvgEftr76AXq7ellHSQrBQBDbXt+K7ovdrKMw5yxdirbF1GtGxpdu5GlSHBkblzYD5i/9gHUMXfF7/dj22hba932KBXwBbHttC01IBDCQVYJTd/0t6xgkDoTG0KmFTsIQZlXB/Mg/sI6hK8FAENtf34bO8xdZR0lIoeGNLdQTAiCQkom69T+hDWRIRBwmjsbQyfgM198K0x206cxwsiTj4zc/QmtDK+soCWXAPYAtv3ufVhUAkMwpqH3wHxFIyWQdhcSJdBMPPsVIBZ2Mz1jzMIzL7mMdQ1cURcHut3eiqfYs6ygJwdPrxpbffYB+Vz/rKLpwfN0P4c0oZB2DxJFMMx/ay51a6WQipvv+CkLFCtYxdGf/ln2o3XWMdYy41n3xCrb87gP4+r2sozCnchxO3PsP6MuvYB2FxJEsc2j5OQ8AqUZai04mwHGwPPID8EXzWCfRnZP7TmDXWx9DCkqso8SdtrNt2Pba1qTfNGZQw5pvonv2MtYxSJzJtoZ2iOMBgLrdSUQEAyyP/wz8jCLWSXSn7Wwbtr76AXz9PtZR4saJvcex662PocgK6yi6cGHJQ+icv5Z1DBKHcizDWuhU0EmkOEsqLBt/Bs6ayjqK7vR29WLb61shUYEal6Io+OiNHajbU8s6im5cKVuJ5pVfZR2DxKnskQWdutxJ5LiMXFge/SkgGFhH0R3RL8IXCCIgUvf7WBRFRUfLJVxsppPsBnly5qL+zu8CoIYViU6OZViXe6qJPkhEG76kEuZ132QdQ7dESYbXL0JRVdZRdCMoyRjwi5AkutkZJKZkou7+H0ERjKyjkDiWbaUWOpkkw5K7IFSsZB1Dt2RFhdcvJn0XvArAFwjCT70Wo5xe+20ErbTFMpmcES10q4EDR410EgXzhu+CS0lnHUO3VDW5i5msqPD66KZmLB033I2ekkWsY5A4Z+AB+9V5cENNc1q6RqLBWVNhfvC7rGPoXlCSMeATISvJU9gCQYmGHcLwp+Wg6Zavs45BEkD+1SVrwLCCTjPdSbSE65ZBmFvNOobuKaoKrz80YS6Ra5ysKBjwixCDMusounVu5WNQDCbWMUgCyBmroKebqYVOome66wnWEeKGeHVyWFBKrIKnqir8ogSvPwhFSeA7lknyZhShq/xW1jFIgiiyUUEnMcbnzoJhwWrWMeLGZ8VPTIjiF0zQm5SpcH75l1lHIAmkKIUKOpkCxtsfZR0h7siKigG/iEBQQjyW9cH8/gQfRogVf1ouuubezDoGSSDFYxX0NBNP2xqQSeGzCsEXlLGOEZfEYGjSnBgnLVxFUeELBBOmh2G6XJ5XwzoCSSACB+SN1eXOc0CqiVrpZHKo2z16qqoiIEro13FhV5TQUMEAra+PyqXr6O8HiZ2iFGFEQ3xEBadudzJZQhnNdp+szwp7AGJQ1kVXtiwr8AWCNE4+CaItA94MOtiIxE5xysjtt6mgk5ji82aBM1tZx0gIqhpayz3gD4TG2BlUdkkOLUHzBoLUIp+knpKFrCOQBDN8QhxABZ3EGseBL5nPOkVCUdXQGHu/L3Twy1QXVkVVEQhKQ69HY+Sx4c6vYB2BJJjiawr6iPZ6Oh3SQmKAzyqAfJZ1isQkyQokWQHPcTAZBRgEHlwM9m1W1dCGMKIkQ6aW+JTwZhSyjkASzLUt9BEFPdXEQ+AB+vtMJoPLol9cU025uo4dADiOg0HgYTTwEPjIe9lkWUFQViDLCm3POg28jgLWEUgCSTVycFwzkX3UgdaZFgFXvDTphUSPs9HpUdNJVVUEJRlBSQYHgOM58BwHnufAXZ0Dq0KFqoZuBFRFpQLOAJ2qRmKpzD6qfI8u6FkWngo6mRSaFMeOCoQKNlSA/hrrhspxUATau53ETlna6II+qn8uyyqMuogQTejQCUJGkI021hFIgpkTWUGnme5kclTRzzoCIbrCyyLrCCSBcADmRlLQzQJHR6mSyZHolxchw/FykHUEkkCKUwQY+dF1eszmOHW7k8lQ3U7WEQjRHZO3l3UEkiDG6m4HwhT0TAt1u5Poqa4u1hEI0R2Lp5t1BJIgxpoQB1ALnUwBpeci6wiE6I7FfZl1BJIgNLXQHWYeY3TPExIRpYO2iSPkWqlXmllHIAnAInDID9PoHrOg8xyQZaFWOtFO9fRAHXCxjkGI7lBBJ7FQ4TCG/V7YwfJsG42jE+3k1nrWEQjRpfTO06wjkARQ4Ri7ux0Yp6DnpFALnWinXDjJOgIhumQQvbD1trOOQeLc/Gha6DMsAgQaRycayS0nWEcgRLccHadYRyBxzGbgRp2wNlzYgs5xwAwbtdJJ5FRPD02II2QcWecPso5A4tiCjPCtc2Ccgg4AOVTQiQbSyd2sIxCia5mtR8HTTookSpWTKei5VNCJBvLxnawjEKJrvCwhu3k/6xgkTlWOM34OTFDQHRYeBlqQTiKg9l6iGe4AOI7+vkxEMISfpZsMck9/xDoCiUNZZh7ZE+ziOu53OQC5tHyNRCB4ZAvrCLpgstDRsRMxWc2sIzCVdeEITF7aq4Foc/0E3e3ABAUdoHF0EgFFhnToA9YpdMFss7COoHvJXtABIP/UNtYRSJyZqLsdiKCg56cmd/cYmZhUvxdqP50kBVCxioTRNPEvpkRXcHILAJV1DBInOMSohZ5i5GA3Ubc7CU/6dBPrCLphtlILPRIpjlTWEZiyeK5gRjMtYSORKUszINU48fyciCp1Pu0aR8JQ2hsg0+5wQxy5GawjxIWs/GzWEZgrPkY3wiQyC7Mim5sTWUFPpYJOxhbc8ybrCLqSVUiFKhKZBTNYR2DO0XES9q5zrGOQOLAoK7JhqogKerZNgJGWr5FrKM4OSKf2sI6hG2abBTZ7CusYcSGrgG58AGDm4TdYRyA65zDxKIxwcnpEBZ0DkEfd7uQawZ2vAypN7BmUU5LLOkLcSM2ww5JiZR2DueymfbC5OljHIDq2NDvypbARz3ajbncynOK8CKl2B+sYulIwt4R1hLhSesMc1hF0QMWsfb9nHYLo2MLMyFeFRFzQC6igk2HEd/8dUBTWMXQjJT0VebMKWMeIK7MWzAVHQ3nIOfsJjaWTMZl4LqL154MiLuhGnsMMKxV1AsjNdZAbD7GOoStzFpazjhB3TBYTiubNZB1DF+bu+jXrCESHqjKN0HLPq2mBObXSCQCIW37DOoKuGExGlFTOYh0jLpUvqWQdQRfSO08js/UY6xhEZyKd3T5IU0EvTqNd45Kd3HAASkcj6xi6UrHieghG+rsRjdQMO+ZWV7COoQuzP32VdQSiIwIHVM/QdjaEpoJuM3DIom735KWqEN+nrsHhUjPSMGvBXNYx4tq8ZfNhtdtYx2DO3nUWBSe3so5BdGJRlgkWQdscE817upakUUFPVlLtDijd7axj6ErVmiV0ZOokCQYBVWuWsI6hC3P2vgyTl85FIMCKHO0nN2ov6HYD6NdXEgoGIG79T9YpdKWkchZm0M5wMZE7Mx/lS2k83RAYQNlu+nuW7CwCh0URbvc6nOaCbhI45NImM0lH/Pg1qJ4e1jF0Y0ZRDhauWco6RkKpWHED8ucUso7BXG7jbjg66HyEZLYs2wSNve0AgP8PAAD//+3deXCc933f8fezz55YYHdxLw7iJAmA4H2L4k0dtpw4sXM17jROMs0xk7RxPOl0Mk2nSZumbiaZ6fQPT9okbWIndRzbsmxJlmidpkWRIsX7BgES930sFsDe+zz9A6IsiReO3X2eZ/f7muGIQxG7XwK7z2d/v+f3+/5WdIxagyyOKyj69AjJd75tdBmmEaguY+9nD8oe6izY8ewT+Mr9RpdhuPVvfRVFlz4PhWol0+2wwkCvL7Gv6NODsKb4C/8D0imjyzAFf2Up+z53GNUus1TZoNpVnvz8EUqry4wuxVDe6QFqr7xidBnCAD6HjfZlNJP5qBUFuqpAbbGM0gtB+uZ7pHtkfyxAsLmWA79wDIdzZW82sTROj4v9P3+UYEthT7+3nPo6jtic0WWIHHuy2rnidWorCnSQafeCoOskXpFtagCt29rY89MHZGSeIzZVZc9P7Wft9jajSzGMPb5A49lvGl2GyLEnqlwr/toVB3rQq+KSefe8lnr/lYLfpuZ0O9nx7F42HthqdCkFqXP/Vvb//FFKynxGl2KI+ksv4w6PGV2GyJG6IpXGVXRkXXGg2xRo9ssoPW+lEiRe+zujqzBU08ZWnvriZ6TfuMHKays5/MvP0r53IzZ1xZcsS1K0FC3vfs3oMkSOHK1d+egcYFWJ3BpwcHM6uaoChDklf/wt9IWQ0WUYorIhSMfejZQGy40uRXzAptpo291Jy5Z19F27S//1O8xNh40uKyequ04wsP1nmauSjoT5zG6DJ6tXF+iKruv6ah7g7f4YE9H0qooQ5qJH54n++b9ET0SNLiWnGjtbaN3WVrDTu1YzOxli8GYvQ7cHiM5FjC4nq6Ybd3DpZ/7Y6DJEFu2rcvJb7cWreoxVz5k3B+wS6Hkmdeq7BRPmFfXV1LTWUre+AZfHbXQ5Yhn8FQH8+7fSuX8rofFpRnqGGOrqZ2F23ujSMq6s7xzeqT4WyuX2T746XLP668+qR+iaDt/vjpDUVvUwwiyScSJf+WX0WP5dFGFx9XRVY5Da1nqqm2txulfWwEGYV3hqlpHuQYa7BwhPzRpdTsZMrN3H1ef+0OgyRBZUe1T+fNfqGyqteoRuU6DRZ6c7JPfS80HyvRfzLswdTgfBljpqWuuoaqyRrWd5zlfux1fup21PJwuhOYa7BxnuHiQ0bu3WxZXdpygKDREJFPb+/Hx0uGZ1987vWfUIHWA2rvHD3sKYos1r6dTi6Dxi/VGN2+uhprWOmtZ6KuqqpE2rIDK38MHIfZDpkUmjy1mR0Y5j3Hj6S0aXITJIVeB/7i2l2LH6a1RG9p35XTZK3TZmYtJ72MpSF9+wdJh7AyXUrq2nprW+4FuHivsVlXhp3dZG67Y2YgtRRnqGGO4eZGponAyMa3IieOMNep78IomiUqNLERmyvdyZkTCHDAU6LG5he380nqmHEwZIvvei0SUsW6C6jNrWeoItdbI6XSyZ2+uhefNamjevJRGNM3JniJHuQSYGxtA0cw9Maq69Rt+uXzS6DJEhq917/lEZC/RGn53LEwkSaWt80hUfp433oQ11GV3GYymKQkV9FTUtdQRb6/AUFxldkrA4p8dFY2cLjZ0tJBNJRu8MM9IzwFjvCFrafOFee/U4fbt+AVbc8VuYRY1HZcMKD2J5kIwFuk2BFr9dGs1YVPLk80aX8FCqfXFlek1LPcGWWhwuWZkussPhdLCmvZE17Y2kkynGekcY7hlk9O4w6aQ5Thx0z41T3nuOqaadRpciVukzDZndKpvR3q2tpQ5uTSeRMbrFJOOkLr1pdBUf43A5CbbUUtNST1VjUFami5xTHXZq162hdt0atHSa8b7RxXDvGSKZMHbgUnv1VQl0i/M5bOxbxUEsD5LRQC+yK9SV2BmcM8cnWbE0qUtvQdL49Q9ur4eatfXUttZRXisr04V52FSVYEsdwZY6tGMakwPjDPcMMNI9SCKWyHk9FXfewxENk/TIuhGrerrORabPN8v46SrrSiXQrSZ1/aRhz11S5qOmtZ6aljoCsjJdWIDNZqOqMUhVY5AtR3YyNTTBcM8gw7cHiEdiOaujvPcsox3HcvZ8InPsChyrzXxnyowHeoVHJeCyEYqbbzGJeIBknHT3uZw+ZWmwnJqWxT3ixaUlOX1uITLp3iLNivoqNh/azvTIFCM9AznpL19557QEukUdCLrw2jM/A5mV80/XlTo4K1vYLCHVdQbS2Z1RUWwKFXVViyPx1jrcXk9Wn08Io5TVlFNWU/5Bf/kZhrsHGL49kJX+8qV9F7ClU2iqHGNtJQrwbH12zo3IyiuhwWfnkmxhs4T0jVNZedzFlek11LTWE2yuxeHK3NYMIawgUFVKoKqUDfs2Z6W/vJqKU9p/ganmXRl5PJEbm8sc1Hiys8g3K4FuU2BtwM71KdnCZnbpW2cz9lhOt5Ng82LP9MoGWZkuxD3Z6i9fNnBRAt1insvS6ByyFOgA68scdM2kSMkpbKalz8+sutWrp7jow6n08rpKFEVWpgvxKN5ACet2drBuZ8eq+8sXT97NQoUiW9b57LRnsJHMJ2Ut0B02hbWldm7KKN20tJE7K/q6knL/h4vaAlXSU1qIlVptf3nvZG/2ixQZ89MN2V0/lNXVFG2lDm5PJ5Fb6eakjS490EuD5dS0Lu4R9wZkZboQmbaS/vKO2Byu+SnixeU5rlYsV12Rypay7K4lymqgO1WFtR90jxPm86hAt9lsiz3TWxfbrcrKdCFyZzn95b1TvRLoFvD5puxfQ7O+36GtzEH3jIzSzUifHrnvz6qbaqhb10BNaz12p2yHEcJon+wvP3JniKGufkbvDgPgCY8ZXKF4nGqPyo6K7J9BkfUrtktVaC110CWjdNPRU4stKyvqKqlb30jt2nqcnsz2FhZCZI7qsFPf1kh9WyOJWGKx9aw7xjA6upy+Zlqfa/Tk5Kej6EtZebFK8bTOyz0RGaWbiDu9QPWJv2RNQxnuYplOF8LKQhRxinWcYi1h5P1sJhVuG3+xO5A/gQ5wcTzB7RkZpRtJQaci3k999CZl8SEUORdPiLyioXCdOt5lHTeolVG7Cfz6ei+HgrmZ+cxZoMdSOi/2ZLe3sXgwhxZnTeQaddFbuDT5GQhRCGbw8gYbeIc2o0spWBVuG3+5O5Cz58tZoANcnUxwQ/al54wrvUBT5DK10S5UXU7AE6IQzeDlOJs4QyuajNhz6jfbvDxZnbt1STkN9KSm83JPlKR0j8sqbypE88JFqmN3UZBT74QQMEUxx9nM+zRLsOdA0KPylV3+nH6ncxroALemk1yeSOTyKQuGS4uwbu4MwViP0aUIIUxqDB8/YCuXaDC6lLz25Y0lWW8k80k5D/S0Dq/ciRBNySg9U2ypJJU33mdDtUytCyGWZoByXmQbXQSNLiXvrPPZ+aOtvpw/b84DHeDObIpzcl56RvivXiJ5eoBERKGmOUrb7swczSiEKAy3qeZ77GCQMqNLyRt/st1HU3HuG3MZEug6i6P0haSM0lfKOTqK643zRKc+/j2sborSsUdCXQixdBoKb9PBK2whiRx7vBrbyp18qbPYkOc2JNABBudSnBqWUfqy6Tr+k6eJXJjmYT+5iro4nftmUGy5LU0IYW2TlPCP7OMulUaXYkkK8JVdfoIeYz4UGXbJry+x43dJ4iyHKzSF/59+wML5h4c5wOSQiyvvyLGmQojlCSTnee78KT439C4O0kaXYzlPVrsMC3MwcIQOMBlN81Z/zKint5Tyy+8z/84o6dTSN0H4ypNs3D+D0y1b14QQjzY/4+DKjwPEo4uBVL4+yfFte+Te+hI5bQp/sduP32ncQNXQQAc4Oxqnd1ZWZj+MuhCh5PgJ5gdX9mnZVZRm88EZvH75HgshHmx61MW1k4H7BgzeQIrB/Wv4kbfToMqs41+0FPHperehNRge6PG0zg/uRElJs5n7FN28jfb2LVKJ1bUmUO06HXtDVNTJmgUhxMf1Xi2m99rDF3Gpdp3iPSrfrD9AjNzuq7aKGo/Kn+30YzO4X4/hgQ7QE0pyfkyazXxI1yk5/mOiXXMZfdiWzXM0dCxk9DGFENaUTitcPxlgamRprUnLWxMc376XQZtMwX/SH231sc6X+21qn2SKQAd4rTdKKC73epVEAt/33mRhJDsLUqoaYrTvnsWmmuLHLoQwQCJm4/KJUuZnljfi9gZSXDjYyXXPmixVZj1PVrv4zTav0WUAJgr06ZjGG31Ro8swlCMUwvXCSWLh7D5PkS9F576Q3FcXogDNh+xcOVFGPLqyxVsOl8bgwQZOlbVnuDLrcasKf7E7QInDHL3xTRPoAOdG49wp0AVyRcODaN+/uOr75UulqjrrdoQJNhf2hyghCslYn5tbZ/xo2uquMzZVJ/JEGa/W7chQZdb0r9YW8VStsQvhPspUgV6op7H5um8SO96Nls79p7zqxhhtu2QKXoh8lkoq3D7vY6zXk9HHtW108XzngYw+plXUe1X+dEduT1N7HFMFOkDvbIqzBdTn3Xf+ApF3hg2tQabghchfsxNOrp8KrHiK/XHsDSrfeeIwuqmiLfuM6tf+KKYLdIC3+2NMRPO/S5H/9BkWzkwYXcaHmjfO09g5b3QZQogM6btWzN2r2e8rbi9XeOnQAWIOZ9afywyerXPzhdYio8u4jykDfSGpc/xuhLTpKsuc0lOnmDs7bXQZ9/GUpFm/Y5bSatlGKIRVxRZUbpz2MzuZu4B1lsP3jxwkpuZ3qFe4bfy3nX6cRm86fwBTBjrArekklyfyM1TKT59k9kzI6DIeqaohxrrtYRwu2UoohJUMdhVx93IJaQPW5LgrdV44dCivQ/0/bPGx3m+uqfZ7TBvoOvB6Hu5ND5w6zfzZKaPLWBK7Q6dp4zz166UZjRBmF48ujspD48aGqbsGvnXwKGnjzv7KmgPVLv61SfacP4hpAx0gFNd4rTd/tlX5z51j4eSo0WUsm9efYv3OMP6K/JwxEcLqxvo83D7nI5U0xzSwq07h208eIZ1HZzh77Qp/uTuAx26O7/GDmDrQAa5OJrgxlTS6jFXzX7nEwluDRpexKpVrYrRumcPtzf8Fi0JYQSRsp+t9H6EJ801xOxpUvrP3MJpi3gBcjt/pKGZ3pfm+zx9l+kDXdDjeG2U+Yd2p95Ib14i+1mt0GRnTuGGehg0LqLJ3XQhDJGI27l4pYeROZveVZ5qy1sl3dxw0uoxV21Lm4MsbS4wu47FMH+gAU9E0b1r03HTPyDDp75xfdWcms3F5NJo3zxFsyp9bIkKYna7D4C0vvdeK7zvq1KwWdpbyWqt1O8q5VYX/vstPwMBzzpfKEoEOcGUiwc1pa029O8Kz2L/xY5Jxa7zxVqI4kKJ50xzltYXTDEgII0yPurh93kd0TjW6lGXrPdbCxYoWo8tYEStMtd9jmUDXdXitL8qsRVa9K8kU3v93nNis0ZXkhq8sSdOmecqCEuxCZNJ8yEH3+RJT3idfKodb451ndjLisdbRq09UOfnt9uw35skUywQ6wFxC44e9UazQ6j3wwnHm+wuvlaqvPEnL5jkCVbIiXojViC2o3L1SwlifeQ7/WA1PmcZ3nz5CjOUd2WqUMpeNP9vpx6NaZ4bVUoEOcHsmycVxc4eFWbvA5VKgKkHzpjn8Fda6TSKE0WIRlb5rxaZf8LYSnhaFb+w6ZnQZj6UA/3Grj1afORvIPIzlAh3g7YEYExFzbp0qutND4qWbRpdhGv6KJA0d83KPXYjHiEdU+q57Ge4xX4/wTIrsLOWHJl8k95k1bn6x2Xo/B0sGeiylc7w3SsJkzd7t4TDqP54gbZLmDmbiKU7T0DFPTYusihfioyJzdvpveBm9m38j8oe5/KlO7vhrjC7jgeq9Kv95ux8LzbR/yJKBDjA8n+bkkLm2svn/6WUWxo2uwtycHo2GtgVqWiOodku+9ITIiPC0g/7rxUwOuYwuJedcfo3nP3WMJOZase+wKfyXHT5qPOaqa6ksG+gAZ0fj9M6aY+FZ+el3mD1TIEvaM0C169S0RKhbF8FTbM7bJ0Jkw3i/m8EuL+EpaywOyxa1w8l3Npur6cwX13o5WmvdD1iWDvS0Bj/sM76LnGdilOQ3zhlag5WVBePUrYvIfXaRt5IJG6N3PAzeLiIeseboLxv6n2rifPlao8sAYFeFk9/dYJ0tag9i6UAHCMc1Xu+LGnp2esnXXyI6Y8EbLibj9qapbY1Q0xrF4bRGvwEhHkZLK0wMuhjv9zA1bN1RXza5ijVe/NQhIqqx359qj8qf7vCZ8ozz5bB8oAPcCaU4N2bM6K705LvMnZsx5LnzWbA5Sk1LVE54E5YTmnAy1uthvN9tmfasRrKvdfDtHYcMe36nTeFPtvuoLbL+zEleBDrAu0MxhuZzey/WOTWF9o+nc/qchcZTkqamOUKwKYrTI6N2YU6JmI3Rux5G7hZZsjWr0foONXEhaMzU++9uKGZXhXW78H1U3gR6StP5YW+UhWTu/jkl33iF6ISETK6U18Spbo5StcZcuxtEYUqnFCaH3Iz3u2VKfZVcJRovPHeUOLlt5HK4xsWvrfPm9DmzKW8CHSD0wf30XPyLSi5fIfp2f/afSNzH7tQINkWpboxRUiad6ETuJBM2JgddTAy6mR6REM+k9PZiXly3N2fPt8ar8sfb/NjNf4jaklmrr91jBFw2Nlc6uZTl1rBKKkXqdB+LDQJFrqUSNga7vAx2efEUp6lqXAz3ohJzbGEU+SUStjM14mJy0MXsZH5MzZqR+1qY0qYFZhzZHzG7VIUvdZbkVZhDno3Q7zk5FGM4i/fTAz8+yfyFUNYeX6xMcSBJdWOMqoYYriLZ2y5WRtdhdsLJ1LCLyWG33BPPIbXdyXe2ZH9v+pc3lrClLP/6AORloKd1eKs/ykws8/e3HXNhlK+dQEvL6NzMfOVJKupilNUkKA7ItLx4tNkJJ6EJB6EJF7MTDnl/G+jcT21hwFuZtcf/uSYPn23Izza7eRnoAPG0zht9mV8kV/bq64S7pAGKlTjdGhV1MUqDCcqCcWk5KwhNOAmNOQmNOy19zng+cjbY+OcnjmblsbeVO/lSp7WbxzxK3gY6wHxC4/W+GMkMHaDumpki/XXZpmZ1gaoEZTVxSqsTlJTK6L0QLMzamRlzMTO6GOCyP9zcrj7dQXdZXUYfs7ZI5U+2W795zKPkdaADTETSnBiMkYlML335deZ6ZHSeT+wOnUBVnNJggtKqBEU+WVhnddF5lYVZBwuzduamHcxOOkjG82z1U55zBG1861DmRulFdoX/usNPmSu/Xwd5tcr9QSqLVHYFXbw3srogdkxOSZjnoVRycS/x5JAbAJdHI1AVJ1CVwF+ZlJXzJpZKKiyEFoN7IWxnfsbBfMguo+88kBzVaJwdo89fverHsimLi+DyPcyhAEbo99yYSnJ1cuXb2QIvv868BHrBcTg1/FUJ/BVJ/JUJfLLvPefSKYVI2L4Y3B/+chCP5v8FupDZm1S+vefIqh/ni+u8HK0pjJ4BeT9Cv6ej3MFCUuPuCo5bdcyHJcwL1GIjETeTg4sjeJuq4ytLUlyaxOtP4/Un8QZSqGpBfC7OqlRSYWHWTiRs/0mAh+1yOlmBSvWmqdk8zYinbMWPcbjGVTBhDgU0QgfQgXcGY4wuLG+PctmJE4QvzmWnKJEX3N40xYEUXn+SopI0npIURb4UdkfBvL0eKh5RScRtJOM24lEbyZiNeFQlEbN98EslEbXJVLm4j63dxfNbDqzoazeVOfhyZwl5vAbuPgUzQofFvm776ty83R9leol71BV0IjfCSFc48SixBZXYgsrk0MdHAw6X9mHAe7xpHG4Nh1PD4frJL6fbWucBpBK2DwM6EVv8773fJ2KLgX3v96mkTIuLlVO6YxRtiBFxuJf1dS0ldn5vQ3FBhTkU2Aj9nqSm80ZfjLnE4y+k/suXWHh7MAdViUJmU3VU+6N+aR/+PtM0TUHTQE8ri79PL/6Z/sGfa2mFVEIhGVflvrXIubktpbzRvmPJfz/oUflP23wU2QsszSmwEfo9DpvCoTVuXu+LEks9+gKpXx3KUVWikGlpBS2tkJSlGkJ8TGnXNLQv7e/6HDb+cEtJQYY5QMF+3PbYFQ7Wu7E/Yk7GNT1JZLLgJjCEEMI0UlGF9tHHn2zpVhX+/eYSAs6CjbXCDXQAv8vGgfqHr4AsOn8lh9UIIYR4kA39dx/7d/5gUwn13sLeEVHQgQ5Q4VE5WO9+4JK3aPdCzusRQgjxccpgApUHr3lSgC91FrPOV5B3kD+m4AMdoNqrsvsTexW9d3pIJQrzPowQQphJOqmwe+DmA//fr633sq1cDtgBCfQPNfjsbK/+Sag7b/cZWI0QQoiPqu8bve/PPtvg4VCwcBrHPI4E+ke0Bux0Vix+0ovejRhcjRBCiHtSIxqe1E/ad++rcvJzTfl5rvlKSaB/woZyB2vnhmW6XQghTETXYFf/4rT7pjIHv9GWv+ear5QE+gNs3dpITYdsVxNCCDMpDYVZ6yvMLnBLIYH+AIrdyZ7f/hzBNmu15BRCiHzlDCrcPHiAf7epBIek+QMVZOvXpdJTCU599XnGbsnnHiGEMIqjVuHyp5/iD7YGcEqYP5QE+mNIqAshhHHstTauP/c0v7/FJ2H+GBLoS6CnEpz+6vOMSqgLIUTO2OtVrn36af5gsw+7XH4fSwJ9ifRUjNNffUFCXQghcsDeoHLz00/z+xslzJdKAn0Z9FSMU199QabfhRAii+wNKrc/8wy/11mCKrPsSyaBvkx6KsaZv/4ew1flVSaEEJlma3bS99xT/NsNss98uSTQV0DX0lz+xne5865saxNCiExJdRQRfuYIv77e+8ADs8SjSaCvlK5z86WXufnDCLrkuhBCrMrsjnJKju6Tdq6rIIG+Sj1vvcm1FyZIp+TzpBBCLJeiwOgTtWw4touDctDKqkigZ8DQ+bNc+IceknFZLCeEEEtlU3V6DrZy+MhmtssRqKsmgZ4h4103OP+3F4nOq0aXIoQQpqc6dK4e7eTzh9pp99uNLicvSKBnUHiwlzP/613mpuXFKYQQD+Mo0jl/bDu/ur+FhmIZBGWKBHqGxUITnP3frzHZJ6EuhBCf5AzonDu2l996op5qj4R5JkmgZ4GejHHu777HwEVZKCeEEPc4qhWuPneEf7O1HK9dro+ZJoGeLXqamy+9wq3XFtDS8sIVQhQ2bb2HiWcO8xvt0v0tWyTQs6z/vZNc+ecBEjFZAS+EKDyKAtO7qqg6uoefWiN7zLNJAj0Hpu50ce5vzrEwK/eLhBCFQ3XodB9cy7HDm9lS5jC6nLwngZ4j0ZkxzvzVG0wPymI5IUT+c3oXV7L/ypMtNMpK9pyQQM8hPRnl/f/7IoOXjK5ECCGyx1kBF545wO/srKbUJbcbc0UCPdd0jVuvvsatV0PSLlYIkXe0Ng+zzxzmV9aXyDnmOSaBbpCRq1e48LVrxBfkFS+EsD7VodO3r4kdh7exr0rauBpBAt1AcxMTnP2rN5gdlVAXQliXq1Tn0tHdfHFvA7VFcr/cKBLoBkunEpz9m5cYuZIyuhQhhFi+tS7GnznEr7b7cckGc0NJoJvE9eMnuP3SCJombwghhPnZ7Dqje+pZf2QnR2rk2FMzkEA3kcFrt7n89+fkvroQwtScfp0rR3bwhX3NNHhlit0sJNBNJjI3z/t/e5yp22mjSxFCiPsorU5GnznMr3b4ccsUu6lIoJvUjTffo/ulXlJxecMIIYynOnSG9zTQeXQ7B6plit2MJNBNbHZihnN//TqzQ/IjEkIYx1UO147t4Yu711DlkVuCZiWBbgEXnn+LgR+NSyMaIUROKQokN3hJPnOIX2otllPSTE4C3SLGe4e4+H/eYWFK3lFCiOxzeHS696/nqUMb2VgqB6tYgQS6xbz3tVcZfi9sdBlCiDxmb7YzePhJvrC5Er9TptitQgLdgvqvdnPtH94nNidvNCFE5jiKNPr3rWXn/s3srpT2rVYjgW5RiUiMs39/nPGrcaNLEULkAWW9i9DRA/xSRykeu9zasyIJdIu7e/4GXd+5RCQko3UhxPK5fBrd+zt5dn8HbX670eWIVZBAzwPpVIrz33yT4fdm0NLyyVoI8XiKTSfV4SX11CE+v7YYp02uHVYngZ5HxvuGuPoP7zI7LD9SIcTDuSqgZ/9mfvqJtTQVy6g8X0ig56Grr75L72sDJGPyiVsI8ROqQ2dmaxXVTz3Bs/Vu5AqRXyTQ89TC7BwXvv4GEzcSRpcihDCDBidDh/fyha1VlLlkzU0+kkDPc3fPX+fWt68QnZXP4kIUIrsXbu9p48ChDnZVyFa0fCaBXgBSySTnv/kmI2dCsmhOiAKhKDDXFkB7ai+/tL5ETkYrABLoBWS8b4gb3z7N9B05mlWIfKYHHfTu28HP7q6lpUQWvRUKCfQC1H/5Nre+e4H5caMrEUJkkiMAPTvbefJAOztler3gSKAXsJsnztF3vJtISKbihLAyh0dndEstTUd3cqTWI6eiFSgJ9AKnaRpXXj7J4IkhEhFZ+SqElah2nViHD47u47OtPrlPXuAk0AUAyVici8//iNEzM6SSclEQwuwcrXYmDu7hZzbVyDY0AUigi0+YD4W5/M0fMXE1gqZJsAthJooCziYbU/u28dS2Jmo8qtElCRORQBcPNDk4yrVvvct0d8roUoQoeIoCrgaFiSe2cGxHK3VFEuTifhLo4pFGuvvo+v77zNxJI68UIXLP3QATezdxdOd66r0S5OLhJNDFkoz3DnLze2eZ7k6ia0ZXI0T+K6rXGduzkUO722ksliAXjyeBLpZlamiMGy+cZupmTO6xC5FhigKOBhvhPR3s2yFBLpZHAl2syOzYJFdfOMXktYi0kxVilWyqjtbsZv7JbTyzqY5qWewmVkACXazK3HSIq8+fZOLKPOmUBLsQy6E6dCLr/CgHd/KptjL8Ttl+JlZOAl1kRCQc5sp3TzJ+MUwqIcEuxKOoHphuq8R3aCefbinGY5f3jFg9CXSRUbH5CNd+cIrx8xPE5mS0IcRH2apUJjuaaDu0kb2VLuzyFhEZJIEusub2uxcZeqebUL8mW95EwbI7dRItXmK7t3J4U43sIRdZI4Eusm5mZIJbr55h8uocyZgMSURhcFfqhNuCBPfv5Im6Ipw2mVYX2SWBLnJG19JcffUUY2eHmBuXi5vIP3anhq3ZSWpHOzu2tkkjGJFTEujCEEPXbnPnjSvM9CRldbywPE89RDtqady3nc2VRcgaN2EECXRhqGQsTtePLjB2YZDwoNxrF9ZRVJEm1lpGyd6t7GmpwispLgwmgS5MYz40T9dbF5m8OMLCpLwshfm4i9PoTR707e1s37SOGlngJkxEAl2Y0sTAFN1vXWL62iSJeaOrEYXMXZJGb/Cgb2iifXsnrT6H0SUJ8UAS6ML07lwZoP/ENeZ6wqTiRlcjCoG7+CMhvnMjrSV2o0sS4rEk0IWlDHSNMnj2JnPdkyyMy7FvInM8vjR6vRttQ7OEuLAkCXRhWZG5CD2nrjF9fYi5/jjJuCxKEkunKFBUmSa5xodrUysdnWupK5IQF9YlgS7yg67Td7mL0Qs9hO+EmZ+SBjbifnaHjrNWIdlYQdmODWxpqpbV6SJvSKCLvDQ/MU7/+S5mbo8THkxIX/kCVlSWRg+6UZqrqd+9hc4Kr9ElCZEVEuiiIIQGBxg4302oZ4rwUIpEVAI+H9lUHXeZjlbtQWmoonZbG+urS3GrMgoX+U8CXRSkkRtdjF3tZfZuiPCwTiopF3wrUu06rgodrboIW1MNjTvaaS0txiF900UBkkAXBU9Ppxnr7mW8a4hw/wyR0RiRkIIui+hNxWbTcQd09AoHBAN4W+to6Wih1utE4lsICXQhHuruxdtM3R5mbiBEZCwuDW5yzOPXUAIqelUxjsYgDVvWs65M7n8L8TAS6EIsUWQ+Tv/lXmbujhEdD5OYiZEIa6STRldmbTaHjhqwoZe7odJHUX0VzRubWONzy9S5EMsggS7EKoVnokzeGSA8PEF0PExsKkI8lCI6K2H0UbYi0IvtaCUutEAxarCc8rX1tK/xUeWRRYpCrJYEuhBZNNnbT2h4kuj0HLFQlEQ4RnIuSTKSJhmBeCQ/gszmBMWloLttaEVONJ8HSn24qssprymjucFH0CMHmQiRTRLoQhhI11LMjk0yNzFDZCpMdGaBxFycdCJFOqGhJdNoSR0tpaGndNJJffG/KdDSoKWUjJwnrzp0VIeOzQ6KA3DYUBwKOGzgUFFcKrjsKB43thIvTl8JRaU+/BWlVJW58Tny44OJEFb2/wFNCczfojXZEQAAAABJRU5ErkJggg=="
            id="avatar_svg__c"
            width={500}
            height={500}
          />
          <image
            xlinkHref={visemeMap[imageIndex]}
            id="avatar_svg__d"
            width={512}
            height={488}
          />
        </defs>
      </svg>
      <button className="button" onClick={handleClick}>
        {" "}
        Speak{" "}
      </button>
    </div>
  );
}
export default Avatar;
