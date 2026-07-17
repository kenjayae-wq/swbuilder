// SwBuilder - Core Code Generation Logic

document.addEventListener('DOMContentLoaded', () => {
    const extNameInput = document.getElementById('extName');
    const extIDInput = document.getElementById('extID');
    const blockTextInput = document.getElementById('blockText');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const codeOutput = document.getElementById('codeOutput');

    // Function to parse the user text and dynamically configure argument parameters
    function parseArguments(text) {
        const regex = /\[([^\]]+)\]/g;
        let match;
        const argsMap = {};

        while ((match = regex.exec(text)) !== null) {
            const argName = match[1].trim().toUpperCase().replace(/\s+/g, '_');
            argsMap[argName] = {
                type: "Scratch.ArgumentType.STRING",
                defaultValue: "world"
            };
        }
        return argsMap;
    }

    // Function to assemble valid structural Javascript code readable by PenguinMod
    function generateExtensionCode() {
        const rawName = extNameInput.value.trim() || "My Extension";
        // Clean ID string to strip illegal spaces or wild characters
        const cleanID = extIDInput.value.trim().replace(/[^a-zA-Z0-9]/g, '') || "myExtension";
        const blockText = blockTextInput.value.trim() || "hello [NAME]";
        
        const args = parseArguments(blockText);
        const argsString = Object.keys(args).map(key => `${key}`).join(', ');
        
        let argsConfigJSON = JSON.stringify(args, null, 12);
        // Replace inner quotes to produce accurate raw object mappings for TurboWarp/PenguinMod APIs
        argsConfigJSON = argsConfigJSON.replace(/"type":\s*"Scratch\.ArgumentType\.STRING"/g, '"type": Scratch.ArgumentType.STRING');

        const code = `/**
 * Generated using SwBuilder
 * Extension template targeting PenguinMod and TurboWarp environments.
 */

class SwBuilderExtension {
    getInfo() {
        return {
            id: '${cleanID}',
            name: '${rawName}',
            blocks: [
                {
                    opcode: 'swBuilderCustomBlock',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '${blockText}',
                    arguments: ${argsConfigJSON.trim()}
                }
            ]
        };
    }

    swBuilderCustomBlock(args) {
        // Core execution runtime code goes inside this block
        console.log("SwBuilder block triggered! Args:", args);
    }
}

Scratch.extensions.register(new SwBuilderExtension());
`;
        codeOutput.value = code;
    }

    // Function to trigger native browser script package download
    function downloadExtensionFile() {
        generateExtensionCode();
        const code = codeOutput.value;
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const cleanID = extIDInput.value.trim().replace(/[^a-zA-Z0-9]/g, '') || "extension";
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cleanID}.js`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Fire generation once immediately upon site initialization
    generateExtensionCode();

    // Event binding
    generateBtn.addEventListener('click', generateExtensionCode);
    downloadBtn.addEventListener('click', downloadExtensionFile);
});
