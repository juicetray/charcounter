const textArea = document.getElementById("textInput");
const charCountElement = document.getElementById("total-characters");
const wordCountElement = document.getElementById("word-count");
const sentenceCountElement = document.getElementById("sentence-count");
const letterDensityElement = document.getElementById("letter-density");

const getValue = () => {
    let charCount = textArea.value;
    console.log(`User typed: "${charCount}"`);

    let wordCount = countWords(charCount);
    let sentenceCount = countSentences(charCount);

    console.log(`Character count: ${charCount.length}`);
    console.log(`Word count: ${wordCount}`);
    console.log(`Sentence count: ${sentenceCount}`);

    updateUI(charCount.length, wordCount, sentenceCount);
};

const countWords = (text) => {
    const words = text.trim().match(/\b\w+\b/g);
    return words ? words.length : 0;
};

const countSentences = (text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    return sentences ? sentences.length : 0;
};

const countDensity = (text) => {
    let letterCounts = {};
    let totalLetters = 0;

    for (let char of text.toLowerCase()) {
        if (char.match(/[a-z]/)) { // Only count alphabetic letters
            letterCounts[char] = (letterCounts[char] || 0) + 1;
            totalLetters++;
        }
    }

    // Normalize the values based on the highest frequency
    let maxFrequency = Math.max(...Object.values(letterCounts), 1); // Avoid division by zero

    const letterDensity = {};
    for (let letter in letterCounts) {
        letterDensity[letter] = {
            percentage: ((letterCounts[letter] / totalLetters) * 100).toFixed(2),
            normalizedWidth: (letterCounts[letter] / maxFrequency) * 100 // Scale based on the most frequent letter
        };
    }

    return letterDensity;
};

const updateUI = (charCount, wordCount, sentenceCount) => {
    console.log(`✅ Updating UI → Characters: ${charCount}, Words: ${wordCount}, Sentences: ${sentenceCount}`);

    charCountElement.textContent = `${charCount} Total Characters`;
    wordCountElement.textContent = `${wordCount} Word Count`;
    sentenceCountElement.textContent = `${sentenceCount} Sentence Count`;
};

// Updates letter density only when the user stops typing
const updateLetterDensityUI = () => {
    let densityData = countDensity(textArea.value);
    console.log(`🔵 Updating Letter Density (on blur):`, densityData);

    // Clear previous content while keeping the existing heading
    let existingList = letterDensityElement.querySelector("ul");
    if (existingList) {
        existingList.remove(); // Remove previous letter density list
    }

    if (Object.keys(densityData).length === 0) {
        let noCharsMsg = letterDensityElement.querySelector("p");
        if (!noCharsMsg) {
            noCharsMsg = document.createElement("p");
            noCharsMsg.textContent = "No characters found. Start typing to see letter density.";
            letterDensityElement.appendChild(noCharsMsg);
        }
    } else {
        // Remove placeholder message if it exists
        let noCharsMsg = letterDensityElement.querySelector("p");
        if (noCharsMsg) noCharsMsg.remove();

        // Create a new unordered list
        const densityList = document.createElement("ul");

        for (let letter in densityData) {
            // Create list item
            const listItem = document.createElement("li");

            // Create label
            const label = document.createElement("span");
            label.textContent = `${letter.toUpperCase()}:`;

            // Create progress bar wrapper
            const progressWrapper = document.createElement("div");
            progressWrapper.classList.add("progress-wrapper");

            // Create progress bar
            const progressBar = document.createElement("div");
            progressBar.classList.add("progress-bar");
            progressBar.style.width = `${densityData[letter].normalizedWidth}%`;

            // Create percentage text
            const percentageText = document.createElement("span");
            percentageText.classList.add("progress-text");
            percentageText.textContent = `${densityData[letter].percentage}%`;

            // Append the created elements
            progressWrapper.appendChild(progressBar);
            progressWrapper.appendChild(percentageText);
            listItem.appendChild(label);
            listItem.appendChild(progressWrapper);
            densityList.appendChild(listItem);
        }

        letterDensityElement.appendChild(densityList);
    }
};

textArea.addEventListener("keyup", getValue);
textArea.addEventListener("blur", updateLetterDensityUI); // Update letter density only when the user stops typing
