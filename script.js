const wireColorsSelect = document.getElementById('wireColors');
const greenWireSizeGroup = document.getElementById('greenWireSizeGroup');
const greenWireSizeInput = document.getElementById('greenWireSize');

wireColorsSelect.addEventListener('change', function() {
    const includesGreenWire = this.value.split('/').includes('G');
    greenWireSizeGroup.classList.toggle('hidden', !includesGreenWire);
    greenWireSizeInput.required = includesGreenWire;

    if (!includesGreenWire) {
        greenWireSizeInput.value = '';
    }
});

document.getElementById('wireOrderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const routeName = document.getElementById('wireRouteName').value;
    const wireSize = document.getElementById('wireSize').value;
    const wireType = document.getElementById('wireType').value;
    const wireLength = document.getElementById('wireLength').value;
    const wireColors = document.getElementById('wireColors').value;
    const greenWireSize = greenWireSizeInput.value.trim();

    // Format the order output text string
    const orderText = `NEW WIRE ORDER REQUEST:\n` +
                      `------------------------\n` +
                      `Route Name: ${routeName}\n` +
                      `Wire Size: ${wireSize}\n` +
                      (greenWireSize ? `Green Wire Size: ${greenWireSize}\n` : '') +
                      `Wire Type: ${wireType}\n` +
                      `Length: ${wireLength} FT\n` +
                      `Configuration / Colors: ${wireColors}`;

    // Display the output section and set text
    const outputSection = document.getElementById('outputSection');
    const summaryBox = document.getElementById('orderSummaryText');
    
    summaryBox.value = orderText;
    outputSection.classList.remove('hidden');
    
    // Scroll smoothly to output
    outputSection.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('copyBtn').addEventListener('click', function() {
    const summaryBox = document.getElementById('orderSummaryText');
    summaryBox.select();
    navigator.clipboard.writeText(summaryBox.value).then(() => {
        this.textContent = 'Copied to Clipboard!';
        setTimeout(() => {
            this.textContent = 'Copy Order to Clipboard';
        }, 2000);
    });
});