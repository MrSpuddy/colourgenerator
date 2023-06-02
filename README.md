# Project Name: Colour Generator

This tool allows you to create unique colour palettes based on a given input, and download them in a palette format. You can also then generate an image using (hopefully) the generated colours.

This tool uses the OpenAI AI's via API to generate appropriate colours for an input, so bear in mind that it will require a created account and payment method added in order to use, though you can learn more about that here: https://platform.openai.com/account/api-keys

## How to Use

To get started, you will need to provide the following inputs:

1. **ChatGPT API Key**: In order to use this tool, you need to enter your ChatGPT API Key, as the tool is powered by it's API. This key is used only to access the API, and is not shared outside of your local browser apart from for authenication.

2. **Colour Palette Description**: Enter a description of the colour palette you would like to generate, which is then passed to the AI which creates a unique colour palette that matches your description as accurately as possible. This can be anything from "A sunny day" to "The feeling when you bite into a pickle and it's a little squishier than you expected".

3. **Image Size**: After generating a colour palette, you can decide to generate an image representing your colour palette, and so can choose the size you wish it to be. (Note: Larger images are more expensive to generate).

Once you've provided these inputs, the Colour Generator will work its magic and generate a beautiful colour palette for you. You can download the palette for future use or generate an image to visualize how the colours come together.

## Code Security

Rest assured, the code provided in the script.js file is safe to use. It focuses on handling user inputs, making API calls to OpenAI's services, and manipulating the Document Object Model (DOM) to display the generated results. There are no malicious or harmful behaviors present in the code.

To ensure the security of your ChatGPT API Key, the script.js file securely retrieves the key you entered and includes it in the Authorization header when making API requests. The API Key remains securely stored on the client-side and is not exposed or accessible to anyone else.
