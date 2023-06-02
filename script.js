const colourForm = document.getElementById("colourForm");
const gptInput = document.getElementById("gptInput");
const colourInput = document.getElementById("colourInput");
const colourPalette = document.getElementById("colourPalette");
const downloadPaletteButton = document.getElementById("downloadPaletteButton");

colourForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const colours = colourInput.value.split(","); // Assuming colours are entered as comma-separated values
  updateBackground(colours);
});

function downloadcolourPalette() {
  if (downloadPaletteButton.classList.contains("disabled")) {
    return;
  }

  downloadPaletteButton.classList.add("disabled");
  downloadPaletteButton.textContent = "Downloading...";

  const colourBoxes = document.querySelectorAll(".colourBox");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Calculate the canvas size based on the number of colour boxes
  const size = Math.ceil(Math.sqrt(colourBoxes.length));
  const boxWidth = 200;
  const boxHeight = 200;
  canvas.width = size * boxWidth;
  canvas.height = size * boxHeight;

  let x = 0;
  let y = 0;

  // Draw each colour box on the canvas
  colourBoxes.forEach((colourBox, index) => {
    const imgData = colourBox.querySelector("img").src;
    const hexCode = colourBox.querySelector(".colourHex").textContent;

    const img = new Image();
    img.src = imgData;

    img.onload = function() {
      ctx.drawImage(img, x * boxWidth, y * boxHeight);
      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.fillText(hexCode, x * boxWidth + 10, y * boxHeight + boxHeight - 10);

      if (x < size - 1) {
        x++;
      } else {
        x = 0;
        y++;
      }

      if (index === colourBoxes.length - 1) {
        // All colour boxes are drawn
        // Convert the canvas to a downloadable image
        const downloadLink = document.createElement("a");
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.download = "colour_palette.png";
        downloadLink.click();

        downloadPaletteButton.classList.remove("disabled");
        downloadPaletteButton.textContent = "Download Palette";
      }
    };
  });
}

function generatecolourSvg(colour) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <rect width="200" height="200" fill="${colour}"/>
  </svg>`;
}

function updateBackground(colours) {
  const apiKey = gptInput.value;
  const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

  const prompt = `Generate only a list of up to 4 hex colour values separated by spaces for: ${colours.join(', ')}`;
  const maxTokens = 27; // Enough for 4 hex values only

  const requestBody = {
    prompt: prompt,
    max_tokens: maxTokens,
    temperature: 0.7
  };
    
  downloadPaletteButton.disabled = true;

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(data => {
      const generatedcolours = data.choices[0].text.trim().split(" ");

      document.body.style.background = generatedcolours.join(",");

      colourPalette.innerHTML = "";
      
      // This changes the background to the four colours.
      // I thought it would look good.
      // There's a reason it's commented out.
      //document.body.style.background = `linear-gradient(0deg, ${generatedcolours[0]} 0%, ${generatedcolours[0]} 25%, ${generatedcolours[1]} 25%, ${generatedcolours[1]} 50%, ${generatedcolours[2]} 50%, ${generatedcolours[2]} 75%, ${generatedcolours[3]} 75%, ${generatedcolours[3]} 100%)`;

      generatedcolours.forEach((colour, index) => {
        const colourBox = document.createElement("div");
        colourBox.classList.add("colourBox");

        const colourImg = document.createElement("img");
        colourImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(generatecolourSvg(colour));

        const colourHex = document.createElement("span");
        colourHex.classList.add("colourHex");

        var c = colour.substring(1);      // strip #
        var rgb = parseInt(c, 16);   // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff;  // extract red
        var g = (rgb >>  8) & 0xff;  // extract green
        var b = (rgb >>  0) & 0xff;  // extract blue

        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

        if (luma < 27) {
            colourHex.style = "color: white; background-color: black; display: block; text-align: center; ";
        } else {
            colourHex.style = "display: block; text-align: center;"
        }


          
        colourHex.textContent = colour;
        colourBox.appendChild(colourImg);
        colourBox.appendChild(colourHex);
        colourPalette.appendChild(colourBox);

        // Add extra empty colour box if there are less than 4 colours
        if (index === generatedcolours.length - 1 && generatedcolours.length < 4) {
          const emptycolourBox = document.createElement("div");
          emptycolourBox.classList.add("colourBox", "emptycolourBox");
          colourPalette.appendChild(emptycolourBox);
        }
      });

      // Enable the download button
      downloadPaletteButton.disabled = false;
    })
    .catch(error => {
      console.error('Error:', error);
      const errorlog = document.querySelector("#errorlog")
      errorlog.textContent = "Error: Please check OpenAI API Key"
    });
}

downloadPaletteButton.addEventListener("click", function() {
  downloadcolourPalette();
});

downloadPaletteButton.addEventListener("click", function() {
  downloadcolourPalette();
});

const sizeSelect = document.getElementById("sizeSelect");
const imageForm = document.getElementById("imageForm");
const imageDescription = document.getElementById("colourInput");
const generatedImage = document.getElementById("generatedImageContainer");
const generatedImageUrl = document.getElementById("generatedImageUrl");

imageForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const description = imageDescription.value;
  const selectedSize = sizeSelect.value;
  generateImage(description, selectedSize);
});

function generateImage(description, size) {
  // Generate the image using the description and colour palette
  const prompt = `Generate an image of ${description}, use primarily colours with hex codes ${getCurrentcolours().join(", ")}`;

  const requestBody = {
    prompt: prompt,
    n: 1,
    size: size,
  };
    
  fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + gptInput.value,
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      const image = data.data[0].url; // Access 'url' property from 'data' instead of 'generated_images'
      displayGeneratedImage(image);
      generatedImageUrl.innerHTML = `<a href="${image}" target="_blank">Link to Generated Image</a>`;
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle error cases
    });
}

function displayGeneratedImage(imageUrl) {
  const generatedImageContainer = document.getElementById("generatedImageContainer");
  
  // Remove any previously displayed image
  while (generatedImageContainer.firstChild) {
    generatedImageContainer.removeChild(generatedImageContainer.firstChild);
  }

  const image = document.createElement("img");
  image.src = imageUrl;
  generatedImageContainer.appendChild(image);

  generatedImageUrl.innerHTML = `<a href="${imageUrl}" target="_blank">Link to Generated Image</a>`;
}

function getCurrentcolours() {
  const colourBoxes = document.querySelectorAll(".colourBox");
  const colours = Array.from(colourBoxes).map((colourBox) => colourBox.querySelector(".colourHex").textContent);
  return colours;
}