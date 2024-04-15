const API_KEY = "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";

const maxImages = 4;
let selectedImageNumber = null;

function getRandomNumber(min, max) {
  return Math.random(Math.random() * (max - min + 1)) + min;
}

function disableGenerateButton() {
  document.getElementById("generate").disabled = true;
}
function enableGenerateButton() {
  document.getElementById("generate").disabled = false;
}

function clearImageGrid() {
  const imageGrid = document.getElementById("image-grid");
  imageGrid.innerHTML = "";
}
async function generateImages(input) {
  disableGenerateButton();
  clearImageGrid();
  const loading = document.getElementById("loading");
  loading.style.display = "block";

  const imageUrls = [];
  for (let i = 0; i < maxImages; i++) {
    const randomNumber = getRandomNumber(1, 100);
    const prompt = `${input} ${randomNumber}`;
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2/prompthero/openjourney-v4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    if (!response.ok) {
      alert("Failed to generate image!");
    }
    const blob = await response.blob();
    const imgUrl = URL.createObjectURL(blob);
    imageUrls.push(imgUrl);
    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = `art-${i + 1}`;
    img.onclick = () => downladImage(imgUrl, i);
    document.getElementById("image-grid").appendChild(img);
  }
  loading.style.display = "none";
  enableGenerateButton();
  selectedImageNumber = null;
}
