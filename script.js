const wireColorsSelect = document.getElementById('wireColors');
const greenWireSizeGroup = document.getElementById('greenWireSizeGroup');
const greenWireSizeInput = document.getElementById('greenWireSize');
const wireOrderForm = document.getElementById('wireOrderForm');
const orderPullList = document.getElementById('orderPullList');
const outputSection = document.getElementById('outputSection');
const summaryBox = document.getElementById('orderSummaryText');
const preparationOptions = document.querySelectorAll('input[name="preparation"]');
const pulls = [];

wireColorsSelect.addEventListener('change', function() {
    const includesGreenWire = this.value.endsWith(' / Green');
    greenWireSizeGroup.classList.toggle('hidden', !includesGreenWire);
    greenWireSizeInput.required = includesGreenWire;

    if (!includesGreenWire) {
        greenWireSizeInput.value = '';
    }
});

function formatPull(pull, index) {
    const colors = pull.wireColors.split(': ').slice(1).join(': ').split(' / ');
    const wireLines = colors.map(color => {
        const size = color === 'Green' ? pull.greenWireSize : pull.wireSize;
        return `${pull.wireType} | ${pull.wireMaterial} | ${size} | ${color} | ${pull.wireLength} FT`;
    });

    return `Pull ${index + 1} - Pull ID: ${pull.pullId}\n${wireLines.join('\n')}`;
}

function renderOrder() {
    orderPullList.replaceChildren();

    pulls.forEach((pull, index) => {
        const item = document.createElement('li');
        const details = document.createElement('pre');
        const removeButton = document.createElement('button');

        details.textContent = formatPull(pull, index);
        removeButton.type = 'button';
        removeButton.className = 'remove-pull-btn';
        removeButton.dataset.index = index;
        removeButton.textContent = 'Remove pull';

        item.append(details, removeButton);
        orderPullList.append(item);
    });

    document.getElementById('pullCount').textContent = `${pulls.length} ${pulls.length === 1 ? 'pull' : 'pulls'}`;
    const selectedPreparation = Array.from(preparationOptions)
        .filter(option => option.checked)
        .map(option => option.value);
    const preparationText = `Preparation Instructions:\n${selectedPreparation.length
        ? selectedPreparation.map(option => `- ${option}`).join('\n')
        : '- None specified'}`;

    summaryBox.value = pulls.length
        ? `NEW WIRE ORDER REQUEST:\n\n${pulls.map(formatPull).join('\n\n')}\n\n${preparationText}`
        : '';
    outputSection.classList.toggle('hidden', pulls.length === 0);
}

preparationOptions.forEach(option => {
    option.addEventListener('change', renderOrder);
});

wireOrderForm.addEventListener('submit', function(e) {
    e.preventDefault();

    pulls.push({
        pullId: document.getElementById('pullId').value.trim(),
        wireSize: document.getElementById('wireSize').value,
        wireType: document.getElementById('wireType').value,
        wireMaterial: document.getElementById('wireMaterial').value,
        wireLength: document.getElementById('wireLength').value,
        wireColors: wireColorsSelect.value,
        greenWireSize: greenWireSizeInput.value.trim()
    });

    renderOrder();
    outputSection.scrollIntoView({ behavior: 'smooth' });
});

orderPullList.addEventListener('click', function(e) {
    if (e.target.matches('.remove-pull-btn')) {
        pulls.splice(Number(e.target.dataset.index), 1);
        renderOrder();
    }
});

document.getElementById('copyBtn').addEventListener('click', function() {
    summaryBox.select();
    navigator.clipboard.writeText(summaryBox.value)
        .then(() => {
            this.textContent = 'Copied to Clipboard!';
            setTimeout(() => {
                this.textContent = 'Copy Order to Clipboard';
            }, 2000);
        })
        .catch(() => {
            alert('Unable to copy the order. Please select and copy the summary manually.');
        });
});